import { Reveal } from "@/components/reveal"

export function Intro({
  heading,
  text,
}: {
  heading?: string | null
  text?: string | null
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-36">
      <div className="grid gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-5">
          <Reveal>
            <p className="mb-6 text-xs uppercase tracking-label text-gold">
              Introduction
            </p>
            <h2 className="text-balance font-serif text-3xl leading-tight text-ivory md:text-4xl lg:text-5xl">
              {heading ?? "Architecture Rooted in Tradition"}
            </h2>
          </Reveal>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <Reveal delay={120}>
            <div className="mb-8 hairline" />
            <p className="text-pretty text-lg leading-relaxed text-stone md:text-xl">
              {text ??
                "For generations, we have devoted ourselves to preserving traditional temple architecture and the sacred craftsmanship it demands. Every proportion, every carving, and every stone is guided by inherited knowledge and an enduring reverence for the practice."}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
