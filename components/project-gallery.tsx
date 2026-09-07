"use client"

import Image from "next/image"
import { useCallback, useEffect, useMemo, useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

import { urlFor } from "@/sanity/lib/image"
import type { Image as SanityImageType } from "sanity"

export type GalleryItem = SanityImageType & {
  _key: string
  alt?: string | null
  caption?: string | null
  category?: string | null
}

export function ProjectGallery({ items }: { items: GalleryItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [active, setActive] = useState<number | null>(null)

  /*
   * Get unique categories from Sanity.
   * Empty categories are grouped under "Other".
   */
  const categories = useMemo(() => {
    const categorySet = new Set<string>()

    items.forEach((item) => {
      if (item.category?.trim()) {
        categorySet.add(item.category.trim())
      } else {
        categorySet.add("Other")
      }
    })

    return Array.from(categorySet)
  }, [items])

  /*
   * Select the first category automatically.
   */
  useEffect(() => {
    if (categories.length > 0 && !categories.includes(selectedCategory)) {
      setSelectedCategory(categories[0])
    }
  }, [categories, selectedCategory])

  /*
   * Images belonging to the currently selected category.
   */
  const filteredItems = useMemo(() => {
    if (!selectedCategory) return []

    return items.filter((item) => {
      const category = item.category?.trim() || "Other"
      return category === selectedCategory
    })
  }, [items, selectedCategory])

  /*
   * Close fullscreen viewer.
   */
  const close = useCallback(() => {
    setActive(null)
  }, [])

  /*
   * Previous image within the CURRENT category.
   */
  const prev = useCallback(() => {
    setActive((i) =>
      i === null
        ? i
        : (i - 1 + filteredItems.length) % filteredItems.length,
    )
  }, [filteredItems.length])

  /*
   * Next image within the CURRENT category.
   */
  const next = useCallback(() => {
    setActive((i) =>
      i === null ? i : (i + 1) % filteredItems.length,
    )
  }, [filteredItems.length])

  /*
   * Keyboard controls for fullscreen viewer.
   */
  useEffect(() => {
    if (active === null) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [active, close, prev, next])

  /*
   * Reset fullscreen viewer whenever category changes.
   */
  useEffect(() => {
    setActive(null)
  }, [selectedCategory])

  if (!items || items.length === 0) return null

  const activeItem = active === null ? null : filteredItems[active]

  return (
    <>
      {/* Category Navigation */}
      <div className="mb-8 border-b border-gold/15 sm:mb-10 lg:mb-12">
        <div
          className="flex flex-wrap gap-x-6 gap-y-3 pb-4 sm:gap-x-8"
          role="tablist"
          aria-label="Gallery categories"
        >
          {categories.map((category) => {
            const isActive = selectedCategory === category

            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedCategory(category)}
                className={`relative shrink-0 pb-4 text-xs uppercase tracking-[0.22em] transition-colors ${
                  isActive
                    ? "text-gold"
                    : "text-stone-dim hover:text-stone"
                }`}
              >
                {category}

                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-px bg-gold" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Current Category Title */}
      {selectedCategory && (
        <div className="mb-8">
          <p className="text-xs uppercase tracking-label text-gold">
            {selectedCategory}
          </p>
        </div>
      )}

      {/* Gallery Images */}
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 *:mb-4">
        {filteredItems.map((item, i) => {
          const thumb = urlFor(item).width(900).quality(75).url()

          return (
            <button
              key={item._key}
              type="button"
              onClick={() => setActive(i)}
              className="group relative block w-full overflow-hidden"
              aria-label={`View image ${i + 1}${
                item.caption ? `: ${item.caption}` : ""
              }`}
            >
              <Image
                src={thumb || "/placeholder.svg"}
                alt={item.alt ?? ""}
                width={900}
                height={0}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                style={{ height: "auto" }}
                className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />

              <span className="pointer-events-none absolute inset-0 bg-background/0 transition-colors group-hover:bg-background/20" />

              {item.category && (
                <span className="pointer-events-none absolute bottom-0 left-0 bg-background/70 px-3 py-2 text-[10px] uppercase tracking-label text-gold opacity-0 transition-opacity group-hover:opacity-100">
                  {item.category}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Fullscreen Viewer */}
      {activeItem && (
        <div
          className="fixed inset-0 z-60 flex flex-col bg-background/97 backdrop-blur"
          role="dialog"
          aria-modal="true"
        >
          {/* Viewer Header */}
          <div className="flex items-center justify-between px-6 py-5 lg:px-10">
            <div className="flex items-center gap-4">
              <span className="text-xs uppercase tracking-label text-gold">
                {selectedCategory}
              </span>

              <span className="text-xs uppercase tracking-label text-stone-dim">
                {String((active ?? 0) + 1).padStart(2, "0")} /{" "}
                {String(filteredItems.length).padStart(2, "0")}
              </span>
            </div>

            <button
              type="button"
              onClick={close}
              aria-label="Close gallery"
              className="text-stone transition-colors hover:text-gold"
            >
              <X size={24} />
            </button>
          </div>

          {/* Viewer */}
          <div className="relative flex flex-1 items-center justify-center px-4 pb-4">
            {/* Previous */}
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-2 z-10 p-3 text-stone transition-colors hover:text-gold lg:left-6"
            >
              <ChevronLeft size={32} />
            </button>

            {/* Image */}
            <figure className="flex max-h-full max-w-5xl flex-col items-center">
              <div className="relative flex items-center justify-center">
                <Image
                  src={
                    urlFor(activeItem).width(2000).quality(90).url() ||
                    "/placeholder.svg"
                  }
                  alt={activeItem.alt ?? ""}
                  width={2000}
                  height={1400}
                  sizes="90vw"
                  className="max-h-[76vh] w-auto object-contain"
                />
              </div>

              {(activeItem.caption || activeItem.category) && (
                <figcaption className="mt-5 text-center text-sm text-stone">
                  {activeItem.category && (
                    <span className="mr-3 text-xs uppercase tracking-label text-gold">
                      {activeItem.category}
                    </span>
                  )}

                  {activeItem.caption}
                </figcaption>
              )}
            </figure>

            {/* Next */}
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 z-10 p-3 text-stone transition-colors hover:text-gold lg:right-6"
            >
              <ChevronRight size={32} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}