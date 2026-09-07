import { Hero } from "@/components/sections/hero"
import { Intro } from "@/components/sections/intro"
import { FeaturedProjects } from "@/components/sections/featured-projects"
import { Sthapati } from "@/components/sections/sthapati"
import { Philosophy } from "@/components/sections/philosophy"
import { Heritage } from "@/components/sections/heritage"
import { ContactCta } from "@/components/sections/contact-cta"
import { sanityFetch } from "@/sanity/lib/live"
import { featuredProjectsQuery, siteSettingsQuery } from "@/sanity/lib/queries"
import { TrustSection } from "@/components/sections/trust";
import {WhatsAppButton} from "@/components/whatsapp-button";
import {ContactSection} from "@/components/sections/contact-section";


export default async function HomePage() {
  const [{ data: rawSettings }, { data: featured }] = await Promise.all([
    sanityFetch({ query: siteSettingsQuery }),
    sanityFetch({ query: featuredProjectsQuery }),
  ])
  const settings = rawSettings as {
    heroEyebrow?: string
    heroHeadline?: string
    heroSubtext?: string
    heroImage?: unknown
    introHeading?: string
    introText?: string
    sthapatiName?: string
    sthapatiBio?: Parameters<typeof Sthapati>[0]["bio"]
    sthapatiPhoto?: unknown
    philosophy?: unknown
    heritageQuote?: string
    heritageImage?: unknown
    contactPhone?: string | null
    contactEmail?: string | null
    contactLocation?: string | null
    socialLinks?: {
      platform?: string | null
      url?: string | null
    }[] | null
  } | null

  return (
    <>
      <Hero
        eyebrow={settings?.heroEyebrow}
        headline={settings?.heroHeadline}
        subtext={settings?.heroSubtext}
        image={settings?.heroImage as Parameters<typeof Hero>[0]["image"]}
      />
      <TrustSection/>
      {/* <Intro heading={settings?.introHeading} text={settings?.introText} /> */}
      <FeaturedProjects
        projects={
          (featured ?? []) as unknown as Parameters<typeof FeaturedProjects>[0]["projects"]
        }
      />
      <Sthapati
        name={settings?.sthapatiName}
        bio={settings?.sthapatiBio}
        photo={settings?.sthapatiPhoto as Parameters<typeof Sthapati>[0]["photo"]}
      />
      <ContactSection settings={settings} />
      <Philosophy
        principles={
          settings?.philosophy as Parameters<typeof Philosophy>[0]["principles"]
        }
      />
      <Heritage
        quote={settings?.heritageQuote}
        image={
          settings?.heritageImage as Parameters<typeof Heritage>[0]["image"]
        }
      />
      <ContactCta />
      <WhatsAppButton/>
    </>
  )
}
