import type { Metadata } from "next"
import Link from "next/link"

import { PageHeader } from "@/components/page-header"
import { Reveal } from "@/components/reveal"
import { SanityImage } from "@/components/sanity-image"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { sanityFetch } from "@/sanity/lib/live"
import { allProjectsQuery } from "@/sanity/lib/queries"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Temple architecture, restoration, and craftsmanship projects by Sri Ayyanar Architects.",
}

export default async function ProjectsPage() {
  const { data: projects } = await sanityFetch({
    query: allProjectsQuery,
  })

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#080706]
        text-ivory
      "
    >
      {/* =========================================================
          AMBIENT BACKGROUND
      ========================================================= */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
          overflow-hidden
        "
      >
        {/* Large ambient glow - top left */}
        <div
          className="
            absolute
            left-[-18%]
            top-[2%]
            h-105
            w-105
            rounded-full
            bg-gold/4.5
            blur-[120px]
            sm:h-130
            sm:w-130
            sm:bg-gold/5.5
            motion-safe:animate-[float_12s_ease-in-out_infinite]
          "
        />

        {/* Large ambient glow - right */}
        <div
          className="
            absolute
            right-[-20%]
            top-[28%]
            h-120
            w-120
            rounded-full
            bg-[#8b6b35]/[0.035]
            blur-[140px]
            sm:h-162.5
            sm:w-162.5
            sm:bg-[#8b6b35]/4.5
            motion-safe:animate-[floatReverse_16s_ease-in-out_infinite]
          "
        />

        {/* Bottom glow */}
        <div
          className="
            absolute
            bottom-[2%]
            left-[15%]
            h-95
            w-137.5
            rounded-full
            bg-gold/2.5
            blur-[150px]
            sm:h-125
            sm:w-175
            sm:bg-gold/[0.035]
            motion-safe:animate-[pulseGlow_10s_ease-in-out_infinite]
          "
        />

        {/* Fine radial gradient */}
        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_18%_8%,rgba(212,175,55,0.055),transparent_32%),radial-gradient(circle_at_85%_42%,rgba(139,107,53,0.04),transparent_32%),linear-gradient(180deg,#0b0907_0%,#080706_48%,#050403_100%)]
          "
        />

        {/* Subtle vertical texture */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
            bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)]
            bg-size-[80px_80px]
          "
        />
      </div>

      {/* =========================================================
          PAGE CONTENT
      ========================================================= */}

      <div className="relative z-10">
        <PageHeader
          eyebrow="Portfolio"
          title="Projects"
          intro="A body of work in traditional temple architecture, restoration, and sacred craftsmanship."
        />

        <section
          className="
            mx-auto
            w-full
            max-w-[1600px]
            px-4
            py-14
            sm:px-6
            sm:py-20
            md:px-8
            md:py-24
            lg:px-10
            lg:py-28
            xl:px-12
            2xl:px-16
          "
        >
          {Array.isArray(projects) && projects.length > 0 ? (
            <>
              {/* =================================================
                  SECTION HEADER
              ================================================= */}

              <Reveal>
                <div
                  className="
                    mb-10
                    flex
                    items-center
                    justify-between
                    gap-4
                    border-b
                    border-gold/15
                    pb-5
                    sm:mb-14
                    sm:pb-6
                  "
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span
                      className="
                        h-px
                        w-6
                        bg-gold/50
                        sm:w-10
                      "
                    />

                    <p
                      className="
                        text-[9px]
                        font-medium
                        uppercase
                        tracking-[0.28em]
                        text-stone-dim
                        sm:text-xs
                        sm:tracking-[0.25em]
                      "
                    >
                      Selected Works
                    </p>
                  </div>

                  <p
                    className="
                      text-[9px]
                      uppercase
                      tracking-[0.2em]
                      text-gold
                      sm:text-xs
                    "
                  >
                    {projects.length.toString().padStart(2, "0")} Projects
                  </p>
                </div>
              </Reveal>

              {/* =================================================
                  PROJECT GRID
              ================================================= */}

              <div
                className="
                  grid
                  grid-cols-1
                  gap-x-8
                  gap-y-16
                  sm:gap-y-20
                  md:grid-cols-2
                  md:gap-x-8
                  md:gap-y-24
                  lg:gap-x-10
                  lg:gap-y-28
                  xl:gap-x-14
                  2xl:gap-x-16
                "
              >
                {projects.map((project, i) => (
                  <Reveal
                    key={project._id}
                    delay={(i % 2) * 140}
                    className={`
                      group/project
                      ${i % 2 === 1 ? "md:mt-16 lg:mt-20" : ""}
                    `}
                  >
                    <Link
                      href={`/projects/${project.slug}`}
                      className="
                        group
                        block
                        outline-none
                      "
                    >
                      {/* =================================================
                          IMAGE
                      ================================================= */}

                      <div
                        className="
                          relative
                          overflow-hidden
                          bg-stone/5
                          shadow-[0_20px_60px_rgba(0,0,0,0.15)]
                          transition-all
                          duration-700
                          ease-[cubic-bezier(0.22,1,0.36,1)]
                          group-hover:shadow-[0_30px_80px_rgba(0,0,0,0.35)]
                          group-focus-visible:ring-1
                          group-focus-visible:ring-gold/60
                        "
                      >
                        {project.heroImage ? (
                          <>
                            {/* Image */}
                            <SanityImage
                              image={project.heroImage}
                              alt={
                                project.heroImage.alt ??
                                project.title ??
                                "Temple architecture project"
                              }
                              width={1600}
                              height={1200}
                              sizes="
                                (max-width: 639px) 100vw,
                                (max-width: 767px) 92vw,
                                (max-width: 1023px) 50vw,
                                (max-width: 1535px) 45vw,
                                700px
                              "
                              className="
                                aspect-4/3
                                w-full
                                object-cover
                                transition-transform
                                duration-1500
                                ease-[cubic-bezier(0.22,1,0.36,1)]
                                group-hover:scale-[1.055]
                                motion-reduce:transition-none
                              "
                            />

                            {/* Dark image gradient */}
                            <div
                              className="
                                pointer-events-none
                                absolute
                                inset-0
                                bg-linear-to-t
                                from-black/65
                                via-black/5
                                to-black/10
                                opacity-70
                                transition-opacity
                                duration-700
                                group-hover:opacity-90
                              "
                            />

                            {/* Gold tint */}
                            <div
                              className="
                                pointer-events-none
                                absolute
                                inset-0
                                bg-gold/[0.035]
                                opacity-0
                                transition-opacity
                                duration-700
                                group-hover:opacity-100
                              "
                            />

                            {/* =================================================
                                SHINE EFFECT
                            ================================================= */}

                            <div
                              aria-hidden="true"
                              className="
                                pointer-events-none
                                absolute
                                left-[-120%]
                                top-0
                                h-full
                                w-[70%]
                                skew-x-[-18deg]
                                bg-linear-to-r
                                from-transparent
                                via-white/8
                                to-transparent
                                transition-transform
                                duration-1200
                                ease-[cubic-bezier(0.22,1,0.36,1)]
                                group-hover:translate-x-[300%]
                              "
                            />

                            {/* =================================================
                                PROJECT NUMBER
                            ================================================= */}

                            <div
                              className="
                                absolute
                                left-4
                                top-4
                                flex
                                h-9
                                min-w-9
                                items-center
                                justify-center
                                border
                                border-white/25
                                bg-black/25
                                px-2
                                backdrop-blur-md
                                transition-all
                                duration-500
                                group-hover:border-gold/50
                                group-hover:bg-black/40
                                sm:left-5
                                sm:top-5
                                sm:h-10
                                sm:min-w-10
                              "
                            >
                              <span
                                className="
                                  text-[9px]
                                  tracking-[0.18em]
                                  text-white/90
                                  sm:text-[10px]
                                "
                              >
                                {(i + 1).toString().padStart(2, "0")}
                              </span>
                            </div>

                            {/* =================================================
                                VIEW PROJECT
                            ================================================= */}

                            <div
                              className="
                                absolute
                                bottom-4
                                right-4
                                flex
                                translate-y-3
                                items-center
                                gap-2
                                opacity-0
                                transition-all
                                duration-500
                                group-hover:translate-y-0
                                group-hover:opacity-100
                                sm:bottom-5
                                sm:right-5
                              "
                            >
                              <span
                                className="
                                  text-[9px]
                                  uppercase
                                  tracking-[0.2em]
                                  text-white
                                  sm:text-[10px]
                                "
                              >
                                View Project
                              </span>

                              <span
                                className="
                                  flex
                                  h-8
                                  w-8
                                  items-center
                                  justify-center
                                  rounded-full
                                  border
                                  border-white/35
                                  bg-black/25
                                  text-white
                                  backdrop-blur-md
                                  transition-all
                                  duration-500
                                  group-hover:translate-x-1
                                  group-hover:border-gold/60
                                  group-hover:bg-black/40
                                "
                              >
                                →
                              </span>
                            </div>
                          </>
                        ) : (
                          <div
                            className="
                              flex
                              aspect-4/3
                              w-full
                              items-center
                              justify-center
                              bg-stone/5
                            "
                          >
                            <div className="text-center">
                              <span
                                className="
                                  block
                                  text-[10px]
                                  uppercase
                                  tracking-[0.25em]
                                  text-stone-dim
                                "
                              >
                                Image unavailable
                              </span>

                              <span
                                className="
                                  mx-auto
                                  mt-3
                                  block
                                  h-px
                                  w-8
                                  bg-gold/30
                                "
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* =================================================
                          PROJECT DETAILS
                      ================================================= */}

                      <div className="mt-5 sm:mt-6">
                        {/* Category + Year */}
                        <div className="flex items-center gap-3">
                          <p
                            className="
                              shrink-0
                              text-[9px]
                              uppercase
                              tracking-[0.22em]
                              text-gold
                              sm:text-xs
                            "
                          >
                            {[project.category, project.year]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>

                          <span
                            className="
                              hidden
                              h-px
                              flex-1
                              bg-gold/15
                              transition-all
                              duration-700
                              group-hover:bg-gold/40
                              sm:block
                            "
                          />
                        </div>

                        {/* Title */}
                        <div
                          className="
                            mt-3
                            flex
                            items-start
                            justify-between
                            gap-4
                            sm:mt-4
                          "
                        >
                          <h2
                            className="
                              max-w-[92%]
                              font-serif
                              text-[1.3rem]
                              leading-[1.12]
                              tracking-[-0.01em]
                              text-ivory
                              transition-all
                              duration-500
                              group-hover:text-gold
                              sm:text-2xl
                              md:text-[1.65rem]
                              lg:text-[1.85rem]
                              xl:text-[2rem]
                              2xl:text-[2.15rem]
                            "
                          >
                            {project.title}
                          </h2>

                          {/* Mobile arrow */}
                          <span
                            className="
                              mt-0.5
                              flex
                              h-7
                              w-7
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              border
                              border-gold/20
                              text-sm
                              text-gold
                              transition-all
                              duration-500
                              group-hover:translate-x-1
                              group-hover:border-gold/50
                              sm:hidden
                            "
                          >
                            →
                          </span>
                        </div>

                        {/* Location */}
                        {project.location && (
                          <p
                            className="
                              mt-2
                              text-xs
                              leading-relaxed
                              text-stone-dim
                              transition-colors
                              duration-500
                              group-hover:text-stone-light
                              sm:mt-3
                              sm:text-sm
                            "
                          >
                            {project.location}
                          </p>
                        )}
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>

              {/* =================================================
                  FOOTER LABEL
              ================================================= */}

              <Reveal>
                <div
                  className="
                    mt-20
                    border-t
                    border-gold/15
                    pt-6
                    sm:mt-28
                    sm:pt-7
                    md:mt-36
                  "
                >
                  <div
                    className="
                      flex
                      flex-col
                      gap-3
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >
                    <span
                      className="
                        text-[9px]
                        uppercase
                        tracking-[0.2em]
                        text-stone-dim
                        sm:text-xs
                      "
                    >
                      Sri Ayyanar Architects
                    </span>

                    <span
                      className="
                        text-[9px]
                        uppercase
                        tracking-[0.2em]
                        text-gold
                        sm:text-xs
                      "
                    >
                      Architecture · Heritage · Craft
                    </span>
                  </div>
                </div>
              </Reveal>
            </>
          ) : (
            /* =====================================================
               EMPTY STATE
            ===================================================== */

            <Reveal>
              <div
                className="
                  flex
                  min-h-80
                  items-center
                  border-y
                  border-gold/15
                  py-20
                  sm:min-h-95
                  sm:py-24
                "
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-gold/40" />

                    <p
                      className="
                        text-[10px]
                        uppercase
                        tracking-[0.25em]
                        text-gold
                      "
                    >
                      Portfolio
                    </p>
                  </div>

                  <p
                    className="
                      mt-5
                      max-w-xl
                      font-serif
                      text-2xl
                      leading-[1.1]
                      text-ivory
                      sm:text-3xl
                      md:text-4xl
                    "
                  >
                    No projects to show right now.
                  </p>

                  <p
                    className="
                      mt-4
                      max-w-md
                      text-sm
                      leading-relaxed
                      text-stone-dim
                    "
                  >
                    Our portfolio is currently being updated. Please check
                    back soon to explore our work in traditional temple
                    architecture and restoration.
                  </p>
                </div>
              </div>
            </Reveal>
          )}
        </section>
      </div>

      {/* WhatsApp */}
      <WhatsAppButton />

      {/* =========================================================
          ANIMATION KEYFRAMES
      ========================================================= */}

      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(25px, 18px, 0) scale(1.05);
          }
        }

        @keyframes floatReverse {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(-30px, 25px, 0) scale(1.06);
          }
        }

        @keyframes pulseGlow {
          0%,
          100% {
            opacity: 0.7;
            transform: scale(1);
          }

          50% {
            opacity: 1;
            transform: scale(1.08);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  )
}
