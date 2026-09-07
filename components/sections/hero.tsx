import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { urlFor } from "@/sanity/lib/image"
import type { Image as SanityImageType } from "sanity"

import heroBG from "@/assets/heroBG (2).png"
import heroBGPotrait from "@/assets/hero-bgPotrait4.png"
import templeHero from "@/assets/frontTemple.png"

type Props = {
  eyebrow?: string | null
  headline?: string | null
  subtext?: string | null
  image?: (SanityImageType & { alt?: string }) | null
}

export function Hero({
  eyebrow,
  headline,
  subtext,
  image,
}: Props) {
  const src = image?.asset
    ? urlFor(image)
        .width(2400)
        .height(1500)
        .quality(90)
        .url()
    : heroBG

  return (
    <section
      className="
        group
        relative
        min-h-svh
        w-full
        overflow-hidden
        bg-[#0b0907]
      "
    >
      {/* Floating animation */}
      {/* <style>{`
        @keyframes heroTempleFloat {
          0%, 100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-12px);
          }
        }

        .hero-temple-float {
          animation: heroTempleFloat 7.5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-temple-float {
            animation: none !important;
          }
        }
      `}</style> */}

      {/* =====================================================
          BACKGROUND IMAGE
      ===================================================== */}

      <picture className="absolute inset-0">
        {/* <source
          media="(max-width: 767px)"
          srcSet={heroBGPotrait.src}
        /> */}

        <Image
          src={src || "/placeholder.svg"}
          alt={
            image?.alt ??
            "South Indian temple gopuram at dawn"
          }
          fill
          priority
          sizes="100vw"
          className="
            object-cover
            object-center
            transition-transform
            duration-2000
            ease-out
            group-hover:scale-[1.025]
          "
        />
      </picture>

      {/* =====================================================
          CINEMATIC OVERLAYS
      ===================================================== */}

      {/* Overall darkness */}
      <div className="absolute inset-0 z-1 bg-black/25" />

      {/* Bottom gradient */}
      <div
        className="
          absolute
          inset-0
          z-1
          bg-linear-to-t
          from-[#090806]
          via-[#090806]/75
          via-45%
          to-transparent
        "
      />

      {/* Left gradient */}
      <div
        className="
          absolute
          inset-0
          z-1
          bg-linear-to-r
          from-[#090806]/70
          via-[#090806]/20
          to-transparent
        "
      />

      {/* Top vignette */}
      <div
        className="
          absolute
          inset-0
          z-1
          bg-linear-to-b
          from-black/35
          via-transparent
          to-transparent
        "
      />

      {/* Edge vignette */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-2
          shadow-[inset_0_0_180px_rgba(0,0,0,0.55)]
        "
      />

      {/* Warm atmospheric glow */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-3
          bg-[radial-gradient(ellipse_65%_70%_at_78%_42%,rgba(176,138,60,0.16)_0%,rgba(176,138,60,0)_65%)]
        "
      />

      {/* =====================================================
          3D TEMPLE
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          z-10

          /* MOBILE */
          bottom-[10%]
          right-[-18%]
          w-[125%]
          opacity-90

          /* SMALL MOBILE */
          max-[380px]:bottom-[12%]
          max-[380px]:right-[-24%]
          max-[380px]:w-[135%]

          /* TABLET */
          sm:bottom-[7%]
          sm:right-[-12%]
          sm:w-[105%]
          sm:opacity-100

          /* LARGE TABLET */
          md:top-[8%]
          md:right-[-10%]
          md:bottom-auto
          md:w-[78%]

          /* LAPTOP */
          lg:top-[5%]
          lg:right-[-7%]
          lg:w-[70%]

          /* DESKTOP */
          xl:top-[3%]
          xl:right-[-5%]
          xl:w-[68%]

          /* LARGE DESKTOP */
          2xl:right-[-2%]
          2xl:w-[65%]
        "
      >
        {/* Gold glow */}
        <div
          className="
            pointer-events-none
            absolute
            inset-[-20%]
            -z-10
            rounded-full
            bg-[radial-gradient(circle_at_center,rgba(176,138,60,0.4)_0%,rgba(176,138,60,0.1)_45%,rgba(176,138,60,0)_72%)]
            blur-3xl
          "
        />

        {/* Perspective */}
        <div
          style={{
            transform:
              "perspective(1600px) rotateY(-9deg) rotateX(3deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Floating / hover */}
          <div
            className="
              hero-temple-float
              transition-transform
              duration-700
              ease-out
              group-hover:scale-[1.035]
              group-hover:-translate-y-1
            "
          >
            <Image
              src={templeHero}
              alt="South Indian temple gopuram, dimensional architectural rendering"
              priority
              sizes="
                (max-width: 380px) 135vw,
                (max-width: 639px) 125vw,
                (max-width: 767px) 105vw,
                (max-width: 1023px) 78vw,
                (max-width: 1279px) 70vw,
                (max-width: 1535px) 68vw,
                65vw
              "
              className="
                h-auto
                w-full
                object-contain
                drop-shadow-[0_35px_60px_rgba(0,0,0,0.6)]
              "
              style={{
                WebkitMaskImage:
                  "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.5) 10%, black 24%, black 100%)",
                maskImage:
                  "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.5) 10%, black 24%, black 100%)",
              }}
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM IMAGE FADE
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          z-11
          h-[42%]
          bg-linear-to-t
          from-[#0b0907]
          via-[#0b0907]/60
          to-transparent
        "
      />

      {/* =====================================================
          DECORATIVE FRAME
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-3
          z-5
          border
          border-white/8

          sm:inset-5
          md:inset-7
          lg:inset-8
          xl:inset-10
        "
      >
        {/* Top left */}
        <span
          className="
            absolute
            -left-px
            -top-px
            h-8
            w-8
            border-l
            border-t
            border-gold/40

            sm:h-10
            sm:w-10

            lg:h-12
            lg:w-12
          "
        />

        {/* Top right */}
        <span
          className="
            absolute
            -right-px
            -top-px
            h-8
            w-8
            border-r
            border-t
            border-gold/40

            sm:h-10
            sm:w-10

            lg:h-12
            lg:w-12
          "
        />

        {/* Bottom left */}
        <span
          className="
            absolute
            -bottom-px
            -left-px
            h-8
            w-8
            border-b
            border-l
            border-gold/40

            sm:h-10
            sm:w-10

            lg:h-12
            lg:w-12
          "
        />

        {/* Bottom right */}
        <span
          className="
            absolute
            -bottom-px
            -right-px
            h-8
            w-8
            border-b
            border-r
            border-gold/40

            sm:h-10
            sm:w-10

            lg:h-12
            lg:w-12
          "
        />
      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div
        className="
          relative
          z-20
          mx-auto
          flex
          min-h-svh
          w-full
          max-w-7xl
          items-end

          px-5
          pb-28

          sm:px-7
          sm:pb-28

          md:px-9
          md:pb-32

          lg:px-10
          lg:pb-32

          xl:pb-36
        "
      >
        <div
          className="
            w-full
            max-w-5xl

            /* Keep content readable over temple */
            md:max-w-4xl
            lg:max-w-5xl
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

              md:mb-6
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
                text-white/80

                sm:text-[10px]
                sm:tracking-[0.3em]

                md:text-xs
              "
            >
              {eyebrow ?? "Ganesan Pandiyarajan"}
            </p>

            <span
              className="
                h-px
                w-4
                shrink-0
                bg-gold/40

                sm:w-6
              "
            />
          </div>

          {/* Headline */}
          <h1
            className="
              max-w-[95%]
              text-balance
              font-serif
              font-medium
              leading-[0.95]
              tracking-tight
              text-ivory
              drop-shadow-[0_4px_30px_rgba(0,0,0,0.45)]

              /* Small mobile */
              text-[2.45rem]

              /* Mobile */
              min-[400px]:text-[2.8rem]

              /* Small tablet */
              sm:text-[3.5rem]

              /* Tablet */
              md:max-w-4xl
              md:text-6xl

              /* Laptop */
              lg:text-[5.2rem]

              /* Desktop */
              xl:text-[6rem]

              /* Large desktop */
              2xl:text-[6.5rem]
            "
          >
            {headline ?? "From Vision to Sacred Place."}
          </h1>

          {/* CTA */}
          <div
            className="
              mt-7
              flex
              flex-wrap
              items-center
              gap-4

              sm:mt-9
              sm:gap-5

              md:mt-10
            "
          >
            <Link
              href="/projects"
              className="
                group/cta
                inline-flex
                min-h-11
                items-center
                justify-center
                gap-3
                border
                border-gold/70
                bg-black/20
                px-5
                py-3
                text-[9px]
                font-medium
                uppercase
                tracking-[0.2em]
                text-ivory
                backdrop-blur-sm
                transition-all
                duration-300

                hover:border-gold
                hover:bg-gold
                hover:text-black

                sm:min-h-12
                sm:gap-4
                sm:px-6
                sm:py-3.5
                sm:text-[10px]
                sm:tracking-[0.25em]
              "
            >
              <span>Explore Projects</span>

              <ArrowRight
                size={15}
                strokeWidth={1.5}
                className="
                  transition-transform
                  duration-300
                  group-hover/cta:translate-x-1
                "
              />
            </Link>
          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM INFORMATION BAR
      ===================================================== */}

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          z-20
          border-t
          border-white/8
          bg-black/20
          backdrop-blur-[2px]
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            items-center
            justify-between
            gap-4

            px-5
            py-3

            sm:px-7
            sm:py-4

            md:px-9

            lg:px-10
          "
        >
          {/* Left */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <span
              className="
                h-1.5
                w-1.5
                shrink-0
                rounded-full
                bg-gold
              "
            />

            <span
              className="
                truncate
                text-[8px]
                uppercase
                tracking-[0.18em]
                text-stone/70

                sm:text-[9px]
                sm:tracking-[0.25em]

                md:text-[10px]
              "
            >
              Sacred Architecture
            </span>
          </div>

          {/* Right */}
          <span
            className="
              hidden
              shrink-0
              text-[9px]
              uppercase
              tracking-[0.2em]
              text-stone/50

              sm:block
              sm:tracking-[0.25em]
            "
          >
            Tradition · Craft · Devotion
          </span>
        </div>
      </div>
    </section>
  )
}