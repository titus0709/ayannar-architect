import { Reveal } from "@/components/reveal"
import { EnquiryForm } from "@/components/enquiry-form"
import contactBg from "@/assets/Ancient-temple.jpg"

type ContactSectionProps = {
  settings?: {
    contactPhone?: string | null
    contactEmail?: string | null
    contactLocation?: string | null
    socialLinks?: {
      platform?: string | null
      url?: string | null
    }[] | null
  } | null
}

export function ContactSection({ settings }: ContactSectionProps) {
  const phone = settings?.contactPhone
  const email = settings?.contactEmail
  const location = settings?.contactLocation

  return (
    <section
      id="ContactSection"
      className="border-t border-gold/10 bg-black"
    >
      <div
        className="
          mx-auto w-full max-w-7xl
          px-4 py-12
          sm:px-6 sm:py-16
          md:px-8 md:py-20
          lg:px-10 lg:py-24
          xl:px-12
        "
      >
        <div
          className="
            grid w-full
            grid-cols-1
            gap-6
            md:gap-8
            lg:grid-cols-12
            lg:gap-10
            xl:gap-12
          "
        >
          {/* Left Content */}
          <Reveal className="w-full lg:col-span-5">
            <div
              className="
                group relative flex w-full
                min-h-130
                flex-col justify-between
                overflow-hidden
                border border-gold/15
                sm:min-h-140
                md:min-h-150
                lg:min-h-160
                xl:min-h-170
              "
            >
              {/* Background Image */}
              <div
                className="
                  absolute inset-0
                  bg-cover bg-center
                  transition-transform
                  duration-1000 ease-out
                  group-hover:scale-105
                "
                style={{
                  backgroundImage: `url(${contactBg.src})`,
                }}
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/65" />

              {/* Gradient */}
              <div
                className="
                  absolute inset-0
                  bg-linear-to-b
                  from-black/40
                  via-black/55
                  to-black/90
                "
              />

              {/* Gold Accent */}
              <div
                className="
                  absolute left-0 top-0
                  h-full w-px
                  bg-linear-to-b
                  from-transparent
                  via-gold/70
                  to-transparent
                "
              />

              {/* Content */}
              <div
                className="
                  relative z-10
                  flex h-full flex-col justify-between
                  p-5
                  sm:p-7
                  md:p-8
                  lg:p-9
                  xl:p-10
                "
              >
                {/* Top Content */}
                <div>
                  <p
                    className="
                      mb-4
                      text-[10px]
                      uppercase tracking-[0.2em]
                      text-gold
                      sm:mb-5 sm:text-xs
                    "
                  >
                    Start a Conversation
                  </p>

                  <h2
                    className="
                      max-w-xl
                      font-serif
                      text-2xl
                      leading-[1.12]
                      text-ivory
                      sm:text-3xl
                      md:text-4xl
                      lg:text-[2.6rem]
                      xl:text-5xl
                    "
                  >
                    Let&apos;s build something meaningful together.
                  </h2>

                  <div className="mt-5 h-px w-12 bg-gold/50 sm:mt-6 sm:w-16" />

                  <p
                    className="
                      mt-5 max-w-lg
                      text-xs
                      leading-6
                      text-stone-200/80
                      sm:mt-6 sm:text-sm sm:leading-7
                    "
                  >
                    Planning a new temple, restoring a historic structure, or
                    looking for traditional architectural guidance? Let&apos;s
                    discuss your vision.
                  </p>
                </div>

                {/* Contact Details */}
                <div
                  className="
                    mt-10
                    space-y-5
                    border-t border-white/15
                    pt-6
                    sm:mt-12
                    sm:space-y-6
                    sm:pt-7
                  "
                >
                  {phone && (
                    <div className="min-w-0">
                      <p
                        className="
                          text-[9px]
                          uppercase tracking-[0.2em]
                          text-gold/80
                          sm:text-[10px]
                        "
                      >
                        Phone
                      </p>

                      <a
                        href={`tel:${phone.replace(/\s+/g, "")}`}
                        className="
                          mt-1.5
                          inline-block
                          max-w-full
                          wrap-break-word
                          text-xs
                          text-ivory
                          transition-colors
                          duration-300
                          hover:text-gold
                          sm:text-sm
                        "
                      >
                        {phone}
                      </a>
                    </div>
                  )}

                  {email && (
                    <div className="min-w-0">
                      <p
                        className="
                          text-[9px]
                          uppercase tracking-[0.2em]
                          text-gold/80
                          sm:text-[10px]
                        "
                      >
                        Email
                      </p>

                      <a
                        href={`mailto:${email}`}
                        className="
                          mt-1.5
                          inline-block
                          max-w-full
                          break-all
                          text-xs
                          text-ivory
                          transition-colors
                          duration-300
                          hover:text-gold
                          sm:text-sm
                        "
                      >
                        {email}
                      </a>
                    </div>
                  )}

                  {location && (
                    <div className="min-w-0">
                      <p
                        className="
                          text-[9px]
                          uppercase tracking-[0.2em]
                          text-gold/80
                          sm:text-[10px]
                        "
                      >
                        Location
                      </p>

                      <p
                        className="
                          mt-1.5
                          whitespace-pre-line
                          text-xs
                          leading-5
                          text-ivory/90
                          sm:text-sm sm:leading-6
                        "
                      >
                        {location}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal
            delay={120}
            className="
              w-full
              lg:col-span-7
            "
          >
            <div
              className="
                flex h-full w-full flex-col
                border border-gold/10
                bg-white/2
                p-5
                sm:p-7
                md:p-8
                lg:p-9
                xl:p-10
              "
            >
              <div className="mb-6 sm:mb-7">
                <p
                  className="
                    mb-2
                    text-[9px]
                    uppercase tracking-[0.2em]
                    text-gold
                    sm:mb-3 sm:text-[10px]
                  "
                >
                  Project Enquiry
                </p>

                <h3
                  className="
                    font-serif
                    text-xl
                    leading-tight
                    text-ivory
                    sm:text-2xl
                    md:text-3xl
                  "
                >
                  Tell us about your project
                </h3>

                <p
                  className="
                    mt-2
                    max-w-xl
                    text-xs
                    leading-5
                    text-stone-dim
                    sm:text-sm sm:leading-6
                  "
                >
                  Share a few details and we&apos;ll get back to you to discuss
                  your vision and the next steps.
                </p>
              </div>

              {/* Form */}
              <div className="w-full flex-1">
                <EnquiryForm />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

