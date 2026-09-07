import fs from "fs"
import path from "path"
import dotenv from "dotenv"
import { createClient } from "@sanity/client"

dotenv.config({ path: ".env.local" })

// ============================================================
// SANITY CONFIG
// ============================================================

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET
const WRITE_TOKEN = process.env.SANITY_API_WRITE_TOKEN

if (!PROJECT_ID) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local"
  )
}

if (!DATASET) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_DATASET in .env.local"
  )
}

if (!WRITE_TOKEN) {
  throw new Error(
    "Missing SANITY_API_WRITE_TOKEN in .env.local"
  )
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: WRITE_TOKEN,
  useCdn: false,
  apiVersion: "2025-01-01",
  requestTimeout: 120000,
})

// ============================================================
// CONTENT DIRECTORY
// ============================================================

const CONTENT_DIR = path.join(process.cwd(), "content")

// ============================================================
// ALLOWED IMAGE EXTENSIONS
// ============================================================

const IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif",
]

// ============================================================
// YOUR EXACT GALLERY CATEGORIES
// ============================================================
//
// The LEFT side is the folder name.
// The RIGHT side is what gets saved into Sanity.
//
// Example:
//
// content/project-name/vigraham/
//                    ↓
// category = "Vigraham"
// ============================================================

const CATEGORY_MAP = {
  "vigraham": "Vigraham",

  "vaganam": "Vaganam",

  "general-photo": "General Photo",
  "general_photo": "General Photo",
  "general photo": "General Photo",

  "small-temples": "Small Temples",
  "small_temples": "Small Temples",
  "small temples": "Small Temples",

  "mandapam": "Mandapam",

  "rajagopuram": "Rajagopuram",

  "compound-wall": "Compound Wall",
  "compound_wall": "Compound Wall",
  "compound wall": "Compound Wall",

  "cement-works": "Cement Works",
  "cement_works": "Cement Works",
  "cement works": "Cement Works",

  "kodimaram": "Kodimaram",
}

// ============================================================
// FORMAT CATEGORY
// ============================================================

function getCategory(folderName) {
  const normalized = folderName
    .trim()
    .toLowerCase()

  const category = CATEGORY_MAP[normalized]

  if (!category) {
    throw new Error(
      `Unknown category folder: "${folderName}".\n\n` +
      `Allowed folders are:\n` +
      `  vigraham\n` +
      `  vaganam\n` +
      `  general-photo\n` +
      `  small-temples\n` +
      `  mandapam\n` +
      `  rajagopuram\n` +
      `  compound-wall\n` +
      `  cement-works\n` +
      `  kodimaram`
    )
  }

  return category
}

// ============================================================
// SLUGIFY
// ============================================================

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

// ============================================================
// CHECK IMAGE
// ============================================================

function isImageFile(filename) {
  return IMAGE_EXTENSIONS.includes(
    path.extname(filename).toLowerCase()
  )
}

// ============================================================
// UPLOAD IMAGE WITH RETRIES
// ============================================================

async function uploadImage(filePath) {
  const filename = path.basename(filePath)

  const MAX_RETRIES = 4

  for (
    let attempt = 1;
    attempt <= MAX_RETRIES;
    attempt++
  ) {
    try {
      console.log(
        `      Uploading: ${filename} (attempt ${attempt}/${MAX_RETRIES})`
      )

      const asset = await client.assets.upload(
        "image",
        fs.createReadStream(filePath),
        {
          filename,
        }
      )

      console.log(
        `      ✓ Uploaded: ${filename}`
      )

      return asset
    } catch (error) {
      console.log(
        `      ⚠ Upload failed for ${filename}: ${
          error?.message || error
        }`
      )

      if (attempt === MAX_RETRIES) {
        throw error
      }

      const waitTime = attempt * 3000

      console.log(
        `      Waiting ${
          waitTime / 1000
        }s before retry...`
      )

      await new Promise((resolve) =>
        setTimeout(resolve, waitTime)
      )
    }
  }
}

// ============================================================
// CREATE ALT TEXT
// ============================================================

function createAltText(
  projectTitle,
  category
) {
  return `${projectTitle} - ${category}`
}

// ============================================================
// MIGRATE ONE PROJECT
// ============================================================

async function migrateProject(
  projectFolderName
) {
  const projectDir = path.join(
    CONTENT_DIR,
    projectFolderName
  )

  console.log(
    "\n========================================"
  )

  console.log(
    `Processing project: ${projectFolderName}`
  )

  console.log(
    "========================================"
  )

  // ----------------------------------------------------------
  // META.JSON
  // ----------------------------------------------------------

  const metaPath = path.join(
    projectDir,
    "meta.json"
  )

  let meta = {}

  if (fs.existsSync(metaPath)) {
    meta = JSON.parse(
      fs.readFileSync(metaPath, "utf8")
    )

    console.log(
      "✓ meta.json found"
    )
  } else {
    console.log(
      "⚠ No meta.json found. Using defaults."
    )
  }

  // ----------------------------------------------------------
  // PROJECT INFORMATION
  // ----------------------------------------------------------

  const title =
    meta.title ||
    projectFolderName

  const slug = slugify(
    projectFolderName
  )

  console.log(`✓ Project title: ${title}`)
  console.log(`✓ Project slug: ${slug}`)

  // ----------------------------------------------------------
  // FIND CATEGORY FOLDERS
  // ----------------------------------------------------------

  const categoryFolders = fs
    .readdirSync(projectDir, {
      withFileTypes: true,
    })
    .filter(
      (entry) =>
        entry.isDirectory()
    )
    .map(
      (entry) => entry.name
    )

  if (
    categoryFolders.length === 0
  ) {
    console.log(
      "⚠ No category folders found."
    )

    return
  }

  console.log(
    `✓ Found ${categoryFolders.length} category folder(s)`
  )

  // ----------------------------------------------------------
  // GALLERY
  // ----------------------------------------------------------

  const gallery = []

  let heroImage = null

  // ----------------------------------------------------------
  // PROCESS EACH CATEGORY
  // ----------------------------------------------------------

  for (
    const categoryFolder of categoryFolders
  ) {
    const categoryPath = path.join(
      projectDir,
      categoryFolder
    )

    let categoryLabel

    try {
      categoryLabel =
        getCategory(
          categoryFolder
        )
    } catch (error) {
      console.log(
        `\n❌ ${error.message}`
      )

      throw error
    }

    console.log(
      `\n  Category: ${categoryLabel}`
    )

    // --------------------------------------------------------
    // FIND IMAGES
    // --------------------------------------------------------

    const files = fs
      .readdirSync(categoryPath)
      .filter(isImageFile)
      .sort()

    console.log(
      `  ✓ Found ${files.length} image(s)`
    )

    // --------------------------------------------------------
    // UPLOAD EACH IMAGE
    // --------------------------------------------------------

    for (
      const filename of files
    ) {
      const filePath = path.join(
        categoryPath,
        filename
      )

      const asset =
        await uploadImage(
          filePath
        )

      // ------------------------------------------------------
      // GALLERY IMAGE
      // ------------------------------------------------------

      const imageItem = {
        _type: "image",

        asset: {
          _type: "reference",
          _ref: asset._id,
        },

        alt: createAltText(
          title,
          categoryLabel
        ),

        caption: "",

        category:
          categoryLabel,
      }

      gallery.push(
        imageItem
      )

      console.log(
        `      ✓ Category assigned: ${categoryLabel}`
      )

      // ------------------------------------------------------
      // FIRST IMAGE = HERO
      // ------------------------------------------------------

      if (!heroImage) {
        heroImage = {
          _type: "image",

          asset: {
            _type: "reference",
            _ref: asset._id,
          },

          alt: `${title} - ${categoryLabel}`,
        }

        console.log(
          `      ★ First image selected as Hero Image`
        )
      }
    }
  }

  // ==========================================================
  // VALIDATE IMAGES
  // ==========================================================

  if (!heroImage) {
    throw new Error(
      `No images found for project "${title}". Hero image is required.`
    )
  }

  // ==========================================================
  // CHECK EXISTING PROJECT
  // ==========================================================

  const existingProject =
    await client.fetch(
      `*[
        _type == "project" &&
        slug.current == $slug
      ][0]{
        _id
      }`,
      {
        slug,
      }
    )

  const documentId =
    existingProject?._id ||
    `project-${slug}`

  console.log(
    `\n✓ Sanity document ID: ${documentId}`
  )

  // ==========================================================
  // CREATE SANITY DOCUMENT
  // ==========================================================

  const document = {
    _id: documentId,

    _type: "project",

    title,

    slug: {
      _type: "slug",
      current: slug,
    },

    location:
      meta.location ||
      "Tamil Nadu, India",

    year:
      meta.yearCompleted ||
      meta.year ||
      "",

    category:
      meta.category ||
      "",

    summary:
      meta.summary ||
      "",

    heroImage,

    gallery,

    featured:
      meta.featured ?? false,

    order:
      meta.order ?? 0,
  }

  // ==========================================================
  // SAVE PROJECT
  // ==========================================================

  console.log(
    "\n  Saving project to Sanity..."
  )

  await client.createOrReplace(
    document
  )

  // ==========================================================
  // SUCCESS
  // ==========================================================

  console.log(
    `\n✓ SUCCESS: ${title}`
  )

  console.log(
    `  Slug: ${slug}`
  )

  console.log(
    `  Categories: ${categoryFolders.length}`
  )

  console.log(
    `  Gallery images: ${gallery.length}`
  )

  console.log(
    `  Document ID: ${documentId}`
  )
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  // ----------------------------------------------------------
  // CHECK CONTENT DIRECTORY
  // ----------------------------------------------------------

  if (
    !fs.existsSync(
      CONTENT_DIR
    )
  ) {
    throw new Error(
      `Content directory not found: ${CONTENT_DIR}`
    )
  }

  // ----------------------------------------------------------
  // FIND PROJECTS
  // ----------------------------------------------------------

  const projectFolders =
    fs
      .readdirSync(
        CONTENT_DIR,
        {
          withFileTypes: true,
        }
      )
      .filter(
        (entry) =>
          entry.isDirectory()
      )
      .map(
        (entry) =>
          entry.name
      )

  if (
    projectFolders.length === 0
  ) {
    console.log(
      "No projects found inside content/"
    )

    return
  }

  console.log(
    `Found ${projectFolders.length} project(s).`
  )

  console.log(
    "\nCategories supported:"
  )

  console.log(
    "  1. Vigraham"
  )

  console.log(
    "  2. Vaganam"
  )

  console.log(
    "  3. General Photo"
  )

  console.log(
    "  4. Small Temples"
  )

  console.log(
    "  5. Mandapam"
  )

  console.log(
    "  6. Rajagopuram"
  )

  console.log(
    "  7. Compound Wall"
  )

  console.log(
    "  8. Cement Works"
  )

  console.log(
    "  9. Kodimaram"
  )

  // ----------------------------------------------------------
  // MIGRATE PROJECTS ONE BY ONE
  // ----------------------------------------------------------

  for (
    const projectFolder of projectFolders
  ) {
    await migrateProject(
      projectFolder
    )
  }

  // ----------------------------------------------------------
  // FINISHED
  // ----------------------------------------------------------

  console.log(
    "\n========================================"
  )

  console.log(
    "Migration completed successfully."
  )

  console.log(
    "========================================\n"
  )
}

// ============================================================
// RUN
// ============================================================

main().catch(
  (error) => {
    console.error(
      "\n❌ Migration failed:"
    )

    console.error(
      error
    )

    process.exit(1)
  }
)