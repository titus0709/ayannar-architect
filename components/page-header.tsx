import { Reveal } from "@/components/reveal"

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string
  title: string
  intro?: string
}) {
  return (
    <header className="border-b border-gold/15 pt-36 lg:pt-44">
      <div className="mx-auto max-w-7xl px-6 pb-20 lg:px-10 lg:pb-28">
        <Reveal>
          <p className="mb-6 text-xs uppercase tracking-label text-gold">
            {eyebrow}
          </p>
          <h1 className="max-w-4xl text-balance font-serif text-4xl leading-[1.05] text-ivory md:text-6xl lg:text-7xl">
            {title}
          </h1>
          {intro && (
            <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-stone">
              {intro}
            </p>
          )}
        </Reveal>
      </div>
    </header>
  )
}
