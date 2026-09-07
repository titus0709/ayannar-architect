import type { Metadata } from "next"
import type { ComponentProps } from "react"

import { PageHeader } from "@/components/page-header"
import { Philosophy } from "@/components/sections/philosophy"
import { Heritage } from "@/components/sections/heritage"
import { ContactCta } from "@/components/sections/contact-cta"
import { sanityFetch } from "@/sanity/lib/live"
import { siteSettingsQuery } from "@/sanity/lib/queries"

export const metadata: Metadata = {
  title: "Philosophy",
  description:
    "The guiding principles of Sri Ayyanar Architects: tradition, proportion, craft, and legacy.",
}

export default async function PhilosophyPage() {
  const { data: settings } = await sanityFetch({ query: siteSettingsQuery })
  const typedSettings = settings as {
    philosophy?: ComponentProps<typeof Philosophy>["principles"]
    heritageQuote?: ComponentProps<typeof Heritage>["quote"]
    heritageImage?: ComponentProps<typeof Heritage>["image"]
  } | null

  return (
    <>
      <PageHeader
        eyebrow="Guiding Principles"
        title="Philosophy"
        intro="An approach shaped by inherited knowledge, sacred geometry, and enduring craftsmanship."
      />
      <Philosophy principles={typedSettings?.philosophy} showHeading={false} />
      <Heritage quote={typedSettings?.heritageQuote} image={typedSettings?.heritageImage} />
      <ContactCta />
    </>
  )
}
