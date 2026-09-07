import { Reveal } from "@/components/reveal"

type Principle = {
  title?: string | null
  text?: string | null
}

const fallback: Principle[] = [
  {
    title: "Tradition",
    text: "Preserving inherited architectural knowledge and the wisdom carried through generations.",
  },
  {
    title: "Proportion",
    text: "Following traditional temple geometry, proportion, and principles to create spaces of harmony.",
  },
  {
    title: "Craft",
    text: "Working alongside skilled traditional artisans whose knowledge transforms material into meaning.",
  },
  {
    title: "Legacy",
    text: "Creating architecture with the strength and character to endure across generations.",
  },
]

export function Philosophy({
  principles,
  showHeading = true,
}: {
  principles?: Principle[] | null
  showHeading?: boolean
}) {
  const items =
    principles && principles.length > 0 ? principles : fallback

  return (
    <section className="group/section relative overflow-hidden border-t border-gold/15 bg-[#0d0b09]">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Main atmospheric glow */}
        <div
          className="
            absolute left-1/2 top-0
            h-105 w-150
            -translate-x-1/2
            rounded-full
            bg-gold/[0.035]
            blur-[120px]
            transition-all duration-2000
            group-hover/section:scale-125
            group-hover/section:bg-gold/5
            sm:h-137.5 sm:w-200
          "
        />

        {/* Secondary glow */}
        <div
          className="
            absolute -bottom-40 -left-40
            h-87.5 w-87.5
            rounded-full
            bg-gold/1.5
            blur-[100px]
            transition-transform duration-2500
            group-hover/section:translate-x-20
          "
        />

        {/* Architectural vertical lines */}
        <div className="absolute left-[5%] top-0 h-full w-px bg-gold/[0.035] sm:left-[8%]" />
        <div className="absolute right-[5%] top-0 h-full w-px bg-gold/[0.035] sm:right-[8%]" />

        {/* Center architectural line */}
        <div
          className="
            absolute left-1/2 top-0 hidden h-full w-px
            -translate-x-1/2
            bg-gold/[0.018]
            lg:block
          "
        />

        {/* Floating ornaments */}
        <div
          className="
            absolute right-[6%] top-24
            hidden h-3 w-3 rotate-45
            border border-gold/20
            animate-[spin_12s_linear_infinite]
            lg:block
          "
        />

        <div
          className="
            absolute left-[4%] top-1/3
            hidden h-2 w-2 rotate-45
            border border-gold/10
            animate-pulse
            lg:block
          "
        />

        {/* Fine horizontal architectural marks */}
        <div className="absolute left-0 top-1/4 h-px w-[8%] bg-gold/5" />
        <div className="absolute right-0 top-1/4 h-px w-[8%] bg-gold/5" />
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div
        className="
          relative mx-auto w-full max-w-7xl
          px-5 py-20
          sm:px-6 sm:py-24
          md:px-8 md:py-28
          lg:px-10 lg:py-36
        "
      >
        {/* =================================================
            HEADING
        ================================================= */}

        {showHeading && (
          <Reveal className="mb-16 sm:mb-20 lg:mb-28">
            <div
              className="
                grid gap-10
                lg:grid-cols-[0.75fr_1.25fr]
                lg:items-end
                lg:gap-16
              "
            >
              {/* Eyebrow */}
              <div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <span
                    className="
                      h-px w-8 bg-gold
                      transition-all duration-700
                      group-hover/section:w-16
                      sm:w-10
                    "
                  />

                  <p
                    className="
                      text-[9px] font-medium uppercase
                      tracking-[0.28em] text-gold
                      sm:text-xs sm:tracking-[0.3em]
                    "
                  >
                    Guiding Principles
                  </p>
                </div>

                {/* Ornament */}
                <div className="mt-7 hidden items-center gap-3 sm:flex lg:mt-8">
                  <span className="h-px w-12 bg-gold/25 sm:w-16" />

                  <span
                    className="
                      h-1.5 w-1.5 rotate-45
                      border border-gold/60
                      transition-transform duration-700
                      group-hover/section:rotate-135
                    "
                  />

                  <span className="h-px w-6 bg-gold/15 sm:w-8" />
                </div>
              </div>

              {/* Main heading */}
              <div>
                <h2
                  className="
                    text-balance font-serif
                    text-[2.6rem] leading-[0.95]
                    tracking-[-0.03em] text-ivory
                    transition-transform duration-700
                    sm:text-5xl
                    md:text-6xl
                    lg:text-[4.5rem]
                    xl:text-[5rem]
                    group-hover/section:translate-x-1
                  "
                >
                  Philosophy
                </h2>

                <p
                  className="
                    mt-5 max-w-xl
                    text-pretty text-[13px]
                    leading-6 text-stone/75
                    sm:mt-6 sm:text-sm sm:leading-7
                    md:text-base md:leading-8
                  "
                >
                  Every structure begins with respect for tradition,
                  precision in proportion, and a commitment to craftsmanship
                  that transcends time.
                </p>
              </div>
            </div>
          </Reveal>
        )}

        {/* =================================================
            PRINCIPLES
        ================================================= */}

        <div className="border-t border-gold/15">
          <div className="grid md:grid-cols-2">
            {items.map((p, i) => (
              <Reveal
                key={i}
                delay={i * 120}
                className={`
                  group
                  relative
                  border-b border-gold/15
                  ${i % 2 === 0 ? "md:border-r" : ""}
                  ${i >= items.length - 2 ? "md:border-b-0" : ""}
                `}
              >
                <article
                  className="
                    relative flex min-h-75
                    gap-5 overflow-hidden
                    px-1 py-10
                    transition-all duration-700
                    sm:min-h-80
                    sm:gap-7 sm:px-4 sm:py-12
                    md:min-h-87.5
                    md:px-8 md:py-14
                    lg:min-h-92.5
                    lg:px-10
                  "
                >
                  {/* Hover wash */}
                  <div
                    className="
                      pointer-events-none absolute inset-0
                      bg-linear-to-br
                      from-gold/4.5
                      via-transparent
                      to-gold/1.5
                      opacity-0
                      transition-opacity duration-700
                      group-hover:opacity-100
                    "
                  />

                  {/* Animated corner */}
                  <div
                    className="
                      pointer-events-none absolute
                      right-0 top-0
                      h-px w-0
                      bg-gold
                      transition-all duration-700
                      group-hover:w-24
                    "
                  />

                  <div
                    className="
                      pointer-events-none absolute
                      right-0 top-0
                      h-0 w-px
                      bg-gold
                      transition-all duration-700
                      group-hover:h-24
                    "
                  />

                  {/* Large background number */}
                  <span
                    className="
                      pointer-events-none absolute
                      -bottom-7 right-2
                      font-serif text-[7rem]
                      leading-none
                      text-gold/2.5
                      transition-all duration-1000
                      group-hover:-translate-x-3
                      group-hover:text-gold/[0.07]
                      sm:text-[9rem]
                      md:right-4 md:text-[10rem]
                    "
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Number */}
                  <div className="relative z-10 shrink-0">
                    <span
                      className="
                        block font-serif
                        text-3xl leading-none
                        text-gold/50
                        transition-all duration-500
                        group-hover:-translate-y-1
                        group-hover:text-gold
                        sm:text-4xl
                        md:text-5xl
                      "
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <span
                      className="
                        mt-4 block h-px w-5
                        bg-gold/40
                        transition-all duration-700
                        group-hover:w-12
                        group-hover:bg-gold
                        sm:mt-5
                      "
                    />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 max-w-md">
                    <h3
                      className="
                        font-serif
                        text-[1.6rem]
                        leading-tight
                        text-ivory
                        transition-all duration-500
                        group-hover:translate-x-1
                        group-hover:text-gold
                        sm:text-2xl
                        md:text-3xl
                      "
                    >
                      {p.title}
                    </h3>

                    <p
                      className="
                        mt-4 text-pretty
                        text-[13px]
                        leading-6 text-stone/70
                        transition-colors duration-500
                        group-hover:text-stone
                        sm:mt-5 sm:text-sm sm:leading-7
                        md:text-base md:leading-8
                      "
                    >
                      {p.text}
                    </p>

                    {/* Bottom indicator */}
                    <div
                      className="
                        mt-7 flex items-center gap-3
                        opacity-40
                        transition-all duration-500
                        group-hover:translate-x-1
                        group-hover:opacity-100
                        sm:mt-8
                      "
                    >
                      <span className="h-px w-6 bg-gold transition-all duration-500 group-hover:w-10" />

                      <span
                        className="
                          text-[8px] uppercase
                          tracking-[0.25em] text-gold
                        "
                      >
                        Principle
                      </span>
                    </div>
                  </div>

                  {/* Subtle bottom glow */}
                  <div
                    className="
                      pointer-events-none absolute
                      bottom-0 left-0
                      h-px w-0
                      bg-gold/60
                      transition-all duration-1000
                      group-hover:w-full
                    "
                  />
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        {/* =================================================
            CLOSING STATEMENT
        ================================================= */}

        <Reveal
          delay={items.length * 120 + 150}
          className="mt-16 border-t border-gold/10 pt-8 sm:mt-20 sm:pt-10 lg:mt-24"
        >
          <div
            className="
              flex flex-col gap-7
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            {/* Label */}
            <div className="flex items-center gap-4">
              <span
                className="
                  h-2 w-2 rotate-45
                  border border-gold
                  transition-transform duration-700
                  hover:rotate-135
                "
              />

              <p
                className="
                  text-[8px] uppercase
                  tracking-[0.25em] text-stone/50
                  sm:text-[10px] sm:tracking-[0.28em]
                "
              >
                Rooted in tradition
              </p>
            </div>

            {/* Quote */}
            <p
              className="
                max-w-md
                text-sm italic
                leading-7 text-stone/60
                sm:text-right
                md:text-base
              "
            >
              "Architecture is not only what we build, but what we carry
              forward."
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

