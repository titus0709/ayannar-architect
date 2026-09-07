"use client"

import Image from "next/image"
import { Reveal } from "@/components/reveal"
import { RichText } from "@/components/rich-text"
import { urlFor } from "@/sanity/lib/image"
import type { Image as SanityImageType } from "sanity"
import type { PortableTextBlock } from "sanity"

import sthapati from "@/assets/sthapathi.png"

type Props = {
  name?: string | null
  bio?: PortableTextBlock[] | null
  photo?: (SanityImageType & { alt?: string }) | null
  showCta?: boolean
}

export function Sthapati({
  name,
  bio,
  showCta = true,
  photo,
}: Props) {
  const src = photo?.asset
    ? urlFor(photo)
        .width(1100)
        .height(1400)
        .quality(90)
        .url()
    : sthapati

  return (
    <section className="relative overflow-hidden border-t border-gold/15">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-40
          top-1/2
          h-72
          w-72
          -translate-y-1/2
          rounded-full
          bg-gold/5
          blur-3xl
          sm:h-80
          sm:w-80
          lg:-right-32
        "
      />

      <div
        className="
          relative
          mx-auto
          w-full
          max-w-7xl
          px-5
          py-16
          sm:px-8
          sm:py-20
          md:px-10
          md:py-24
          lg:px-12
          lg:py-28
          xl:px-16
          xl:py-32
          2xl:py-36
        "
      >
        <div
          className="
            grid
            grid-cols-1
            items-center
            gap-14
            sm:gap-16
            md:gap-20
            lg:grid-cols-12
            lg:gap-12
            xl:gap-20
            2xl:gap-24
          "
        >
          {/* ================= IMAGE ================= */}
          <Reveal
            className="
              w-full
              lg:col-span-5
            "
          >
            <div
              className="
                group
                relative
                mx-auto
                w-full
                max-w-md
                sm:max-w-lg
                lg:max-w-none
              "
            >
              {/* Bottom-left decorative frame */}
              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  -bottom-2
                  -left-2
                  h-14
                  w-14
                  border-b
                  border-l
                  border-gold/35
                  transition-all
                  duration-700
                  group-hover:-bottom-4
                  group-hover:-left-4
                  sm:-bottom-3
                  sm:-left-3
                  sm:h-16
                  sm:w-16
                "
              />

              {/* Top-right decorative frame */}
              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  -right-2
                  -top-2
                  h-14
                  w-14
                  border-r
                  border-t
                  border-gold/35
                  transition-all
                  duration-700
                  group-hover:-right-4
                  group-hover:-top-4
                  sm:-right-3
                  sm:-top-3
                  sm:h-16
                  sm:w-16
                "
              />

              {/* Image container */}
              <div
                className="
                  relative
                  aspect-4/5
                  w-full
                  overflow-hidden
                  bg-black/20
                "
              >
                <Image
                  src={src || "/placeholder.svg"}
                  alt={photo?.alt ?? name ?? "The Sthapati"}
                  fill
                  priority={false}
                  sizes="
                    (max-width: 639px) 88vw,
                    (max-width: 767px) 75vw,
                    (max-width: 1023px) 62vw,
                    (max-width: 1279px) 40vw,
                    36vw
                  "
                  className="
                    object-cover
                    transition-transform
                    duration-1200
                    ease-out
                    group-hover:scale-[1.035]
                  "
                />

                {/* Cinematic overlay */}
                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-linear-to-t
                    from-black/30
                    via-transparent
                    to-transparent
                    opacity-60
                  "
                />
              </div>

              {/* Sthapati marker */}
              <div
                aria-hidden="true"
                className="
                  absolute
                  -bottom-6
                  right-0
                  flex
                  items-center
                  gap-2
                  text-[8px]
                  uppercase
                  tracking-[0.25em]
                  text-gold/60
                  sm:-bottom-7
                  sm:gap-3
                  sm:text-[9px]
                  sm:tracking-[0.3em]
                "
              >
                <span className="h-px w-6 bg-gold/30 sm:w-8" />
                Sthapati
              </div>
            </div>
          </Reveal>

          {/* ================= CONTENT ================= */}
          <Reveal
            delay={140}
            className="
              w-full
              lg:col-span-6
              lg:col-start-7
            "
          >
            <div
              className="
                mx-auto
                w-full
                max-w-2xl
                lg:mx-0
              "
            >
              {/* Eyebrow */}
              <div
                className="
                  mb-4
                  flex
                  items-center
                  gap-3
                  sm:mb-5
                  sm:gap-4
                  lg:mb-6
                "
              >
                <span
                  className="
                    h-px
                    w-7
                    shrink-0
                    bg-gold
                    sm:w-10
                  "
                />

                <p
                  className="
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.25em]
                    text-gold
                    sm:text-[10px]
                    sm:tracking-[0.28em]
                    md:text-xs
                  "
                >
                  The Sthapati
                </p>
              </div>

              {/* Heading */}
              <h2
                className="
                  max-w-xl
                  font-serif
                  text-[2rem]
                  leading-[1.08]
                  tracking-[-0.02em]
                  text-ivory
                  sm:text-[2.35rem]
                  md:text-4xl
                  lg:text-[2.8rem]
                  xl:text-5xl
                  2xl:text-[3.4rem]
                "
              >
                {name ?? "The Architect"}
              </h2>

              {/* Gold divider */}
              <div
                className="
                  my-6
                  flex
                  items-center
                  gap-3
                  sm:my-7
                  lg:my-8
                "
              >
                <div
                  className="
                    h-px
                    w-12
                    bg-gold/40
                    sm:w-16
                    lg:w-20
                  "
                />

                <div
                  className="
                    h-1
                    w-1
                    rotate-45
                    bg-gold/70
                  "
                />
              </div>

              {/* Biography */}
              <div
                className="
                  max-w-xl
                  text-[13px]
                  leading-6
                  text-ivory/65
                  sm:text-sm
                  sm:leading-7
                  md:text-[15px]
                  md:leading-7
                  lg:text-base
                  lg:leading-8
                "
              >
                {bio ? (
                  <RichText value={bio} />
                ) : (
                  <div className="space-y-4 sm:space-y-5">
                    <p>
                      With 20+ years of experience, Ganesan Sthapathi has
                      been rooted in traditional temple architecture from a
                      young age, learning alongside his father and working
                      directly with hereditary craftsmen from the region.
                      This deep, hands-on heritage continues to shape every
                      project.
                    </p>

                    <p>
                      The studio specialises in both new temple construction
                      and the restoration of historic temples, combining
                      traditional knowledge, craftsmanship, and careful
                      attention to proportion and detail.
                    </p>
                  </div>
                )}
              </div>

              {/* CTA */}
              {/* {showCta && (
                <div className="mt-7 sm:mt-9 lg:mt-10">
                  <a
                    href="/about"
                    className="
                      group
                      inline-flex
                      items-center
                      gap-3
                      text-[9px]
                      uppercase
                      tracking-[0.22em]
                      text-ivory
                      transition-colors
                      duration-300
                      hover:text-gold
                      sm:gap-4
                      sm:text-[10px]
                      sm:tracking-[0.25em]
                      md:text-xs
                    "
                  >
                    <span>Discover His Story</span>

                    <span
                      className="
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-gold/30
                        transition-all
                        duration-300
                        group-hover:border-gold
                        group-hover:bg-gold
                        sm:h-8
                        sm:w-8
                      "
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        className="
                          h-3
                          w-3
                          text-gold
                          transition-all
                          duration-300
                          group-hover:translate-x-0.5
                          group-hover:text-black
                          sm:h-3.5
                          sm:w-3.5
                        "
                        aria-hidden="true"
                      >
                        <path
                          d="M4 10h11M10 5l5 5-5 5"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </a>
                </div>
              )} */}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}