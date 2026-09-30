// Single source of truth for gallery categories.
// Used by the schema dropdown AND the gallery input in the Studio.
// Add a new category here and it appears everywhere.
export const GALLERY_CATEGORIES = [
  "General Photo",
  "Vigraham",
  "Vaganam",
  "Compound Wall",
  "Small Temples",
  "Mandapam",
  "Interior",
  "Exterior",
  "Sculpture",
  "Kodimaram",
  "Restoration",
  "Details",
  "Other",
] as const

export const GALLERY_CATEGORY_OPTIONS = GALLERY_CATEGORIES.map((c) => ({
  title: c,
  value: c,
}))