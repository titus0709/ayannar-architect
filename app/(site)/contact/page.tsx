import type { Metadata } from "next"

import { PageHeader } from "@/components/page-header"
import { Reveal } from "@/components/reveal"
import { EnquiryForm } from "@/components/enquiry-form"
import { sanityFetch } from "@/sanity/lib/live"
import { siteSettingsQuery } from "@/sanity/lib/queries"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Begin a conversation about temple commissions, restoration projects, and traditional architectural consultations.",
}

export default async function ContactPage() {
  const { data } = await sanityFetch({ query: siteSettingsQuery })
  const settings = data as {
    contactPhone?: string
    contactEmail?: string
    contactLocation?: string
    socialLinks?: Array<{ url?: string; platform?: string }>
  } | null
  const socialLinks = settings?.socialLinks

  const details = [
    { label: "Phone", value: settings?.contactPhone, href: settings?.contactPhone ? `tel:${settings.contactPhone.replace(/\s+/g, "")}` : undefined },
    { label: "Email", value: settings?.contactEmail, href: settings?.contactEmail ? `mailto:${settings.contactEmail}` : undefined },
    { label: "Location", value: settings?.contactLocation, href: undefined },
  ].filter((d) => d.value)

  return (
    <>
      <PageHeader
        eyebrow="Enquiries"
        title="Begin a Conversation"
        intro="For temple commissions, restoration projects, and traditional architectural consultations."
      />

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-4">
            <p className="mb-8 text-xs uppercase tracking-label text-gold">
              Details
            </p>
            <dl className="space-y-8">
              {details.map((d) => (
                <div key={d.label} className="border-t border-gold/15 pt-5">
                  <dt className="text-[10px] uppercase tracking-label text-stone-dim">
                    {d.label}
                  </dt>
                  <dd className="mt-2 whitespace-pre-line leading-relaxed text-ivory">
                    {d.href ? (
                      <a
                        href={d.href}
                        className="transition-colors hover:text-gold"
                      >
                        {d.value}
                      </a>
                    ) : (
                      d.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            {socialLinks && socialLinks.length > 0 && (
              <div className="mt-12 border-t border-gold/15 pt-5">
                <p className="text-[10px] uppercase tracking-label text-stone-dim">
                  Elsewhere
                </p>
                <ul className="mt-3 space-y-2">
                  {socialLinks.map((s, i) =>
                    s?.url ? (
                      <li key={i}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-ivory transition-colors hover:text-gold"
                        >
                          {s.platform}
                        </a>
                      </li>
                    ) : null,
                  )}
                </ul>
              </div>
            )}
          </Reveal>

          <Reveal delay={120} className="lg:col-span-7 lg:col-start-6">
            <EnquiryForm />
          </Reveal>
        </div>
      </section>
    </>
  )
}
