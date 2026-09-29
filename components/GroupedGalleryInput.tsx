'use client'

import {ArrowDownIcon, ArrowUpIcon, ChevronDownIcon, ChevronRightIcon} from '@sanity/icons'
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
 * existing `category` field, with Move up / Move down buttons.
 *
 * - Display only: nothing is copied or restructured in the stored document.
 * - Upload / "Add item" controls and the file drop-zone are Sanity's own.
 * - Every image row is Sanity's own item UI (edit dialog, hotspot, alt,
 *   caption, category, duplicate, delete).
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
    onItemMove,
    readOnly,
  } = props

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const toggle = useCallback(
    (key: string) => setCollapsed((prev) => ({...prev, [key]: !prev[key]})),
    [],
  )

  const options = useMemo(() => getCategoryOptions(schemaType), [schemaType])
  const groups = useMemo(() => buildGroups(members, options), [members, options])

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
                  {group.members.map((member, position) => {
                    const previous = group.members[position - 1]
                    const next = group.members[position + 1]

                    // Moving to a neighbour's array index swaps their order,
                    // even when photos from other categories sit between them.
                    const move = (target?: ArrayOfObjectsMember) => {
                      if (member.kind !== 'item' || target?.kind !== 'item') return
                      onItemMove({fromIndex: member.index, toIndex: target.index})
                    }
                    const canMove = member.kind === 'item' && !readOnly

                    return (
                      <Flex key={member.key} align="center" gap={1}>
                        <Box flex={1} style={{minWidth: 0}}>
                          <ArrayOfObjectsInputMember
                            member={member}
                            renderAnnotation={renderAnnotation}
                            renderBlock={renderBlock}
                            renderField={renderField}
                            renderInlineBlock={renderInlineBlock}
                            renderInput={renderInput}
                            renderItem={renderItem}
                            renderPreview={renderPreview}
                          />
                        </Box>

                        {canMove && (
                          <Flex direction="column" gap={1}>
                            <Button
                              mode="ghost"
                              padding={2}
                              fontSize={1}
                              icon={ArrowUpIcon}
                              title="Move up"
                              aria-label="Move up"
                              disabled={!previous}
                              onClick={() => move(previous)}
                            />
                            <Button
                              mode="ghost"
                              padding={2}
                              fontSize={1}
                              icon={ArrowDownIcon}
                              title="Move down"
                              aria-label="Move down"
                              disabled={!next}
                              onClick={() => move(next)}
                            />
                          </Flex>
                        )}
                      </Flex>
                    )
                  })}
                </Flex>
              </Box>
            )}
          </Card>
        )
      })}
    </Flex>
  )
}