import { PortableText, type PortableTextComponents } from "next-sanity"
import type { PortableTextBlock } from "sanity"

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-6 text-base leading-relaxed text-stone md:text-lg">
        {children}
      </p>
    ),
    h3: ({ children }) => (
      <h3 className="mb-4 mt-10 font-serif text-2xl text-ivory md:text-3xl">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l border-gold pl-6 font-serif text-xl italic text-ivory md:text-2xl">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 ml-5 list-disc space-y-2 text-stone marker:text-gold">
        {children}
      </ul>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-ivory">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        className="text-gold underline underline-offset-4 transition-colors hover:text-ivory"
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    ),
  },
}

export function RichText({ value }: { value: PortableTextBlock[] }) {
  if (!value) return null
  return <PortableText value={value} components={components} />
}
