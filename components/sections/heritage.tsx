import Image from "next/image"

import { Reveal } from "@/components/reveal"
import { urlFor } from "@/sanity/lib/image"
import type { Image as SanityImageType } from "sanity"

type Props = {
  quote?: string | null
  image?: (SanityImageType & { alt?: string }) | null
}

export function Heritage({ quote, image }: Props) {
  const src = image?.asset
    ? urlFor(image).width(2400).height(1400).quality(85).url()
    : "/images/heritage-carving.png"

  return (
    <section className="relative overflow-hidden border-t border-gold/15">
      <Image
        src={src || "/placeholder.svg"}
        alt={image?.alt ?? "Ancient temple stone carving detail"}
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-background/80" />
      <div className="relative mx-auto max-w-5xl px-6 py-32 text-center lg:px-10 lg:py-48">
        <Reveal>
          <p className="mb-10 text-xs uppercase tracking-label text-gold">
            Heritage
          </p>
          <blockquote className="text-balance font-serif text-3xl leading-tight text-ivory md:text-5xl lg:text-6xl">
            &ldquo;
            {quote ??
              "Architecture is inherited, practiced, and preserved."}
            &rdquo;
          </blockquote>
        </Reveal>
      </div>
    </section>
  )
}
