import fs from "fs";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";

export const PUBLIC_DIR = path.resolve("public");
export const DISPLAY_DIR = path.join(PUBLIC_DIR, "photos", "display");
export const THUMB_DIR = path.join(PUBLIC_DIR, "photos", "thumb");

const DISPLAY_MAX_EDGE = 2048;
const THUMB_MAX_EDGE = 800;
const BLUR_MAX_EDGE = 16;
const JPEG_OPTIONS = { quality: 80, mozjpeg: true };

// The only metadata that ships with a published file. Everything else in the
// source (GPS, camera and lens serials, MakerNotes, XMP) is dropped.
const PUBLIC_EXIF = {
  IFD0: {
    Artist: "Mihail Kovashki",
    // EXIF text is ASCII; libvips would transliterate "©" to "(C)" anyway.
    Copyright: "(C) Mihail Kovashki. All rights reserved.",
  },
};

// Filenames carry a content hash: /photos/* is served immutable for a year, so an
// edited photo must get a new URL rather than overwrite the old one.
function contentHash(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex").slice(0, 8);
}

function isVariantOf(fileName, id) {
  if (fileName === `${id}.jpg`) return true; // pre-hash naming
  return fileName.startsWith(`${id}.`) && /^\.[0-9a-f]{8}\.jpg$/.test(fileName.slice(id.length));
}

function removeStaleVariants(dir, id, keep) {
  for (const fileName of fs.readdirSync(dir)) {
    if (fileName !== keep && isVariantOf(fileName, id)) {
      fs.unlinkSync(path.join(dir, fileName));
    }
  }
}

// .rotate() with no argument applies the EXIF Orientation to the pixels, so the
// output is upright without needing the flag that stripping removes.
async function renderVariant(inputPath, maxEdge, dir, id) {
  const { data, info } = await sharp(inputPath)
    .rotate()
    .resize({ width: maxEdge, height: maxEdge, fit: "inside", withoutEnlargement: true })
    .withExif(PUBLIC_EXIF)
    .jpeg(JPEG_OPTIONS)
    .toBuffer({ resolveWithObject: true });

  const fileName = `${id}.${contentHash(data)}.jpg`;
  fs.writeFileSync(path.join(dir, fileName), data);
  return { fileName, width: info.width, height: info.height };
}

async function renderBlurDataUrl(inputPath) {
  const data = await sharp(inputPath)
    .rotate()
    .resize({ width: BLUR_MAX_EDGE, height: BLUR_MAX_EDGE, fit: "inside" })
    .jpeg({ quality: 50 })
    .toBuffer();
  return `data:image/jpeg;base64,${data.toString("base64")}`;
}

/** Deletes every rendered variant of a photo, for photos leaving the library. */
export function removePhotoImages(id) {
  for (const dir of [DISPLAY_DIR, THUMB_DIR]) {
    if (fs.existsSync(dir)) removeStaleVariants(dir, id, null);
  }
}

/**
 * Renders the display image, thumbnail and blur placeholder for one photo, removes
 * any older variants of the same id, and returns the fields photos.ts stores.
 */
export async function renderPhotoImages(inputPath, id) {
  fs.mkdirSync(DISPLAY_DIR, { recursive: true });
  fs.mkdirSync(THUMB_DIR, { recursive: true });

  const display = await renderVariant(inputPath, DISPLAY_MAX_EDGE, DISPLAY_DIR, id);
  const thumb = await renderVariant(inputPath, THUMB_MAX_EDGE, THUMB_DIR, id);
  const blurDataUrl = await renderBlurDataUrl(inputPath);

  removeStaleVariants(DISPLAY_DIR, id, display.fileName);
  removeStaleVariants(THUMB_DIR, id, thumb.fileName);

  return {
    displayUrl: `/photos/display/${display.fileName}`,
    thumbUrl: `/photos/thumb/${thumb.fileName}`,
    width: display.width,
    height: display.height,
    aspectRatio: Math.round((display.width / display.height) * 1000) / 1000,
    blurDataUrl,
  };
}
