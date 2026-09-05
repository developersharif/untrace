/**
 * Metadata extraction.
 *
 * Reads a file twice: once through exifr for structured segments, once as raw
 * bytes to catch C2PA / JUMBF / AI provenance markers that exifr does not
 * surface. The two results are merged and bucketed into named sections.
 */

export const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/tiff",
  "image/heic",
  "image/avif",
];

export const ACCEPTED_EXTENSIONS = ".jpg,.jpeg,.png,.tiff,.tif,.heic,.avif";

/** Sections that describe the result rather than holding metadata values. */
const META_KEYS = ["fileType", "hasMetadata", "message"];

const GPS_FIELDS = [
  "latitude",
  "longitude",
  "GPSLatitude",
  "GPSLongitude",
  "GPSAltitude",
  "GPSSpeed",
  "GPSImgDirection",
  "GPSDestBearing",
  "GPSDateTime",
  "GPSLatitudeRef",
  "GPSLongitudeRef",
];

const CAMERA_FIELDS = [
  "Make",
  "Model",
  "Software",
  "DateTime",
  "DateTimeOriginal",
  "DateTimeDigitized",
  "ExposureTime",
  "FNumber",
  "ISO",
  "Flash",
  "FocalLength",
  "WhiteBalance",
  "LensModel",
  "LensMake",
  "Artist",
  "Copyright",
];

const TECHNICAL_FIELDS = [
  "ColorSpace",
  "Orientation",
  "ResolutionUnit",
  "XResolution",
  "YResolution",
  "ExifVersion",
  "ComponentsConfiguration",
  "ImageWidth",
  "ImageHeight",
];

const C2PA_KEY_HINTS = [
  "c2pa",
  "cai",
  "provenance",
  "manifest",
  "signature",
  "claim",
  "assertion",
  "chatgpt",
  "openai",
  "ai_generated",
  "dall",
  "midjourney",
  "stable",
  "generated",
];

const C2PA_SIGNATURES = [
  "c2pa.manifest",
  "c2pa.signature",
  "c2pa.assertions",
  "contentauthenticity.org",
  "adobe.com/cai",
  "CASS",
  "c2pa.created",
  "c2pa.converted",
];

const AI_SIGNATURES = [
  "ChatGPT",
  "OpenAI API",
  "DALL-E",
  "dall-e-",
  "Midjourney",
  "Stable Diffusion",
  "AI-generated",
  "trainedAlgorithmicMedia",
  "digitalSourceType",
  "GPT-4",
  "generated",
  "synthesized",
];

const JUMBF_SIGNATURES = ["jumb", "JUMB", "jumd", "JUMD"];

const METADATA_MARKERS = [
  "EXIF\x00",
  "IPTC",
  "XMP\x00",
  "ICC_PROFILE",
  "Photoshop 3.0",
  "Adobe_CM",
  "GPS\x00",
];

const AI_VALUE_KEYWORDS = [
  "chatgpt",
  "openai",
  "dall-e",
  "dalle",
  "midjourney",
  "stable diffusion",
  "artificial intelligence",
  "ai-generated",
  "machine learning",
  "neural network",
  "synthesized",
  "gpt-4",
  "trainedalgorithmicmedia",
  "adobe firefly",
  "google imagen",
  "anthropic claude",
  "runway ml",
  "artbreeder",
  "deepdream",
  "nightcafe",
  "starryai",
  "jasper art",
  "canva ai",
  "remove.bg",
  "upscayl",
  "real-esrgan",
  "waifu2x",
  "topaz gigapixel",
  "c2pa",
  "content credentials",
  "provenance",
  "content authenticity",
  "jumbf",
  "cai",
  "project origin",
];

export function isAccepted(file) {
  return Boolean(file) && ACCEPTED_TYPES.includes(file.type);
}

function pick(source, fields) {
  const out = {};
  for (const field of fields) {
    if (source[field] !== undefined) out[field] = source[field];
  }
  return out;
}

function assign(target, section, values) {
  if (Object.keys(values).length > 0) target[section] = values;
}

export async function extractMetadata(file) {
  try {
    const { parse } = await import("exifr");

    const exifData = await parse(file, {
      tiff: true,
      exif: true,
      gps: true,
      interop: true,
      iop: true,
      makerNote: true,
      userComment: true,
      xmp: true,
      iptc: true,
      icc: true,
      ihdr: true,
      jfif: true,
      chunked: true,
      firstChunkSize: 131072,
      chunkSize: 65536,
      multiSegment: true,
      silentErrors: false,
      segments: [
        "APP0",
        "APP1",
        "APP2",
        "APP3",
        "APP4",
        "APP5",
        "APP6",
        "APP7",
        "APP8",
        "APP9",
        "APP10",
        "APP11",
        "APP12",
        "APP13",
        "APP14",
        "APP15",
      ],
      mergeOutput: true,
      translateKeys: true,
      translateValues: true,
      reviveValues: true,
      sanitize: false,
      pick: [],
      skip: [],
    });

    const buffer = await file.arrayBuffer();
    const rawMetadata = await extractRawMetadata(
      new Uint8Array(buffer),
      file.type
    );

    let allMetadata = { ...(exifData || {}), ...rawMetadata };

    if (file.type.includes("png") && Object.keys(allMetadata).length === 0) {
      try {
        const pngMetadata = await parse(file, {
          ihdr: true,
          itxt: true,
          text: true,
          ztxt: true,
          time: true,
          phys: true,
          splt: true,
          hist: true,
          chrm: true,
          gama: true,
          iccp: true,
          sbit: true,
          srgb: true,
          bkgd: true,
          trns: true,
          mergeOutput: false,
          translateKeys: false,
          sanitize: false,
        });
        if (pngMetadata && Object.keys(pngMetadata).length > 0) {
          allMetadata = { ...allMetadata, ...pngMetadata };
        }
      } catch {
        /* PNG-specific parsing is best effort */
      }
    }

    if (Object.keys(allMetadata).length === 0) {
      return cleanResult(file);
    }

    return categorise(allMetadata, rawMetadata);
  } catch (error) {
    return cleanResult(file, error);
  }
}

function cleanResult(file, error) {
  const isPng = file.type.includes("png");
  const isJpeg = file.type.includes("jpeg") || file.type.includes("jpg");
  let message;

  if (isPng) {
    message = "PNG files rarely carry EXIF metadata.";
  } else if (
    error &&
    (error.message?.includes("not supported") ||
      error.message?.includes("invalid"))
  ) {
    message = "No EXIF data found in this image.";
  } else {
    message = "No metadata found. This image is already clean.";
  }

  return {
    fileType: isPng ? "png" : isJpeg ? "jpeg" : "other",
    hasMetadata: false,
    message,
  };
}

function categorise(allMetadata, rawMetadata) {
  const metadata = {};
  const keys = Object.keys(allMetadata);

  const c2paFields = keys.filter((key) =>
    C2PA_KEY_HINTS.some((hint) => key.toLowerCase().includes(hint))
  );
  assign(metadata, "C2PA/AI Provenance", pick(allMetadata, c2paFields));

  if (
    rawMetadata.C2PA_FOUND ||
    rawMetadata.AI_SIGNATURES ||
    rawMetadata.JUMBF_BOXES
  ) {
    const bucket = metadata["C2PA/AI Provenance"] || {};
    for (const key of [
      "TOTAL_SIGNATURES",
      "C2PA_FOUND",
      "AI_SIGNATURES",
      "JUMBF_BOXES",
    ]) {
      if (rawMetadata[key] && bucket[key] === undefined) {
        bucket[key] = rawMetadata[key];
      }
    }
    metadata["C2PA/AI Provenance"] = bucket;
  }

  assign(metadata, "GPS", pick(allMetadata, GPS_FIELDS));
  assign(metadata, "Camera", pick(allMetadata, CAMERA_FIELDS));
  assign(metadata, "Technical", pick(allMetadata, TECHNICAL_FIELDS));

  const xmpFields = keys.filter(
    (key) =>
      key.toLowerCase().includes("xmp") ||
      key.includes("Creator") ||
      key.includes("Subject")
  );
  assign(metadata, "XMP", pick(allMetadata, xmpFields));

  const iptcFields = keys.filter(
    (key) =>
      key.toLowerCase().includes("iptc") ||
      key.includes("Keywords") ||
      key.includes("Caption")
  );
  assign(metadata, "IPTC", pick(allMetadata, iptcFields));

  const pngFields = keys.filter((key) =>
    [
      "text",
      "itxt",
      "ztxt",
      "time",
      "phys",
      "hist",
      "chrm",
      "gama",
      "srgb",
      "iccp",
    ].some((hint) => key.toLowerCase().includes(hint))
  );
  assign(metadata, "PNG Chunks", pick(allMetadata, pngFields));

  const colorProfileFields = keys.filter(
    (key) =>
      key.includes("Profile") ||
      key.includes("ColorSpace") ||
      key.includes("WhitePoint") ||
      key.includes("PrimaryChromaticities") ||
      key.includes("ICC")
  );
  assign(metadata, "Color Profile", pick(allMetadata, colorProfileFields));

  const otherFields = keys.filter(
    (key) =>
      !GPS_FIELDS.includes(key) &&
      !CAMERA_FIELDS.includes(key) &&
      !TECHNICAL_FIELDS.includes(key) &&
      !xmpFields.includes(key) &&
      !iptcFields.includes(key) &&
      !pngFields.includes(key) &&
      !c2paFields.includes(key) &&
      !colorProfileFields.includes(key) &&
      (key.includes("User") ||
        key.includes("Comment") ||
        key.includes("Description") ||
        key.includes("AI") ||
        key.includes("Generated") ||
        key.includes("Thumbnail") ||
        key.includes("Preview"))
  );
  assign(metadata, "Other", pick(allMetadata, otherFields));

  if (rawMetadata.TOTAL_SIGNATURES > 0 || rawMetadata.METADATA_MARKERS > 0) {
    metadata["Raw Analysis"] = {
      "Total signatures found": rawMetadata.TOTAL_SIGNATURES || 0,
      "Metadata markers": rawMetadata.METADATA_MARKERS || 0,
      "File contains binary metadata": true,
    };
  }

  return metadata;
}

/**
 * Scans the first megabyte of the file for known provenance signatures.
 * exifr cannot see JUMBF boxes or bare C2PA strings, so this fills the gap.
 */
export async function extractRawMetadata(uint8Array, fileType) {
  const rawMetadata = { TOTAL_SIGNATURES: 0, METADATA_MARKERS: 0 };

  const textDecoder = new TextDecoder("utf-8", {
    ignoreBOM: true,
    fatal: false,
  });
  const chunkSize = 1024;
  const limit = Math.min(uint8Array.length, 1024 * 1024);
  let textContent = "";

  for (let i = 0; i < limit; i += chunkSize) {
    const chunk = uint8Array.slice(i, Math.min(i + chunkSize, limit));
    try {
      textContent += textDecoder.decode(chunk, { stream: true });
    } catch {
      /* undecodable chunk — skip it */
    }
  }

  const lowerContent = textContent.toLowerCase();

  const c2paFound = C2PA_SIGNATURES.filter(
    (sig) =>
      textContent.includes(sig) || lowerContent.includes(sig.toLowerCase())
  );
  if (c2paFound.length > 0) {
    rawMetadata.C2PA_FOUND = c2paFound;
    rawMetadata.TOTAL_SIGNATURES += c2paFound.length;
  }

  // A bare substring match produces false positives on short signatures, so
  // anything four characters or shorter has to sit on a real boundary.
  const aiFound = AI_SIGNATURES.filter((sig) => {
    const lower = sig.toLowerCase();
    if (!lowerContent.includes(lower)) return false;
    return (
      sig.length > 4 ||
      lowerContent.includes(lower + " ") ||
      lowerContent.includes(" " + lower) ||
      lowerContent.includes(lower + ":") ||
      lowerContent.includes(lower + "=") ||
      lowerContent.includes('"' + lower + '"')
    );
  });
  if (aiFound.length > 0) {
    rawMetadata.AI_SIGNATURES = aiFound;
    rawMetadata.TOTAL_SIGNATURES += aiFound.length;
  }

  const jumbfFound = JUMBF_SIGNATURES.filter((sig) =>
    lowerContent.includes(sig.toLowerCase())
  );
  if (jumbfFound.length > 0) {
    rawMetadata.JUMBF_BOXES = jumbfFound;
    rawMetadata.TOTAL_SIGNATURES += jumbfFound.length;
  }

  for (const marker of METADATA_MARKERS) {
    if (textContent.includes(marker)) rawMetadata.METADATA_MARKERS++;
  }

  if (fileType.includes("jpeg") || fileType.includes("jpg")) {
    const segments = findC2paSegments(uint8Array, textContent);
    if (segments.length > 0) {
      rawMetadata.JUMBF_BOXES = [
        ...(rawMetadata.JUMBF_BOXES || []),
        ...segments,
      ];
      rawMetadata.TOTAL_SIGNATURES++;
    }
  }

  return rawMetadata;
}

/** APP11 always signals JUMBF; APP2 only counts when C2PA strings sit inside it. */
function findC2paSegments(uint8Array, textContent) {
  const found = [];
  let foundApp2 = false;

  for (let i = 0; i < uint8Array.length - 10; i++) {
    if (uint8Array[i] !== 0xff) continue;

    if (uint8Array[i + 1] === 0xeb) {
      found.push("APP11_segment");
      break;
    }

    if (uint8Array[i + 1] === 0xe2 && !foundApp2) {
      const segment = textContent.slice(i, i + 100).toLowerCase();
      if (
        segment.includes("c2pa") ||
        segment.includes("cai") ||
        segment.includes("jumb")
      ) {
        foundApp2 = true;
      }
    }
  }

  if (foundApp2) found.push("APP2_segment");
  return found;
}

/* -------------------------------------------------------------------------
   Presentation helpers
   ------------------------------------------------------------------------- */

export function isClean(metadata) {
  if (!metadata) return true;
  if (metadata.message && !metadata.hasMetadata) return true;
  return sections(metadata).length === 0;
}

export function sections(metadata) {
  if (!metadata) return [];
  return Object.entries(metadata).filter(
    ([name, values]) =>
      !META_KEYS.includes(name) && typeof values === "object" && values !== null
  );
}

export function countEntries(metadata) {
  return sections(metadata).reduce(
    (total, [, values]) => total + Object.keys(values).length,
    0
  );
}

export function hasAiCredentials(metadata) {
  if (!metadata) return false;

  const provenance = metadata["C2PA/AI Provenance"];
  if (provenance) {
    if (provenance.AI_SIGNATURES?.length > 0) return true;
    if (provenance.C2PA_FOUND?.length > 0) return true;
    if (provenance.TOTAL_SIGNATURES > 1) return true;

    const realJumbf = (provenance.JUMBF_BOXES || []).filter(
      (box) => !box.includes("APP2_segment")
    );
    if (realJumbf.length > 0) return true;
  }

  return sections(metadata).some(
    ([name, values]) =>
      name !== "Raw Analysis" &&
      name !== "C2PA/AI Provenance" &&
      Object.values(values).some((value) => {
        const text = String(value).toLowerCase();
        return AI_VALUE_KEYWORDS.some((keyword) => text.includes(keyword));
      })
  );
}

/**
 * Turns the raw sections into the findings list the review step renders.
 * `severity` drives the status dot; every finding also carries text, so
 * colour is never the only signal.
 */
export function findings(metadata) {
  if (!metadata) return [];

  const list = [];
  const push = (severity, label, detail) =>
    list.push({ severity, label, detail });

  if (hasAiCredentials(metadata)) {
    const provenance = metadata["C2PA/AI Provenance"] || {};
    const tools = provenance.AI_SIGNATURES || [];
    push(
      "err",
      "AI content credentials",
      tools.length > 0
        ? tools.join(", ")
        : "C2PA provenance markers detected in the file"
    );
  }

  if (metadata.GPS) {
    push(
      "err",
      "GPS location",
      `${Object.keys(metadata.GPS).length} coordinate fields`
    );
  }

  if (metadata.Camera) {
    push(
      "warn",
      "Camera and device",
      cameraName(metadata.Camera) || "Make, model and capture settings"
    );
  }

  if (metadata.Camera?.DateTimeOriginal || metadata.Camera?.DateTime) {
    push("warn", "Capture timestamp", "When the photo was taken");
  }

  if (metadata.XMP) {
    push("warn", "XMP", `${Object.keys(metadata.XMP).length} fields`);
  }

  if (metadata.IPTC) {
    push("warn", "IPTC", `${Object.keys(metadata.IPTC).length} fields`);
  }

  if (metadata["PNG Chunks"]) {
    push(
      "warn",
      "PNG text chunks",
      `${Object.keys(metadata["PNG Chunks"]).length} chunks`
    );
  }

  if (metadata.Other && Object.keys(metadata.Other).length > 0) {
    push("warn", "Comments and thumbnails", `${Object.keys(metadata.Other).length} fields`);
  }

  if (metadata.Technical) {
    push("info", "Technical", "Dimensions, orientation and colour space");
  }

  if (metadata["Color Profile"]) {
    push("info", "Colour profile", "ICC data — not privacy sensitive");
  }

  return list;
}

/** Most cameras repeat the make inside the model ("Canon" + "Canon EOS R5"). */
function cameraName({ Make, Model }) {
  const make = String(Make || "").trim();
  const model = String(Model || "").trim();
  if (make && model) {
    return model.toLowerCase().startsWith(make.toLowerCase())
      ? model
      : `${make} ${model}`;
  }
  return model || make;
}

/** Plain-text dump for the expandable raw view. */
export function formatMetadata(metadata) {
  if (!metadata || Object.keys(metadata).length === 0) return "No metadata found";
  if (metadata.message && !metadata.hasMetadata) return metadata.message;

  return sections(metadata)
    .map(([name, values]) => {
      const lines = Object.entries(values).map(([key, value]) => {
        let display;
        if (Array.isArray(value)) {
          display = `[${value.join(", ")}]`;
        } else if (typeof value === "string" && value.length > 100) {
          display = value.slice(0, 100) + "…";
        } else {
          display = value;
        }
        return `  ${key}: ${display}`;
      });
      return `[${name}]\n${lines.join("\n")}`;
    })
    .join("\n\n");
}
