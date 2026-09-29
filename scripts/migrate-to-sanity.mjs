
import fs from "fs"
import path from "path"
import crypto from "crypto"
import dotenv from "dotenv"
import { createClient } from "@sanity/client"

// ============================================================
// ENVIRONMENT
// ============================================================

dotenv.config({ path: ".env.local" })

// ============================================================
// SANITY CONFIG
// ============================================================

const PROJECT_ID =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID

const DATASET =
  process.env.NEXT_PUBLIC_SANITY_DATASET

const WRITE_TOKEN =
  process.env.SANITY_API_WRITE_TOKEN

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

const CONTENT_DIR = path.join(
  process.cwd(),
  "content"
)

// ============================================================
// IMAGE EXTENSIONS
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
// CATEGORY MAP
// ============================================================
//
// LEFT  = folder name
// RIGHT = category stored in Sanity
//
// Rajagopuram and Compound Wall are intentionally
// combined into ONE category.
// ============================================================

const CATEGORY_MAP = {
  // ----------------------------------------------------------
  // VIGRAHAM
  // ----------------------------------------------------------

  "vigraham": "Vigraham",

  // ----------------------------------------------------------
  // VAGANAM
  // ----------------------------------------------------------

  "vaganam": "Vaganam",

  // ----------------------------------------------------------
  // GENERAL PHOTO
  // ----------------------------------------------------------

  "general-photo": "General Photo",
  "general_photo": "General Photo",
  "general photo": "General Photo",

  // ----------------------------------------------------------
  // SMALL TEMPLES
  // ----------------------------------------------------------

  "small-temples": "Small Temples",
  "small_temples": "Small Temples",
  "small temples": "Small Temples",

  // ----------------------------------------------------------
  // MANDAPAM
  // ----------------------------------------------------------

  "mandapam": "Mandapam",

  // ----------------------------------------------------------
  // RAJAGOPURAM + COMPOUND WALL
  // ----------------------------------------------------------

  "rajagopuram":
    "Rajagopuram & Compound Wall",

  "compound-wall":
    "Rajagopuram & Compound Wall",

  "compound_wall":
    "Rajagopuram & Compound Wall",

  "compound wall":
    "Rajagopuram & Compound Wall",

  "rajagopuram-compound-wall":
    "Rajagopuram & Compound Wall",

  "rajagopuram_compound_wall":
    "Rajagopuram & Compound Wall",

  "rajagopuram compound wall":
    "Rajagopuram & Compound Wall",

  // ----------------------------------------------------------
  // CEMENT WORKS
  // ----------------------------------------------------------

  "cement-works": "Cement Works",
  "cement_works": "Cement Works",
  "cement works": "Cement Works",

  // ----------------------------------------------------------
  // KODIMARAM
  // ----------------------------------------------------------

  "kodimaram": "Kodimaram",

  // ----------------------------------------------------------
  // AMMAN KOVIL
  // ----------------------------------------------------------

  "amman-kovil": "Amman Kovil",
  "amman_kovil": "Amman Kovil",
  "amman kovil": "Amman Kovil",

  // ----------------------------------------------------------
  // DEEPASTHAMBAM
  // ----------------------------------------------------------

  "deepasthambam": "Deepasthambam",
}

// ============================================================
// CATEGORY NORMALIZER
// ============================================================

function getCategory(folderName) {
  const normalized =
    folderName
      .trim()
      .toLowerCase()

  const category =
    CATEGORY_MAP[normalized]

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
      `  rajagopuram-compound-wall\n` +
      `  cement-works\n` +
      `  kodimaram\n` +
      `  amman-kovil\n` +
      `  deepasthambam`
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
// IMAGE CHECK
// ============================================================

function isImageFile(filename) {
  return IMAGE_EXTENSIONS.includes(
    path.extname(filename).toLowerCase()
  )
}

// ============================================================
// SHA-1 HASH
// ============================================================
//
// This is the key part that prevents duplicate uploads.
//
// Two files with identical contents will have the same SHA-1.
// We check Sanity for that SHA-1 before uploading.
// ============================================================

function getFileHash(filePath) {
  const fileBuffer =
    fs.readFileSync(filePath)

  return crypto
    .createHash("sha1")
    .update(fileBuffer)
    .digest("hex")
}

// ============================================================
// FIND EXISTING SANITY IMAGE ASSET
// ============================================================

async function findExistingAsset(
  sha1
) {
  const asset =
    await client.fetch(
      `*[
        _type == "sanity.imageAsset" &&
        sha1 == $sha1
      ][0]{
        _id,
        originalFilename,
        sha1
      }`,
      {
        sha1,
      }
    )

  return asset || null
}

// ============================================================
// UPLOAD IMAGE
// ============================================================

async function uploadImage(
  filePath
) {
  const filename =
    path.basename(filePath)

  const MAX_RETRIES = 4

  for (
    let attempt = 1;
    attempt <= MAX_RETRIES;
    attempt++
  ) {
    try {
      console.log(
        `      Uploading: ${filename} ` +
        `(attempt ${attempt}/${MAX_RETRIES})`
      )

      const asset =
        await client.assets.upload(
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

      if (
        attempt === MAX_RETRIES
      ) {
        throw error
      }

      const waitTime =
        attempt * 3000

      console.log(
        `      Waiting ${
          waitTime / 1000
        }s before retry...`
      )

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            waitTime
          )
      )
    }
  }
}

// ============================================================
// GET OR CREATE ASSET
// ============================================================
//
// 1. Calculate local file SHA-1
// 2. Search Sanity for same SHA-1
// 3. If found → reuse existing asset
// 4. If not found → upload
// ============================================================

async function getOrCreateAsset(
  filePath
) {
  const filename =
    path.basename(filePath)

  console.log(
    `      Checking: ${filename}`
  )

  const sha1 =
    getFileHash(filePath)

  const existingAsset =
    await findExistingAsset(
      sha1
    )

  if (existingAsset) {
    console.log(
      `      ✓ Already exists in Sanity: ${filename}`
    )

    console.log(
      `        Asset ID: ${existingAsset._id}`
    )

    return {
      _id: existingAsset._id,
      reused: true,
    }
  }

  console.log(
    `      + New image detected: ${filename}`
  )

  const asset =
    await uploadImage(
      filePath
    )

  return {
    _id: asset._id,
    reused: false,
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
// NORMALIZE OLD CATEGORY VALUES
// ============================================================
//
// This is useful if your existing Sanity project already has:
//
// "Rajagopuram"
// "Compound Wall"
//
// They will automatically become:
//
// "Rajagopuram & Compound Wall"
// ============================================================

function normalizeExistingCategory(
  category
) {
  if (
    category === "Rajagopuram" ||
    category === "Compound Wall"
  ) {
    return "Rajagopuram & Compound Wall"
  }

  return category
}

// ============================================================
// MIGRATE ONE PROJECT
// ============================================================

async function migrateProject(
  projectFolderName
) {
  const projectDir =
    path.join(
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

  // ==========================================================
  // META.JSON
  // ==========================================================

  const metaPath =
    path.join(
      projectDir,
      "meta.json"
    )

  let meta = {}

  if (
    fs.existsSync(metaPath)
  ) {
    meta = JSON.parse(
      fs.readFileSync(
        metaPath,
        "utf8"
      )
    )

    console.log(
      "✓ meta.json found"
    )
  } else {
    console.log(
      "⚠ No meta.json found. Using defaults."
    )
  }

  // ==========================================================
  // PROJECT INFORMATION
  // ==========================================================

  const title =
    meta.title ||
    projectFolderName

  const slug =
    slugify(
      projectFolderName
    )

  console.log(
    `✓ Project title: ${title}`
  )

  console.log(
    `✓ Project slug: ${slug}`
  )

  // ==========================================================
  // FIND CATEGORY FOLDERS
  // ==========================================================

  const categoryFolders =
    fs
      .readdirSync(
        projectDir,
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

  // ==========================================================
  // FIND EXISTING PROJECT
  // ==========================================================

  const existingProject =
    await client.fetch(
      `*[
        _type == "project" &&
        slug.current == $slug
      ][0]{
        _id,
        title,
        heroImage,
        gallery
      }`,
      {
        slug,
      }
    )

  // ==========================================================
  // EXISTING GALLERY
  // ==========================================================

  const gallery = []

  if (
    existingProject?.gallery &&
    Array.isArray(
      existingProject.gallery
    )
  ) {
    console.log(
      `✓ Existing gallery found: ${existingProject.gallery.length} image(s)`
    )

    for (
      const existingImage
      of existingProject.gallery
    ) {
      gallery.push({
        ...existingImage,

        category:
          normalizeExistingCategory(
            existingImage.category
          ),
      })
    }
  } else {
    console.log(
      "✓ No existing gallery found"
    )
  }

  // ==========================================================
  // EXISTING ASSET IDS
  // ==========================================================

  const existingAssetIds =
    new Set(
      gallery
        .map(
          (image) =>
            image?.asset?._ref
        )
        .filter(Boolean)
    )

  console.log(
    `✓ Existing unique assets: ${existingAssetIds.size}`
  )

  // ==========================================================
  // HERO IMAGE
  // ==========================================================

  let heroImage =
    existingProject?.heroImage ||
    null

  if (heroImage) {
    console.log(
      "✓ Existing hero image preserved"
    )
  }

  // ==========================================================
  // PROCESS EACH CATEGORY
  // ==========================================================

  for (
    const categoryFolder
    of categoryFolders
  ) {
    const categoryPath =
      path.join(
        projectDir,
        categoryFolder
      )

    const categoryLabel =
      getCategory(
        categoryFolder
      )

    console.log(
      `\n  Category: ${categoryLabel}`
    )

    // ========================================================
    // FIND IMAGES
    // ========================================================

    const files =
      fs
        .readdirSync(
          categoryPath
        )
        .filter(
          isImageFile
        )
        .sort()

    console.log(
      `  ✓ Found ${files.length} image(s)`
    )

    if (
      files.length === 0
    ) {
      console.log(
        "  ⚠ No images in this folder"
      )

      continue
    }

    // ========================================================
    // PROCESS EACH IMAGE
    // ========================================================

    for (
      const filename
      of files
    ) {
      const filePath =
        path.join(
          categoryPath,
          filename
        )

      console.log(
        `\n    Image: ${filename}`
      )

      // ======================================================
      // GET OR CREATE ASSET
      // ======================================================

      const asset =
        await getOrCreateAsset(
          filePath
        )

      const assetId =
        asset._id

      // ======================================================
      // CHECK IF IMAGE ALREADY EXISTS
      // ======================================================

      if (
        existingAssetIds.has(
          assetId
        )
      ) {
        console.log(
          `      ✓ Already in this project's gallery - SKIPPED`
        )

        continue
      }

      // ======================================================
      // CREATE GALLERY IMAGE
      // ======================================================

      const imageItem = {
        _type: "image",

        asset: {
          _type: "reference",
          _ref: assetId,
        },

        alt:
          createAltText(
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

      existingAssetIds.add(
        assetId
      )

      console.log(
        `      ✓ Added to gallery`
      )

      console.log(
        `      ✓ Category: ${categoryLabel}`
      )

      // ======================================================
      // HERO IMAGE
      // ======================================================
      //
      // Only create a hero if the project doesn't already
      // have one.
      //

      if (!heroImage) {
        heroImage = {
          _type: "image",

          asset: {
            _type: "reference",
            _ref: assetId,
          },

          alt:
            `${title} - ${categoryLabel}`,
        }

        console.log(
          `      ★ Selected as Hero Image`
        )
      }
    }
  }

  // ==========================================================
  // VALIDATE HERO
  // ==========================================================

  if (!heroImage) {
    throw new Error(
      `No images found for project "${title}". Hero image is required.`
    )
  }

  // ==========================================================
  // DOCUMENT ID
  // ==========================================================

  const documentId =
    existingProject?._id ||
    `project-${slug}`

  console.log(
    `\n✓ Sanity document ID: ${documentId}`
  )

  // ==========================================================
  // CREATE UPDATED DOCUMENT
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
      meta.featured ??
      existingProject?.featured ??
      false,

    order:
      meta.order ??
      existingProject?.order ??
      0,
  }

  // ==========================================================
  // SAVE
  // ==========================================================

  console.log(
    "\n  Saving project to Sanity..."
  )

  await client.createOrReplace(
    document
  )

  // ==========================================================
  // SUMMARY
  // ==========================================================

  console.log(
    `\n✓ SUCCESS: ${title}`
  )

  console.log(
    `  Slug: ${slug}`
  )

  console.log(
    `  Category folders: ${categoryFolders.length}`
  )

  console.log(
    `  Total gallery images: ${gallery.length}`
  )

  console.log(
    `  Document ID: ${documentId}`
  )

  console.log(
    "  Duplicate images: skipped"
  )
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  // ==========================================================
  // CHECK CONTENT DIRECTORY
  // ==========================================================

  if (
    !fs.existsSync(
      CONTENT_DIR
    )
  ) {
    throw new Error(
      `Content directory not found: ${CONTENT_DIR}`
    )
  }

  // ==========================================================
  // FIND PROJECTS
  // ==========================================================

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

  // ==========================================================
  // SUPPORTED CATEGORIES
  // ==========================================================

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
    "  6. Rajagopuram & Compound Wall"
  )

  console.log(
    "  7. Cement Works"
  )

  console.log(
    "  8. Kodimaram"
  )

  console.log(
    "  9. Amman Kovil"
  )

  console.log(
    "  10. Deepasthambam"
  )

  // ==========================================================
  // PROCESS PROJECTS
  // ==========================================================

  for (
    const projectFolder
    of projectFolders
  ) {
    await migrateProject(
      projectFolder
    )
  }

  // ==========================================================
  // COMPLETE
  // ==========================================================

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

