import Link from "next/link"

type Settings = {
  contactPhone?: string | null
  contactEmail?: string | null
  contactLocation?: string | null
  socialLinks?: { platform?: string | null; url?: string | null }[] | null
}

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  // { href: "/philosophy", label: "Philosophy" },
  { href: "/contact", label: "Contact" },
]

export function Footer({ settings }: { settings: Settings | null }) {
  return (
    <footer className="border-t border-gold/20 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="font-serif text-xl text-ivory">
              Sri Ayyanar Architects
            </p>
            <p className="mt-3 text-xs uppercase tracking-label text-gold">
              Temple Architecture and Sculptors
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="mb-5 text-xs uppercase tracking-label text-stone-dim">
              Navigate
            </p>
            <ul className="space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-stone transition-colors hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mb-5 text-xs uppercase tracking-label text-stone-dim">
              Contact
            </p>
            <ul className="space-y-3 text-sm text-stone">
              {settings?.contactPhone && (
                <li>
                  <a
                    href={`tel:${settings.contactPhone.replace(/\s+/g, "")}`}
                    className="transition-colors hover:text-gold"
                  >
                    {settings.contactPhone}
                  </a>
                </li>
              )}
              {settings?.contactEmail && (
                <li>
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="transition-colors hover:text-gold"
                  >
                    {settings.contactEmail}
                  </a>
                </li>
              )}
              {settings?.contactLocation && (
                <li className="whitespace-pre-line leading-relaxed">
                  {settings.contactLocation}
                </li>
              )}
            </ul>
          </div>

          {settings?.socialLinks && settings.socialLinks.length > 0 && (
            <div>
              <p className="mb-5 text-xs uppercase tracking-label text-stone-dim">
                Elsewhere
              </p>
              <ul className="space-y-3 text-sm text-stone">
                {settings.socialLinks.map((s, i) =>
                  s?.url ? (
                    <li key={i}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="transition-colors hover:text-gold"
                      >
                        {s.platform}
                      </a>
                    </li>
                  ) : null,
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-16 hairline" />
        <p className="mt-8 text-xs tracking-wide-2 text-stone-dim">
          © {new Date().getFullYear()} Sri Ayyanar Architects. All rights
          reserved.
        </p>
      </div>
    </footer>
  )
}
