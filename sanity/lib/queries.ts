import { defineQuery } from "next-sanity"

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0]{
    heroEyebrow,
    heroHeadline,
    heroSubtext,
    heroImage,
    introHeading,
    introText,
    sthapatiName,
    sthapatiBio,
    sthapatiPhoto,
    philosophy[]{ title, text },
    heritageQuote,
    heritageImage,
    contactPhone,
    contactEmail,
    contactLocation,
    socialLinks[]{ platform, url }
  }
`)

export const featuredProjectsQuery = defineQuery(`
  *[_type == "project" && featured == true] | order(order asc){
    _id,
    title,
    "slug": slug.current,
    location,
    year,
    category,
    summary,
    heroImage
  }[0...6]
`)

export const allProjectsQuery = defineQuery(`
  *[_type == "project"] | order(order asc){
    _id,
    title,
    "slug": slug.current,
    location,
    year,
    category,
    summary,
    heroImage
  }
`)

export const projectBySlugQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    location,
    year,
    category,
    summary,
    heroImage,
    story,
    approach,
    craftsmanship,
    gallery[]{
      _key,
      alt,
      caption,
      category,
      asset,
      hotspot,
      crop
    },
    closingImage
  }
`)

export const projectSlugsQuery = defineQuery(`
  *[_type == "project" && defined(slug.current)]{ "slug": slug.current }
`)
