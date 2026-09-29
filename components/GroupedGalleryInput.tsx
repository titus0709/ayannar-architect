'use client'

import {ChevronDownIcon, ChevronRightIcon} from '@sanity/icons'
import {Box, Button, Card, Flex} from '@sanity/ui'
import {useCallback, useMemo, useState} from 'react'
import {
  ArrayOfObjectsInputMember,
  type ArrayOfObjectsInputProps,
  type ArrayOfObjectsMember,
  type ObjectSchemaType,
} from 'sanity'

/**
 * Gallery input that groups the existing `gallery[]` items by their
 * existing `category` field.
 *
 * - It only changes how the array is DISPLAYED in the Studio.
 * - Nothing is moved, copied or restructured in the stored document.
 * - The upload / "Add item" controls and file drag-and-drop area are
 *   Sanity's own (rendered through `renderDefault`).
 * - Every image row is Sanity's own item UI, so the edit dialog
 *   (image, hotspot/crop, alt, caption, category), duplicate and delete
 *   keep working exactly as before.
 */

const UNCATEGORISED_KEY = '__uncategorised__'
const INVALID_KEY = '__invalid__'

type CategoryOption = {value: string; title: string}

type Group = {
  key: string
  title: string
  members: ArrayOfObjectsMember[]
  needsAttention?: boolean
}

/** Reads the category dropdown list from the schema, so it stays defined in ONE place. */
function getCategoryOptions(schemaType: ArrayOfObjectsInputProps['schemaType']): CategoryOption[] {
  const imageType = schemaType.of[0] as ObjectSchemaType | undefined
  const categoryField = imageType?.fields?.find((field) => field.name === 'category')
  const list = (
    categoryField?.type.options as
      | {list?: Array<string | {title?: string; value: string}>}
      | undefined
  )?.list

  return (list ?? []).map((entry) =>
    typeof entry === 'string'
      ? {value: entry, title: entry}
      : {value: entry.value, title: entry.title ?? entry.value},
  )
}

function buildGroups(members: ArrayOfObjectsMember[], options: CategoryOption[]): Group[] {
  const buckets = new Map<string, ArrayOfObjectsMember[]>()
  const add = (key: string, member: ArrayOfObjectsMember) => {
    const bucket = buckets.get(key)
    if (bucket) bucket.push(member)
    else buckets.set(key, [member])
  }

  for (const member of members) {
    if (member.kind !== 'item') {
      add(INVALID_KEY, member)
      continue
    }
    const category = (member.item.value as {category?: unknown} | undefined)?.category
    add(typeof category === 'string' && category ? category : UNCATEGORISED_KEY, member)
  }

  const groups: Group[] = []

  // Freshly uploaded photos have no category yet: show them first so they are noticed.
  const uncategorised = buckets.get(UNCATEGORISED_KEY)
  if (uncategorised) {
    groups.push({
      key: UNCATEGORISED_KEY,
      title: 'Needs a category',
      members: uncategorised,
      needsAttention: true,
    })
  }

  // Categories in the same order as the dropdown.
  const known = new Set<string>()
  for (const option of options) {
    known.add(option.value)
    const bucket = buckets.get(option.value)
    if (bucket) groups.push({key: option.value, title: option.title, members: bucket})
  }

  // Values that are no longer in the dropdown (e.g. renamed categories) - never hide photos.
  for (const [key, bucket] of buckets) {
    if (key === UNCATEGORISED_KEY || key === INVALID_KEY || known.has(key)) continue
    groups.push({key, title: key, members: bucket})
  }

  const invalid = buckets.get(INVALID_KEY)
  if (invalid) {
    groups.push({key: INVALID_KEY, title: 'Items with problems', members: invalid, needsAttention: true})
  }

  return groups
}

export function GroupedGalleryInput(props: ArrayOfObjectsInputProps) {
  const {
    members,
    schemaType,
    renderDefault,
    renderAnnotation,
    renderBlock,
    renderField,
    renderInlineBlock,
    renderInput,
    renderItem,
    renderPreview,
  } = props

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const toggle = useCallback(
    (key: string) => setCollapsed((prev) => ({...prev, [key]: !prev[key]})),
    [],
  )

  const options = useMemo(() => getCategoryOptions(schemaType), [schemaType])
  const groups = useMemo(() => buildGroups(members, options), [members, options])

  // Same schema type, only the "empty list" message differs (inherited via prototype).
//   const controlsSchemaType = useMemo(
//     () =>
//       Object.create(schemaType, {
//         placeholder: {
//           value: 'Use Upload to add photographs. They are listed by category below.',
//           enumerable: true,
//         },
//       }) as typeof schemaType,
//     [schemaType],
//   )

  return (
    <Flex direction="column" gap={4}>
      {/* Sanity's own Add / Upload buttons and file drop-zone, with the flat list hidden */}
            {renderDefault({...props, members: []})}

      {groups.map((group) => {
        // Never hide an item whose edit dialog is open.
        const hasOpenItem = group.members.some((member) => member.kind === 'item' && member.open)
        const isOpen = !collapsed[group.key] || hasOpenItem

        return (
          <Card
            key={group.key}
            border
            radius={2}
            tone={group.needsAttention ? 'caution' : 'default'}
          >
            <Button
              mode="bleed"
              width="fill"
              justify="flex-start"
              padding={3}
              fontSize={1}
              icon={isOpen ? ChevronDownIcon : ChevronRightIcon}
              text={`${group.title} (${group.members.length})`}
              aria-expanded={isOpen}
              onClick={() => toggle(group.key)}
            />

            {isOpen && (
              <Box padding={2} paddingTop={0}>
                <Flex direction="column" gap={1}>
                  {group.members.map((member) => (
                    <ArrayOfObjectsInputMember
                      key={member.key}
                      member={member}
                      renderAnnotation={renderAnnotation}
                      renderBlock={renderBlock}
                      renderField={renderField}
                      renderInlineBlock={renderInlineBlock}
                      renderInput={renderInput}
                      renderItem={renderItem}
                      renderPreview={renderPreview}
                    />
                  ))}
                </Flex>
              </Box>
            )}
          </Card>
        )
      })}
    </Flex>
  )
}