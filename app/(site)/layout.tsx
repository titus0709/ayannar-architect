import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { sanityFetch } from "@/sanity/lib/live"
import { siteSettingsQuery } from "@/sanity/lib/queries"

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: settings } = await sanityFetch({ query: siteSettingsQuery })

  return (
    <>
      <Navbar />
      <main id="main">{children}</main>
      <Footer settings={settings as Parameters<typeof Footer>[0]["settings"]} />
    </>
  )
}
