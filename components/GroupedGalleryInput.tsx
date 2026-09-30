import {memo, useCallback, useMemo, useRef, useState} from "react"
import type {DragEvent} from "react"
import {Badge, Box, Button, Card, Dialog, Flex, Select, Stack, Text, TextInput} from "@sanity/ui"
import {ChevronDownIcon, ChevronRightIcon, TrashIcon, UploadIcon} from "@sanity/icons"
import {insert, set, setIfMissing, unset, useClient, useFormValue} from "sanity"
import type {ArrayOfObjectsInputProps} from "sanity"

import {GALLERY_CATEGORIES} from "@/components/Gallerycategories"

// -------------------------------------------------------------------
// Types & helpers
// -------------------------------------------------------------------

type GalleryItem = {
  _key: string
  _type?: string
  asset?: {_ref?: string; _type?: string}
  alt?: string
  caption?: string
  category?: string
}

const API_VERSION = "2024-01-01"
const KNOWN = GALLERY_CATEGORIES as readonly string[]

const catOf = (item: GalleryItem) => (item.category || "").trim()
const titleOf = (cat: string) => cat || "Uncategorised"

const newKey = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID().replace(/-/g, "")
    : Math.random().toString(36).slice(2) + Date.now().toString(36)
  ).slice(0, 12)

function withCategory(item: GalleryItem, cat: string): GalleryItem {
  if (cat) return {...item, category: cat}
  const {category: _removed, ...rest} = item
  return rest
}

// Small resized thumbnail straight from the image CDN (no document queries,
// so 150+ photos stay fast). Parsed from the asset reference:
// image-<hash>-<width>x<height>-<ext>
function thumbUrl(ref: string | undefined, projectId: string, dataset: string, size: number) {
  const m = /^image-([a-zA-Z0-9]+)-(\d+x\d+)-([a-z0-9]+)$/.exec(ref || "")
  if (!m) return ""
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${m[1]}-${m[2]}.${m[3]}?w=${size}&h=${size}&fit=crop&auto=format&q=70`
}

function categoryRank(cat: string) {
  if (!cat) return 1_000_000
  const i = KNOWN.indexOf(cat)
  return i === -1 ? 1000 : i
}

// -------------------------------------------------------------------
// Thumbnail (memoised: dragging only re-renders the tiles that change)
// -------------------------------------------------------------------

type ThumbProps = {
  item: GalleryItem
  index: number
  url: string
  isOver: boolean
  disabled: boolean
  onOpen: (key: string) => void
  onDragStart: (e: DragEvent<HTMLDivElement>, key: string) => void
  onDragOver: (e: DragEvent<HTMLDivElement>, key: string) => void
  onDrop: (e: DragEvent<HTMLDivElement>, key: string) => void
  onDragEnd: () => void
}

const Thumb = memo(function Thumb(p: ThumbProps) {
  const {item} = p
  return (
    <div
      draggable={!p.disabled}
      onDragStart={(e) => p.onDragStart(e, item._key)}
      onDragOver={(e) => p.onDragOver(e, item._key)}
      onDrop={(e) => p.onDrop(e, item._key)}
      onDragEnd={p.onDragEnd}
      onClick={() => p.onOpen(item._key)}
      title={item.alt || "Click to edit"}
      style={{
        position: "relative",
        aspectRatio: "1 / 1",
        borderRadius: 4,
        overflow: "hidden",
        cursor: p.disabled ? "pointer" : "grab",
        background: "var(--card-skeleton-color-from, #333)",
        outline: p.isOver ? "3px solid var(--card-focus-ring-color, #4c8bf5)" : "1px solid var(--card-border-color)",
        outlineOffset: p.isOver ? 1 : 0,
      }}
    >
      {p.url && (
        <img
          src={p.url}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          style={{width: "100%", height: "100%", objectFit: "cover", display: "block"}}
        />
      )}
      <span
        style={{
          position: "absolute",
          top: 4,
          left: 4,
          fontSize: 11,
          lineHeight: 1,
          padding: "3px 5px",
          borderRadius: 3,
          background: "rgba(0,0,0,0.65)",
          color: "#fff",
        }}
      >
        {p.index + 1}
      </span>
      {!item.alt && (
        <span
          title="Alt text missing"
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            fontSize: 11,
            lineHeight: 1,
            padding: "3px 5px",
            borderRadius: 3,
            background: "#c0392b",
            color: "#fff",
          }}
        >
          alt!
        </span>
      )}
    </div>
  )
})

// -------------------------------------------------------------------
// Main input
// -------------------------------------------------------------------

export function GroupedGalleryInput(props: ArrayOfObjectsInputProps<GalleryItem>) {
  const {value, onChange, readOnly} = props

  const client = useClient({apiVersion: API_VERSION})
  const {projectId = "", dataset = ""} = client.config()
  const projectTitle = useFormValue(["title"]) as string | undefined

  const items = useMemo(() => (value || []) as GalleryItem[], [value])
  const itemsRef = useRef(items)
  itemsRef.current = items
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const [uploadCategory, setUploadCategory] = useState<string>(GALLERY_CATEGORIES[0])
  const [progress, setProgress] = useState<{done: number; total: number; failed: number; running: boolean} | null>(null)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [overKey, setOverKey] = useState<string | null>(null)
  const [editKey, setEditKey] = useState<string | null>(null)
  const dragRef = useRef<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  // ---- group photos by category (array order is kept inside each group) ----
  const groups = useMemo(() => {
    const map = new Map<string, GalleryItem[]>()
    items.forEach((it) => {
      const c = catOf(it)
      const list = map.get(c)
      if (list) list.push(it)
      else map.set(c, [it])
    })
    return [...map.entries()].sort((a, b) => categoryRank(a[0]) - categoryRank(b[0]) || a[0].localeCompare(b[0]))
  }, [items])

  // dropdown options: known categories + any other value already used (e.g. old data)
  const categoryOptions = useMemo(() => {
    const extra = groups.map((g) => g[0]).filter((c) => c && !KNOWN.includes(c))
    return [...GALLERY_CATEGORIES, ...extra] as string[]
  }, [groups])

  // ---- move (drag & drop) ----
  const moveItem = useCallback((fromKey: string, toKey: string | null, toCategory: string) => {
    const list = itemsRef.current
    const from = list.find((i) => i._key === fromKey)
    if (!from) return

    if (toKey) {
      // dropped on another photo -> take its place (and its category)
      if (toKey === fromKey) return
      const target = list.find((i) => i._key === toKey)
      if (!target) return
      const cat = catOf(target)
      const inCat = list.filter((i) => catOf(i) === cat)
      const fromIdx = inCat.findIndex((i) => i._key === fromKey)
      const toIdx = inCat.findIndex((i) => i._key === toKey)
      const position = fromIdx !== -1 && fromIdx < toIdx ? "after" : "before"
      onChangeRef.current([
        unset([{_key: fromKey}]),
        insert([withCategory(from, cat)], position, [{_key: toKey}]),
      ])
      return
    }

    // dropped on empty space of a category section -> go to the end of it
    const inCat = list.filter((i) => catOf(i) === toCategory)
    const last = inCat[inCat.length - 1]
    if (!last || last._key === fromKey) return
    onChangeRef.current([
      unset([{_key: fromKey}]),
      insert([withCategory(from, toCategory)], "after", [{_key: last._key}]),
    ])
  }, [])

  const onDragStart = useCallback((e: DragEvent<HTMLDivElement>, key: string) => {
    dragRef.current = key
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", key)
  }, [])

  const onDragOver = useCallback((e: DragEvent<HTMLDivElement>, key: string) => {
    if (!dragRef.current) return
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = "move"
    setOverKey((k) => (k === key ? k : key))
  }, [])

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>, key: string) => {
      if (!dragRef.current) return
      e.preventDefault()
      e.stopPropagation()
      const from = dragRef.current
      dragRef.current = null
      setOverKey(null)
      moveItem(from, key, "")
    },
    [moveItem],
  )

  const onDragEnd = useCallback(() => {
    dragRef.current = null
    setOverKey(null)
  }, [])

  // ---- upload ----
  const handleFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList)
        .filter((f) => f.type.startsWith("image/"))
        .sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true}))
      if (!files.length) return

      const category = uploadCategory
      const alt = `${projectTitle || "Project"} - ${category}`
      let cursor = 0
      let done = 0
      let failed = 0
      setProgress({done: 0, total: files.length, failed: 0, running: true})

      const worker = async () => {
        while (cursor < files.length) {
          const file = files[cursor++]
          try {
            const asset = await client.assets.upload("image", file, {filename: file.name})
            onChangeRef.current([
              setIfMissing([]),
              insert(
                [{_key: newKey(), _type: "image", asset: {_type: "reference", _ref: asset._id}, alt, category}],
                "after",
                [-1],
              ),
            ])
          } catch (err) {
            failed++
            console.error("Gallery upload failed:", file.name, err)
          }
          done++
          setProgress({done, total: files.length, failed, running: true})
        }
      }

      await Promise.all([worker(), worker(), worker()]) // 3 uploads at a time
      setProgress({done, total: files.length, failed, running: false})
    },
    [client, uploadCategory, projectTitle],
  )

  // ---- edit dialog ----
  const editItem = editKey ? items.find((i) => i._key === editKey) : undefined
  const openEdit = useCallback((key: string) => setEditKey(key), [])

  const patchField = (field: "alt" | "caption" | "category", v: string) => {
    if (!editKey) return
    const path = [{_key: editKey}, field]
    onChange(v || field === "alt" ? set(v, path) : unset(path))
  }

  // -------------------------------------------------------------------

  return (
    <Stack gap={4}>
      {/* ONE upload component: pick a category, then upload into it */}
      {!readOnly && (
        <Card
          padding={4}
          radius={2}
          border
          tone="primary"
          onDragOver={(e: DragEvent<HTMLDivElement>) => {
            if (e.dataTransfer.types.includes("Files")) e.preventDefault()
          }}
          onDrop={(e: DragEvent<HTMLDivElement>) => {
            if (e.dataTransfer.files?.length) {
              e.preventDefault()
              handleFiles(e.dataTransfer.files)
            }
          }}
        >
          <Stack gap={3}>
            <Text size={1} weight="semibold">
              Add photos
            </Text>
            <Flex gap={3} align="flex-end" wrap="wrap">
              <Box style={{minWidth: 200}}>
                <Stack gap={2}>
                  <Text size={0} muted>
                    Category
                  </Text>
                  <Select value={uploadCategory} onChange={(e) => setUploadCategory(e.currentTarget.value)}>
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                </Stack>
              </Box>
              <Button
                icon={UploadIcon}
                text={`Upload to ${uploadCategory}`}
                tone="primary"
                disabled={!!progress?.running}
                onClick={() => fileInput.current?.click()}
              />
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => {
                  if (e.currentTarget.files) handleFiles(e.currentTarget.files)
                  e.currentTarget.value = ""
                }}
              />
            </Flex>
            <Text size={1} muted>
              Choose the category, then select photos (many at once) or drag them onto this box.
            </Text>
            {progress && (
              <Flex align="center" gap={3}>
                <Text size={1}>
                  {progress.running ? "Uploading" : "Finished"}: {progress.done} / {progress.total}
                  {progress.failed ? ` (${progress.failed} failed)` : ""}
                </Text>
                {!progress.running && <Button mode="ghost" fontSize={1} text="Dismiss" onClick={() => setProgress(null)} />}
              </Flex>
            )}
          </Stack>
        </Card>
      )}

      {/* Photos under their category titles */}
      {groups.length === 0 && (
        <Card padding={4} border radius={2}>
          <Text size={1} muted>
            No photos yet.
          </Text>
        </Card>
      )}

      {groups.map(([cat, list]) => {
        const isCollapsed = !!collapsed[cat]
        return (
          <Card
            key={cat || "__none"}
            border
            radius={2}
            padding={3}
            tone={cat ? "default" : "caution"}
            onDragOver={(e: DragEvent<HTMLDivElement>) => {
              if (!dragRef.current) return
              e.preventDefault()
            }}
            onDrop={(e: DragEvent<HTMLDivElement>) => {
              if (!dragRef.current) return
              e.preventDefault()
              const from = dragRef.current
              dragRef.current = null
              setOverKey(null)
              moveItem(from, null, cat)
            }}
          >
            <Stack gap={3}>
              <Flex align="center" gap={2}>
                <Button
                  mode="bleed"
                  icon={isCollapsed ? ChevronRightIcon : ChevronDownIcon}
                  text={titleOf(cat)}
                  fontSize={2}
                  onClick={() => setCollapsed((s) => ({...s, [cat]: !s[cat]}))}
                />
                <Badge tone={cat ? "primary" : "caution"}>
                  {list.length} {list.length === 1 ? "photo" : "photos"}
                </Badge>
              </Flex>

              {!isCollapsed && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                    gap: 8,
                  }}
                >
                  {list.map((item, index) => (
                    <Thumb
                      key={item._key}
                      item={item}
                      index={index}
                      url={thumbUrl(item.asset?._ref, projectId, dataset, 240)}
                      isOver={overKey === item._key}
                      disabled={!!readOnly}
                      onOpen={openEdit}
                      onDragStart={onDragStart}
                      onDragOver={onDragOver}
                      onDrop={onDrop}
                      onDragEnd={onDragEnd}
                    />
                  ))}
                </div>
              )}
            </Stack>
          </Card>
        )
      })}

      {/* Edit photo: alt text, caption, category, delete */}
      {editItem && (
        <Dialog id="gallery-edit-photo" header="Edit photo" width={1} onClose={() => setEditKey(null)}>
          <Box padding={4}>
            <Stack gap={4}>
              {thumbUrl(editItem.asset?._ref, projectId, dataset, 900) && (
                <img
                  src={thumbUrl(editItem.asset?._ref, projectId, dataset, 900)}
                  alt=""
                  style={{width: "100%", maxHeight: 320, objectFit: "contain", borderRadius: 4}}
                />
              )}

              <Stack gap={2}>
                <Text size={1} weight="semibold">
                  Alt text (required)
                </Text>
                <TextInput
                  value={editItem.alt || ""}
                  disabled={readOnly}
                  customValidity={editItem.alt ? undefined : "Alt text is required"}
                  onChange={(e) => patchField("alt", e.currentTarget.value)}
                />
              </Stack>

              <Stack gap={2}>
                <Text size={1} weight="semibold">
                  Caption (optional)
                </Text>
                <TextInput
                  value={editItem.caption || ""}
                  disabled={readOnly}
                  onChange={(e) => patchField("caption", e.currentTarget.value)}
                />
              </Stack>

              <Stack gap={2}>
                <Text size={1} weight="semibold">
                  Category
                </Text>
                <Select
                  value={catOf(editItem)}
                  disabled={readOnly}
                  onChange={(e) => patchField("category", e.currentTarget.value)}
                >
                  <option value="">Uncategorised</option>
                  {categoryOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </Stack>

              <Flex gap={2}>
                <Button text="Done" tone="primary" onClick={() => setEditKey(null)} />
                {!readOnly && (
                  <Button
                    icon={TrashIcon}
                    text="Delete photo"
                    tone="critical"
                    mode="ghost"
                    onClick={() => {
                      if (window.confirm("Remove this photo from the gallery?")) {
                        onChange(unset([{_key: editItem._key}]))
                        setEditKey(null)
                      }
                    }}
                  />
                )}
              </Flex>
            </Stack>
          </Box>
        </Dialog>
      )}
    </Stack>
  )
}