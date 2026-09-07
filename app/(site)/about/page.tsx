import type { Metadata } from "next"

import { PageHeader } from "@/components/page-header"
import { Sthapati } from "@/components/sections/sthapati"
import { Heritage } from "@/components/sections/heritage"
import { sanityFetch } from "@/sanity/lib/live"
import { siteSettingsQuery } from "@/sanity/lib/queries"

export const metadata: Metadata = {
  title: "The Sthapati",
  description:
    "The architect behind Sri Ayyanar Architects — a life devoted to traditional temple architecture, restoration, and craftsmanship.",
}

export default async function AboutPage() {
  const { data } = await sanityFetch({ query: siteSettingsQuery })
  const settings = data as Record<string, any>

  return (
    <>
      <PageHeader
        eyebrow="The Sthapati"
        title="A Life in Sacred Architecture"
        intro="Traditional temple architecture, restoration, and the craft of working with artisans — guided by principles carried across generations."
      />
      <Sthapati
        name={settings?.sthapatiName}
        bio={settings?.sthapatiBio}
        photo={settings?.sthapatiPhoto}
        showCta={false}
      />
      <Heritage quote={settings?.heritageQuote} image={settings?.heritageImage} />
    </>
  )
}
