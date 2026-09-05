/**
 * Metadata removal.
 *
 * Everything runs on a canvas in the browser: decoding the image to pixels and
 * re-encoding it drops every metadata container the original carried — EXIF,
 * XMP, IPTC, ICC, and the JUMBF boxes that hold C2PA content credentials.
 * Nothing is uploaded.
 */

const JPEG_QUALITY = 0.92;
/**
 * Matte painted under transparent pixels before a forced JPEG re-encode.
 * This is image data, not interface styling, so it is deliberately not a
 * design token — JPEG has no alpha channel and unpainted pixels come out black.
 */
const JPEG_MATTE = "#FFFFFF";
const SECOND_PASS_QUALITY = 0.95;
/** Below this pixel count a PNG stays a PNG; larger ones re-encode to JPEG. */
const PNG_PIXEL_LIMIT = 1000000;

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(source);
    const img = new Image();
    img.onload = () => resolve({ img, url });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("The browser could not decode this image."));
    };
    img.src = url;
  });
}

function redraw(img, { type, quality, fillWhite = false }) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // A white base stops transparent areas turning black when the second pass
    // forces JPEG, which has no alpha channel.
    if (fillWhite) {
      ctx.fillStyle = JPEG_MATTE;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(img, 0, 0);

    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error("The browser could not re-encode this image.")),
      type,
      quality
    );
  });
}

/** Re-reads the output to confirm nothing survived the re-encode. */
async function stillHasMetadata(blob) {
  try {
    const { parse } = await import("exifr");
    const remaining = await parse(blob, {
      tiff: true,
      exif: true,
      gps: true,
      xmp: true,
      iptc: true,
      icc: true,
      silentErrors: true,
    });
    return Boolean(remaining && Object.keys(remaining).length > 0);
  } catch {
    // exifr throwing here means it found nothing parseable, which is the
    // outcome we want.
    return false;
  }
}

function outputName(originalName, blobType) {
  const extension = originalName.split(".").pop();
  const base = originalName.replace(new RegExp(`\\.${extension}$`, "i"), "");

  let finalExtension = extension;
  if (blobType === "image/jpeg") finalExtension = "jpg";
  else if (blobType === "image/png") finalExtension = "png";

  return `${base}-cleaned.${finalExtension}`;
}

/**
 * @returns {Promise<{url, filename, size, originalSize, sizeDelta,
 *   wasSecondPass, fallback}>}
 *   `fallback: true` means the image could not be re-encoded and the original
 *   bytes are being returned untouched. The caller must not claim success.
 */
export async function cleanImage(file) {
  let objectUrl;

  try {
    const { img, url } = await loadImage(file);
    objectUrl = url;

    const keepPng =
      file.type === "image/png" && img.width * img.height < PNG_PIXEL_LIMIT;

    let blob = await redraw(img, {
      type: keepPng ? "image/png" : "image/jpeg",
      quality: keepPng ? undefined : JPEG_QUALITY,
    });
    let wasSecondPass = false;

    if (await stillHasMetadata(blob)) {
      const second = await loadImage(blob);
      try {
        blob = await redraw(second.img, {
          type: "image/jpeg",
          quality: SECOND_PASS_QUALITY,
          fillWhite: true,
        });
        wasSecondPass = true;
      } finally {
        URL.revokeObjectURL(second.url);
      }
    }

    return result(blob, file, { wasSecondPass, fallback: false });
  } catch (error) {
    console.error("Cleaning failed, returning the original file:", error);
    return result(file, file, { wasSecondPass: false, fallback: true });
  } finally {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }
}

function result(blob, originalFile, { wasSecondPass, fallback }) {
  return {
    url: URL.createObjectURL(blob),
    filename: outputName(originalFile.name, blob.type),
    size: blob.size,
    originalSize: originalFile.size,
    sizeDelta: originalFile.size
      ? ((blob.size - originalFile.size) / originalFile.size) * 100
      : 0,
    wasSecondPass,
    fallback,
  };
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
