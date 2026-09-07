import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Reveal } from "@/components/reveal"
import { SanityImage } from "@/components/sanity-image"
import type { Image as SanityImageType } from "sanity"

type Project = {
  _id: string
  title: string | null
  slug: string | null
  location: string | null
  year: string | null
  category: string | null
  summary: string | null
  heroImage: (SanityImageType & { alt?: string }) | null
}

export function FeaturedProjects({
  projects,
}: {
  projects: Project[]
}) {
  if (!projects || projects.length === 0) return null

  return (
    <section className="relative overflow-hidden border-t border-gold/15 bg-charcoal/40">
      {/* Decorative background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-125 w-125 -translate-x-1/2 rounded-full bg-gold/2.5 blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-36">

        {/* ─────────────────────────────
            SECTION HEADER
        ───────────────────────────── */}
        <Reveal className="mb-20 lg:mb-28">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">

            <div className="max-w-2xl">
              <Reveal delay={0.05}>
                <div className="mb-6 flex items-center gap-4">
                  <span className="h-px w-10 bg-gold" />

                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold">
                    Selected Works
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.12}>
                <h2 className="text-balance font-serif text-4xl leading-[1.05] text-ivory md:text-5xl lg:text-6xl">
                  Featured
                  <span className="block italic text-gold/90">
                    Projects
                  </span>
                </h2>
              </Reveal>
            </div>

            {/* <Reveal delay={0.2}>
              <Link
                href="/projects"
                className="group relative inline-flex w-fit items-center gap-4 pb-3 text-[10px] uppercase tracking-[0.25em] text-ivory"
              >
                <span className="relative">
                  View All Projects

                  <span className="absolute -bottom-3 left-0 h-px w-full origin-left scale-x-50 bg-gold transition-transform duration-500 group-hover:scale-x-100" />
                </span>

                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-charcoal">
                  <ArrowRight
                    size={13}
                    className="transition-transform duration-500 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </Reveal> */}
          </div>
        </Reveal>

        {/* ─────────────────────────────
            PROJECTS
        ───────────────────────────── */}
        <div className="flex flex-col gap-28 lg:gap-40">
          {projects.map((project, i) => {
            const flipped = i % 2 === 1
            const number = String(i + 1).padStart(2, "0")

            return (
              <Reveal
                key={project._id}
                delay={0.05}
                className="group/project"
              >
                <article className="relative grid items-center gap-10 md:grid-cols-12 md:gap-14">

                  {/* ─────────────────────
                      PROJECT NUMBER
                  ───────────────────── */}
                  <div
                    className={`absolute -top-8 hidden text-[10px] tracking-[0.3em] text-gold/50 md:block ${
                      flipped
                        ? "right-0"
                        : "left-0"
                    }`}
                  >
                    {number}
                  </div>

                  {/* ─────────────────────
                      IMAGE
                  ───────────────────── */}
                  <Link
                    href={`/projects/${project.slug}`}
                    className={`group/image relative block overflow-hidden md:col-span-8 ${
                      flipped
                        ? "md:order-2 md:col-start-5"
                        : "md:order-1"
                    }`}
                  >
                    {project.heroImage ? (
                      <div className="relative overflow-hidden bg-charcoal">
                        <SanityImage
                          image={project.heroImage}
                          alt={
                            project.heroImage.alt ??
                            project.title ??
                            ""
                          }
                          width={1200}
                          height={820}
                          sizes="(max-width: 768px) 100vw, 66vw"
                          className="aspect-3/2 w-full object-cover transition-transform duration-1400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/image:scale-[1.06]"
                        />

                        {/* Dark cinematic overlay */}
                        <div className="pointer-events-none absolute inset-0 bg-black/20 transition-all duration-700 group-hover/image:bg-black/5" />

                        {/* Gold frame */}
                        <div className="pointer-events-none absolute inset-5 border border-gold/0 transition-all duration-700 group-hover/image:inset-7 group-hover/image:border-gold/40" />

                        {/* Image corner accent */}
                        <div className="absolute bottom-0 left-0 h-px w-0 bg-gold transition-all duration-700 group-hover/image:w-1/3" />
                      </div>
                    ) : (
                      <div className="aspect-3/2 w-full bg-charcoal" />
                    )}
                  </Link>

                  {/* ─────────────────────
                      CONTENT
                  ───────────────────── */}
                  <div
                    className={`relative md:col-span-4 ${
                      flipped
                        ? "md:order-1 md:col-start-1"
                        : "md:order-2"
                    }`}
                  >
                    {/* Category + year */}
                    <div className="flex items-center gap-3">
                      <span className="h-px w-6 bg-gold/60" />

                      <p className="text-[10px] uppercase tracking-[0.25em] text-gold">
                        {[project.category, project.year]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>

                    {/* Title */}
                    <h3 className="mt-6 font-serif text-3xl leading-[1.1] text-ivory md:text-4xl">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="relative inline-block transition-colors duration-500 hover:text-gold"
                      >
                        {project.title}

                        <span className="absolute -bottom-2 left-0 h-px w-0 bg-gold transition-all duration-700 group-hover/project:w-full" />
                      </Link>
                    </h3>

                    {/* Location */}
                    {project.location && (
                      <p className="mt-4 text-xs uppercase tracking-[0.15em] text-stone-dim">
                        {project.location}
                      </p>
                    )}

                    {/* Summary */}
                    {project.summary && (
                      <p className="mt-7 max-w-md text-sm leading-[1.9] text-stone">
                        {project.summary}
                      </p>
                    )}

                    {/* View project */}
                    <Link
                      href={`/projects/${project.slug}`}
                      className="group/link mt-9 inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.25em] text-ivory"
                    >
                      <span className="relative">
                        View Project

                        <span className="absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover/link:scale-x-100" />
                      </span>

                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 transition-all duration-500 group-hover/link:border-gold group-hover/link:bg-gold group-hover/link:text-charcoal">
                        <ArrowRight
                          size={13}
                          className="transition-transform duration-500 group-hover/link:translate-x-0.5"
                        />
                      </span>
                    </Link>

                    {/* Decorative vertical line */}
                    <div className="absolute -right-8 top-0 hidden h-full w-px bg-linear-to-b from-gold/30 via-gold/5 to-transparent lg:block" />
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>

        {/* ─────────────────────────────
            BOTTOM DECORATION
        ───────────────────────────── */}
        <Reveal className="mt-28 lg:mt-40">
          <div className="flex items-center justify-center gap-5">
            <span className="h-px w-16 bg-gold/20" />

            <span className="h-1.5 w-1.5 rotate-45 border border-gold/50" />

            <span className="h-px w-16 bg-gold/20" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
