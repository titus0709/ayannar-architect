import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Reveal } from "@/components/reveal"

export function ContactCta() {
  return (
    <section className="relative overflow-hidden border-t border-gold/15">
      {/* Decorative background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-gold/5 blur-3xl sm:h-80 sm:w-80 lg:-right-20 lg:h-96 lg:w-96"
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-10 lg:py-32 xl:py-36">
        <Reveal>
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between md:gap-12 lg:gap-16">
            {/* Content */}
            <div className="max-w-2xl">
              {/* Eyebrow */}
              <div className="mb-5 flex items-center gap-3 sm:mb-6">
                <span
                  aria-hidden="true"
                  className="h-px w-8 origin-left bg-gold transition-all duration-700 ease-out sm:w-10"
                />

                <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold sm:text-xs sm:tracking-label">
                  Enquiries
                </p>
              </div>

              {/* Heading */}
              <h2 className="max-w-2xl font-serif text-3xl leading-[1.08] tracking-tight text-ivory sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                Let&apos;s Talk Projects
              </h2>

              {/* Description */}
              <p className="mt-5 max-w-xl text-sm leading-7 text-stone sm:mt-6 sm:text-base sm:leading-relaxed lg:text-lg">
                For temple commissions, restoration projects, and traditional
                architectural consultations.
              </p>
            </div>

            {/* CTA */}
            <div className="w-full md:w-auto">
              <Link
                href="/contact"
                className="group relative inline-flex min-h-14 w-full items-center justify-center gap-3 overflow-hidden border border-gold px-7 py-4 text-[10px] font-medium uppercase tracking-[0.22em] text-ivory transition-all duration-500 ease-out hover:bg-gold hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] sm:min-h-16 sm:px-8 sm:text-xs md:w-auto"
              >
                {/* Hover fill */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-left scale-x-0 bg-gold transition-transform duration-500 ease-out group-hover:scale-x-100"
                />

                {/* Button content */}
                <span className="relative z-10">Contact Us</span>

                <ArrowRight
                  size={16}
                  strokeWidth={1.5}
                  className="relative z-10 shrink-0 transition-transform duration-500 ease-out group-hover:translate-x-1.5 sm:size-4.25"
                />
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Bottom decorative line */}
        <Reveal delay={0.2}>
          <div className="mt-12 h-px w-full origin-left bg-linear-to-r from-gold/30 via-gold/10 to-transparent sm:mt-16 lg:mt-20" />
        </Reveal>
      </div>
    </section>
  )
}
