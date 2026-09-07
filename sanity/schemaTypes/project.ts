import { defineType, defineField, defineArrayMember } from "sanity"

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",

  groups: [
    { name: "content", title: "Content", default: true },
    { name: "media", title: "Media" },
    { name: "meta", title: "Meta" },
  ],

  fields: [
    // =========================================================
    // CONTENT
    // =========================================================

    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "location",
      title: "Location",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "year",
      title: "Year",
      type: "string",
      group: "content",
    }),

    defineField({
      name: "category",
      title: "Project Category",
      type: "string",
      group: "content",
      description:
        "Main project category, e.g. Temple Architecture, Restoration, Mandapam.",
    }),

    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      group: "content",
      description: "Short text shown on featured cards and listings.",
    }),

    defineField({
      name: "story",
      title: "Project story",
      type: "blockContent",
      group: "content",
    }),

    defineField({
      name: "approach",
      title: "Architectural approach",
      type: "blockContent",
      group: "content",
    }),

    defineField({
      name: "craftsmanship",
      title: "Traditional craftsmanship",
      type: "blockContent",
      group: "content",
    }),

    // =========================================================
    // MEDIA
    // =========================================================

    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      group: "media",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    // =========================================================
    // GALLERY
    // =========================================================

    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "media",
      description:
        "Upload project photographs here. Each image can be assigned to a category.",

      of: [
        defineArrayMember({
          type: "image",
          options: {
            hotspot: true,
          },

          fields: [
            // -------------------------------------------------
            // ALT TEXT
            // -------------------------------------------------

            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              description:
                "Describe the image for accessibility and SEO.",
              validation: (rule) => rule.required(),
            }),

            // -------------------------------------------------
            // CAPTION
            // -------------------------------------------------

            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
              description:
                "Optional caption displayed when the image is opened.",
            }),

            // -------------------------------------------------
            // CATEGORY DROPDOWN
            // -------------------------------------------------

            defineField({
              name: "category",
              title: "Category",
              type: "string",

              description:
                "Choose which gallery category this photograph belongs to.",

              options: {
                layout: "dropdown",

                list: [
                  {
                    title: "General Photo",
                    value: "General Photo",
                  },
                  {
                    title: "Vigraham",
                    value: "Vigraham",
                  },
                  {
                    title: "Vaganam",
                    value: "Vaganam",
                  },
                  {
                    title: "Compound Wall",
                    value: "Compound Wall",
                  },
                  {
                    title: "Small Temples",
                    value: "Small Temples",
                  },
                  {
                    title: "Mandapam",
                    value: "Mandapam",
                  },
                  {
                    title: "Interior",
                    value: "Interior",
                  },
                  {
                    title: "Exterior",
                    value: "Exterior",
                  },
                  {
                    title: "Sculpture",
                    value: "Sculpture",
                  },
                  {
                    title: "Kodimaram",
                    value: "Kodimaram",
                  },
                  {
                    title: "Restoration",
                    value: "Restoration",
                  },
                  {
                    title: "Details",
                    value: "Details",
                  },
                  {
                    title: "Other",
                    value: "Other",
                  },
                ],
              },
            }),
          ],
        }),
      ],
    }),

    // =========================================================
    // CLOSING IMAGE
    // =========================================================

    defineField({
      name: "closingImage",
      title: "Closing Image",
      type: "image",
      group: "media",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
    }),

    // =========================================================
    // META
    // =========================================================

    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "meta",
      initialValue: false,
    }),

    defineField({
      name: "order",
      title: "Order",
      type: "number",
      group: "meta",
      description:
        "Controls the display order (lower numbers first).",
    }),
  ],

  // ===========================================================
  // ORDERING
  // ===========================================================

  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [
        {
          field: "order",
          direction: "asc",
        },
      ],
    },
  ],

  // ===========================================================
  // PREVIEW
  // ===========================================================

  preview: {
    select: {
      title: "title",
      subtitle: "location",
      media: "heroImage",
    },
  },
})