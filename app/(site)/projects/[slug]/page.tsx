import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import {WhatsAppButton} from "@/components/whatsapp-button";
import {ContactCta} from "@/components/sections/contact-cta";

import { Reveal } from "@/components/reveal"
import { RichText } from "@/components/rich-text"
import { ProjectGallery } from "@/components/project-gallery"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import { sanityFetch } from "@/sanity/lib/live"
import { projectBySlugQuery, projectSlugsQuery } from "@/sanity/lib/queries"

type ProjectData = {
  title?: string
  summary?: string
  location?: string
  year?: string | number
  category?: string
  heroImage?: {
    asset?: unknown
    alt?: string
  }
  gallery?: unknown[]
  closingImage?: {
    asset?: unknown
    alt?: string
  }
}

export async function generateStaticParams() {
  const slugs = await client.fetch(projectSlugsQuery)
  return (slugs ?? [])
    .filter((s: { slug?: string | null }) => Boolean(s.slug))
    .map((s: { slug: string }) => ({ slug: s.slug as string }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { data: project } = await sanityFetch({
    query: projectBySlugQuery,
    params: { slug },
    stega: false,
  })
  if (!project) return { title: "Project not found" }
  const metadataProject = project as { title?: string; summary?: string }
  return {
    title: metadataProject.title ?? "Project",
    description:
      metadataProject.summary ??
      `${metadataProject.title} — traditional temple architecture by Sri Ayyanar Architects.`,
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data: project } = (await sanityFetch({
    query: projectBySlugQuery,
    params: { slug },
  })) as { data: ProjectData | null }

  if (!project) notFound()

  const heroSrc = project.heroImage?.asset
    ? urlFor(project.heroImage as Parameters<typeof urlFor>[0])
        .width(2400)
        .height(1400)
        .quality(85)
        .url()
    : "/images/hero-gopuram.png"

  const details: Array<{ label: string; value: string | number }> = [
    { label: "Location", value: project.location },
    { label: "Year", value: project.year },
    { label: "Category", value: project.category },
  ].filter(
    (d): d is { label: string; value: string | number } => Boolean(d.value),
  )

  return (
    <article>
      {/* Hero */}
      <section className="relative h-[62vh] min-h-110 w-full overflow-hidden sm:h-[70vh] sm:min-h-125 lg:h-[80vh] lg:min-h-130">
        <Image
          src={heroSrc || "/placeholder.svg"}
          alt={project.heroImage?.alt ?? project.title ?? ""}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-background/30" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-5 pb-10 sm:px-6 sm:pb-14 md:px-8 lg:px-10 lg:pb-20">
            <p className="mb-3 inline-block text-[11px] font-medium uppercase tracking-label text-gold sm:mb-4 sm:text-xs md:mb-5 md:text-sm">
              {[project.category, project.year].filter(Boolean).join(" · ")}
            </p>
            <h1 className="max-w-4xl text-balance font-serif text-3xl leading-[1.1] text-ivory sm:text-4xl sm:leading-[1.08] md:text-5xl lg:text-6xl lg:leading-[1.05] xl:text-7xl">
              {project.title}
            </h1>
            {project.location && (
              <p className="mt-3 text-sm text-stone sm:mt-4 sm:text-base md:mt-5 md:text-lg">
                {project.location}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Intro + details */}
      <section className="border-b border-gold/15">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:gap-12 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:grid-cols-12 lg:gap-16 lg:px-10 lg:py-28">
          <div className="lg:col-span-8">
            {project.summary && (
              <Reveal>
                <p className="text-balance font-serif text-xl leading-snug text-ivory sm:text-2xl md:text-3xl">
                  {project.summary}
                </p>
              </Reveal>
            )}
          </div>
          {details.length > 0 && (
            <Reveal delay={120} className="lg:col-span-3 lg:col-start-10">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-gold/20 pt-8 sm:grid-cols-3 lg:block lg:grid-cols-1 lg:space-y-6 lg:pt-8">
                {details.map((d) => (
                  <div key={d.label}>
                    <dt className="text-[10px] uppercase tracking-label text-stone-dim">
                      {d.label}
                    </dt>
                    <dd className="mt-2 wrap-break-word text-ivory">{String(d.value)}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}
        </div>
      </section>

      {/* Story / Approach / Craftsmanship */}
     

      {/* Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="border-t border-gold/15 bg-charcoal/40">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-10 lg:py-28">
            <Reveal className="mb-8 sm:mb-10 lg:mb-12">
              <p className="mb-3 text-xs uppercase tracking-label text-gold sm:mb-4">
                Photography
              </p>
              <h2 className="font-serif text-2xl text-ivory sm:text-3xl md:text-4xl">
                Gallery
              </h2>
            </Reveal>
            <ProjectGallery items={project.gallery as never} />
          </div>
        </section>
      )}

      {/* Closing image */}
{project.closingImage?.asset ? (
  <section className="relative h-[45vh] min-h-80 w-full overflow-hidden border-t border-gold/15 sm:h-[55vh] sm:min-h-95 lg:h-[70vh] lg:min-h-105">
    <Image
      src={
        urlFor(project.closingImage as Parameters<typeof urlFor>[0])
          .width(2400)
          .height(1400)
          .quality(85)
          .url() ||
        "/placeholder.svg"
      }
      alt={project.closingImage.alt ?? `${project.title} closing image`}
      fill
      sizes="100vw"
      className="object-cover"
    />
  </section>
) : null}

      {/* Back link */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-14 md:px-8 lg:px-10 lg:py-20">
        <Link
          href="/projects"
          className="group inline-flex items-center gap-3 text-xs uppercase tracking-label text-stone transition-colors hover:text-gold"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          All Projects
        </Link>
      </section>
      <ContactCta/>
      <WhatsAppButton/>
    </article>
  )
}

function TextBlock({ label, body }: { label: string; body: never }) {
  return (
    <div className="grid gap-6 md:grid-cols-12 md:gap-12">
      <div className="md:col-span-3">
        <p className="text-xs uppercase tracking-label text-gold">{label}</p>
        <div className="mt-4 hidden h-px w-12 bg-gold/40 md:block" />
      </div>
      <div className="md:col-span-8 md:col-start-4">
        <RichText value={body} />
      </div>
      
    </div>
  )
}