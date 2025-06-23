<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let disabled = false;

  let dragOver = false;
  let fileInput;

  const acceptedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/tiff",
    "image/heic",
    "image/avif",
  ];

  function handleDragOver(event) {
    event.preventDefault();
    if (!disabled) {
      dragOver = true;
    }
  }

  function handleDragLeave(event) {
    event.preventDefault();
    dragOver = false;
  }

  function handleDrop(event) {
    event.preventDefault();
    dragOver = false;

    if (disabled) return;

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  }

  function handleFileInput(event) {
    if (disabled) return;

    const files = event.target.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  }

  async function processFile(file) {
    if (!acceptedTypes.includes(file.type)) {
      alert(
        "Please select a supported image file (JPEG, PNG, TIFF, HEIC, or AVIF)."
      );
      return;
    }

    try {
      const metadata = await extractMetadata(file);
      dispatch("fileSelected", { file, metadata });
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Error processing the file. Please try again.");
    }
  }

  async function extractMetadata(file) {
    try {
      const { parse } = await import("exifr");

      if (
        !file.type.includes("jpeg") &&
        !file.type.includes("jpg") &&
        !file.type.includes("tiff") &&
        !file.type.includes("png") &&
        !file.type.includes("heic") &&
        !file.type.includes("avif")
      ) {
        console.log("File type doesn't typically contain EXIF data");
        return {
          fileType: "other",
          hasMetadata: false,
          message: "This file type typically doesn't contain EXIF metadata",
        };
      }

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

      let allMetadata = exifData || {};
      let rawMetadata = {};

      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      rawMetadata = await extractRawMetadata(uint8Array, file.type);

      allMetadata = { ...allMetadata, ...rawMetadata };

      if (
        file.type.includes("png") &&
        (!allMetadata || Object.keys(allMetadata).length === 0)
      ) {
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
        } catch (pngError) {
          console.log("PNG-specific parsing failed:", pngError);
        }
      }

      if (!allMetadata || Object.keys(allMetadata).length === 0) {
        return {
          fileType: file.type.includes("png") ? "png" : "jpeg",
          hasMetadata: false,
          message: file.type.includes("png")
            ? "PNG files typically don't contain EXIF metadata"
            : "No EXIF data found in this image - image appears to be clean",
        };
      }

      // Organize the metadata into categories
      const metadata = {};

      // C2PA/AI Provenance data (priority category)
      const c2paFields = Object.keys(allMetadata).filter(
        (key) =>
          key.toLowerCase().includes("c2pa") ||
          key.toLowerCase().includes("cai") ||
          key.toLowerCase().includes("provenance") ||
          key.toLowerCase().includes("manifest") ||
          key.toLowerCase().includes("signature") ||
          key.toLowerCase().includes("claim") ||
          key.toLowerCase().includes("assertion") ||
          key.toLowerCase().includes("chatgpt") ||
          key.toLowerCase().includes("openai") ||
          key.toLowerCase().includes("ai_generated") ||
          key.toLowerCase().includes("dall") ||
          key.toLowerCase().includes("midjourney") ||
          key.toLowerCase().includes("stable") ||
          key.toLowerCase().includes("generated")
      );

      if (c2paFields.length > 0) {
        const c2paData = {};
        for (const field of c2paFields) {
          c2paData[field] = allMetadata[field];
        }
        metadata["C2PA/AI Provenance"] = c2paData;
      }

      if (
        rawMetadata.C2PA_FOUND ||
        rawMetadata.AI_SIGNATURES ||
        rawMetadata.JUMBF_BOXES
      ) {
        if (!metadata["C2PA/AI Provenance"]) {
          metadata["C2PA/AI Provenance"] = {};
        }

        // Only add if not already present to avoid duplicates
        if (
          rawMetadata.TOTAL_SIGNATURES &&
          !metadata["C2PA/AI Provenance"]["TOTAL_SIGNATURES"]
        ) {
          metadata["C2PA/AI Provenance"]["TOTAL_SIGNATURES"] =
            rawMetadata.TOTAL_SIGNATURES;
        }
        if (
          rawMetadata.C2PA_FOUND &&
          !metadata["C2PA/AI Provenance"]["C2PA_FOUND"]
        ) {
          metadata["C2PA/AI Provenance"]["C2PA_FOUND"] = rawMetadata.C2PA_FOUND;
        }
        if (
          rawMetadata.AI_SIGNATURES &&
          !metadata["C2PA/AI Provenance"]["AI_SIGNATURES"]
        ) {
          metadata["C2PA/AI Provenance"]["AI_SIGNATURES"] =
            rawMetadata.AI_SIGNATURES;
        }
        if (
          rawMetadata.JUMBF_BOXES &&
          !metadata["C2PA/AI Provenance"]["JUMBF_BOXES"]
        ) {
          metadata["C2PA/AI Provenance"]["JUMBF_BOXES"] =
            rawMetadata.JUMBF_BOXES;
        }
      }

      const gpsFields = [
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
      const gpsData = {};
      for (const field of gpsFields) {
        if (allMetadata[field] !== undefined) {
          gpsData[field] = allMetadata[field];
        }
      }
      if (Object.keys(gpsData).length > 0) {
        metadata.GPS = gpsData;
      }

      // Camera/EXIF data
      const cameraFields = [
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
      const cameraData = {};
      for (const field of cameraFields) {
        if (allMetadata[field] !== undefined) {
          cameraData[field] = allMetadata[field];
        }
      }
      if (Object.keys(cameraData).length > 0) {
        metadata.Camera = cameraData;
      }

      const technicalFields = [
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
      const technicalData = {};
      for (const field of technicalFields) {
        if (allMetadata[field] !== undefined) {
          technicalData[field] = allMetadata[field];
        }
      }
      if (Object.keys(technicalData).length > 0) {
        metadata.Technical = technicalData;
      }

      // XMP data (often contains AI/software info)
      const xmpFields = Object.keys(allMetadata).filter(
        (key) =>
          key.toLowerCase().includes("xmp") ||
          key.includes("Creator") ||
          key.includes("Subject")
      );
      if (xmpFields.length > 0) {
        const xmpData = {};
        for (const field of xmpFields) {
          xmpData[field] = allMetadata[field];
        }
        metadata.XMP = xmpData;
      }

      // IPTC data
      const iptcFields = Object.keys(allMetadata).filter(
        (key) =>
          key.toLowerCase().includes("iptc") ||
          key.includes("Keywords") ||
          key.includes("Caption")
      );
      if (iptcFields.length > 0) {
        const iptcData = {};
        for (const field of iptcFields) {
          iptcData[field] = allMetadata[field];
        }
        metadata.IPTC = iptcData;
      }

      // PNG-specific chunks
      const pngFields = Object.keys(allMetadata).filter(
        (key) =>
          key.toLowerCase().includes("text") ||
          key.toLowerCase().includes("itxt") ||
          key.toLowerCase().includes("ztxt") ||
          key.toLowerCase().includes("time") ||
          key.toLowerCase().includes("phys") ||
          key.toLowerCase().includes("hist") ||
          key.toLowerCase().includes("chrm") ||
          key.toLowerCase().includes("gama") ||
          key.toLowerCase().includes("srgb") ||
          key.toLowerCase().includes("iccp")
      );
      if (pngFields.length > 0) {
        const pngData = {};
        for (const field of pngFields) {
          pngData[field] = allMetadata[field];
        }
        metadata["PNG Chunks"] = pngData;
      }

      // Color Profile data (ICC profiles - not privacy concerning)
      const colorProfileFields = Object.keys(allMetadata).filter(
        (key) =>
          key.includes("Profile") ||
          key.includes("ColorSpace") ||
          key.includes("WhitePoint") ||
          key.includes("PrimaryChromaticities") ||
          key.includes("ICC")
      );
      if (colorProfileFields.length > 0) {
        const profileData = {};
        for (const field of colorProfileFields) {
          profileData[field] = allMetadata[field];
        }
        metadata["Color Profile"] = profileData;
      }

      // Other interesting fields that might contain privacy-sensitive data
      const otherPrivacyFields = Object.keys(allMetadata).filter(
        (key) =>
          !gpsFields.includes(key) &&
          !cameraFields.includes(key) &&
          !technicalFields.includes(key) &&
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

      if (otherPrivacyFields.length > 0) {
        const otherData = {};
        for (const field of otherPrivacyFields) {
          otherData[field] = allMetadata[field];
        }
        metadata.Other = otherData;
      }

      // Add raw metadata summary
      if (
        rawMetadata.TOTAL_SIGNATURES > 0 ||
        rawMetadata.METADATA_MARKERS > 0
      ) {
        metadata["Raw Analysis"] = {
          "Total Signatures Found": rawMetadata.TOTAL_SIGNATURES || 0,
          "Metadata Markers": rawMetadata.METADATA_MARKERS || 0,
          "File Contains Binary Metadata": true,
        };
      }

      console.log("Extracted metadata with exifr:", metadata);
      console.log("Raw exifr data:", allMetadata);
      console.log("Raw binary analysis:", rawMetadata);

      return metadata;
    } catch (error) {
      console.log("Error extracting metadata:", error.message);
      return {
        fileType:
          file.type.includes("jpeg") || file.type.includes("jpg")
            ? "jpeg"
            : file.type.includes("png")
              ? "png"
              : "other",
        hasMetadata: false,
        message: file.type.includes("png")
          ? "PNG files typically don't contain EXIF metadata"
          : error.message.includes("not supported") ||
              error.message.includes("invalid")
            ? "No EXIF data found in this image"
            : "Image appears to be clean (no metadata found)",
      };
    }
  }

  // Function to extract raw metadata by scanning binary data for known signatures
  async function extractRawMetadata(uint8Array, fileType) {
    const rawMetadata = {
      TOTAL_SIGNATURES: 0,
      METADATA_MARKERS: 0,
    };

    // Convert to string for text-based searching
    const textDecoder = new TextDecoder("utf-8", {
      ignoreBOM: true,
      fatal: false,
    });
    let textContent = "";

    // Sample the file in chunks to avoid memory issues with large files
    const chunkSize = 1024;
    for (
      let i = 0;
      i < Math.min(uint8Array.length, 1024 * 1024);
      i += chunkSize
    ) {
      const chunk = uint8Array.slice(
        i,
        Math.min(i + chunkSize, uint8Array.length)
      );
      try {
        textContent += textDecoder.decode(chunk, { stream: true });
      } catch (e) {
        // Skip chunks that can't be decoded as text
      }
    }

    // C2PA/CAI signatures - more specific patterns
    const c2paSignatures = [
      "c2pa.manifest",
      "c2pa.signature",
      "c2pa.assertions",
      "contentauthenticity.org",
      "adobe.com/cai",
      "CASS",
      "c2pa.created",
      "c2pa.converted",
    ];

    // AI generation signatures - specific and definitive patterns only
    const aiSignatures = [
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

    // JUMBF (JPEG Universal Metadata Box Format) signatures
    const jumbfSignatures = ["jumb", "JUMB", "jumd", "JUMD"];

    // Search for C2PA signatures with more precise matching
    let c2paFound = [];
    for (const sig of c2paSignatures) {
      // Use case-sensitive matching for specific patterns
      if (
        textContent.includes(sig) ||
        textContent.toLowerCase().includes(sig.toLowerCase())
      ) {
        c2paFound.push(sig);
        rawMetadata.TOTAL_SIGNATURES++;
      }
    }
    if (c2paFound.length > 0) {
      rawMetadata.C2PA_FOUND = c2paFound;
    }

    // Search for AI signatures with exact matching
    let aiFound = [];
    for (const sig of aiSignatures) {
      // Use more precise matching to avoid false positives
      if (
        textContent.includes(sig) ||
        textContent.toLowerCase().includes(sig.toLowerCase())
      ) {
        // Additional validation: ensure it's not just a fragment
        const context = textContent.toLowerCase();
        const sigLower = sig.toLowerCase();

        // Only count if we find the signature in a meaningful context
        if (
          context.includes(sigLower) &&
          (sig.length > 4 || // Longer signatures are more reliable
            context.includes(sigLower + " ") || // Word boundary
            context.includes(" " + sigLower) || // Word boundary
            context.includes(sigLower + ":") || // Metadata format
            context.includes(sigLower + "=") || // Assignment format
            context.includes('"' + sigLower + '"')) // Quoted value
        ) {
          aiFound.push(sig);
          rawMetadata.TOTAL_SIGNATURES++;
        }
      }
    }
    if (aiFound.length > 0) {
      rawMetadata.AI_SIGNATURES = aiFound;
    }

    // Search for JUMBF boxes
    let jumbfFound = [];
    for (const sig of jumbfSignatures) {
      if (textContent.toLowerCase().includes(sig.toLowerCase())) {
        jumbfFound.push(sig);
        rawMetadata.TOTAL_SIGNATURES++;
      }
    }
    if (jumbfFound.length > 0) {
      rawMetadata.JUMBF_BOXES = jumbfFound;
    }

    // Look for common metadata markers - be more specific
    const metadataMarkers = [
      "EXIF\x00", // EXIF with null terminator
      "IPTC",
      "XMP\x00", // XMP with null terminator
      "ICC_PROFILE",
      "Photoshop 3.0",
      "Adobe_CM",
      "GPS\x00", // GPS with null terminator
    ];

    for (const marker of metadataMarkers) {
      if (textContent.includes(marker)) {
        rawMetadata.METADATA_MARKERS++;
      }
    }

    // For JPEG files, look for specific APP segments that might contain C2PA
    if (fileType.includes("jpeg") || fileType.includes("jpg")) {
      // Look for APP11 segment marker (often used for C2PA)
      const app11Marker = new Uint8Array([0xff, 0xeb]);
      // Look for APP2 segment marker (sometimes used for C2PA/CAI, but also ICC profiles)
      const app2Marker = new Uint8Array([0xff, 0xe2]);

      let foundApp11 = false,
        foundApp2WithC2PA = false;

      for (let i = 0; i < uint8Array.length - 10; i++) {
        if (
          uint8Array[i] === app11Marker[0] &&
          uint8Array[i + 1] === app11Marker[1]
        ) {
          foundApp11 = true;
          break;
        }
        if (
          uint8Array[i] === app2Marker[0] &&
          uint8Array[i + 1] === app2Marker[1]
        ) {
          // Check if this APP2 segment contains C2PA data (not just ICC profile)
          const segmentData = textContent.slice(i, i + 100).toLowerCase();
          if (
            segmentData.includes("c2pa") ||
            segmentData.includes("cai") ||
            segmentData.includes("jumb")
          ) {
            foundApp2WithC2PA = true;
          }
        }
      }

      if (foundApp11 || foundApp2WithC2PA) {
        if (!rawMetadata.JUMBF_BOXES) rawMetadata.JUMBF_BOXES = [];
        if (foundApp11) rawMetadata.JUMBF_BOXES.push("APP11_segment");
        if (foundApp2WithC2PA) rawMetadata.JUMBF_BOXES.push("APP2_segment");
        rawMetadata.TOTAL_SIGNATURES++;
      }
    }

    return rawMetadata;
  }

  function reset() {
    if (fileInput) {
      fileInput.value = "";
    }
    dispatch("reset");
  }
</script>

<div class="upload-section">
  <div
    class="upload-area"
    class:dragover={dragOver}
    class:disabled
    on:dragover={handleDragOver}
    on:dragleave={handleDragLeave}
    on:drop={handleDrop}
    role="button"
    tabindex="0"
    on:click={() => !disabled && fileInput.click()}
    on:keydown={(e) =>
      (e.key === "Enter" || e.key === " ") && !disabled && fileInput.click()}
  >
    <div class="upload-icon">
      <svg fill="none" stroke="currentColor" viewBox="0 0 48 48">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
        />
      </svg>
    </div>

    <h3 class="text-lg font-semibold mb-2">
      {dragOver ? "Drop your image here" : "Upload Image"}
    </h3>

    <p class="text-secondary mb-4">
      Drag and drop your image here, or click to browse
    </p>

    <p class="text-sm text-muted">
      Supports JPEG, PNG, TIFF, HEIC, and AVIF files
    </p>

    <input
      type="file"
      accept=".jpg,.jpeg,.png,.tiff,.tif,.heic,.avif"
      bind:this={fileInput}
      on:change={handleFileInput}
      class="hidden"
      {disabled}
    />
  </div>
</div>

<style>
  .upload-section {
    width: 100%;
  }

  .disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .disabled:hover {
    transform: none !important;
    border-color: var(--border-color) !important;
    background-color: var(--bg-secondary) !important;
  }
</style>
