import { defineType, defineField, defineArrayMember } from "sanity"

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "intro", title: "Introduction" },
    { name: "sthapati", title: "The Sthapati" },
    { name: "philosophy", title: "Philosophy" },
    { name: "heritage", title: "Heritage" },
    { name: "contact", title: "Contact" },
  ],
  fields: [
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroSubtext",
      title: "Hero Subtext",
      type: "text",
      rows: 2,
      group: "hero",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
    }),
    defineField({
      name: "introHeading",
      title: "Intro Heading",
      type: "string",
      group: "intro",
    }),
    defineField({
      name: "introText",
      title: "Intro Text",
      type: "text",
      rows: 4,
      group: "intro",
    }),
    defineField({
      name: "sthapatiName",
      title: "Sthapati Name",
      type: "string",
      group: "sthapati",
    }),
    defineField({
      name: "sthapatiBio",
      title: "Sthapati Bio",
      type: "blockContent",
      group: "sthapati",
    }),
    defineField({
      name: "sthapatiPhoto",
      title: "Sthapati Photo",
      type: "image",
      group: "sthapati",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
    }),
    defineField({
      name: "philosophy",
      title: "Philosophy",
      type: "array",
      group: "philosophy",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "text",
              title: "Text",
              type: "text",
              rows: 2,
            }),
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        }),
      ],
    }),
    defineField({
      name: "heritageQuote",
      title: "Heritage Quote",
      type: "text",
      rows: 2,
      group: "heritage",
    }),
    defineField({
      name: "heritageImage",
      title: "Heritage Image",
      type: "image",
      group: "heritage",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
    }),
    defineField({
      name: "contactPhone",
      title: "Contact Phone",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "contactLocation",
      title: "Contact Location",
      type: "text",
      rows: 2,
      group: "contact",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      group: "contact",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
})
