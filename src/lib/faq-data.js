/**
 * FAQ content, rendered on the page. Google no longer shows FAQ rich results
 * for sites like this one, so there is no FAQPage structured data to keep in
 * sync — the visible text is the single source.
 */
export const faqs = [
  {
    q: "What are content credentials on an image?",
    a: "Content credentials are a signed record of how an image was made and edited, written into the file by the C2PA standard. They can name the tool that generated the image, list every edit, and identify the account that created it. Platforms read that record to show an “AI info” or “Content credentials” label next to the picture.",
  },
  {
    q: "How do I remove content credentials from an image?",
    a: "Add the image to Untrace, review what it found, then choose Clean image and download the result. Untrace decodes the picture to raw pixels and writes a new file, so the C2PA manifest, the JUMBF container holding it, and every other metadata block are simply not carried over.",
  },
  {
    q: "Why would I remove content credentials?",
    a: "For privacy. Credentials can name the software you use, your account and the steps of your edit, and that record travels with the file to everyone who receives it. Removing it is the same kind of choice as removing GPS coordinates before you share a photo.",
  },
  {
    q: "Is it okay to remove them from AI-generated images?",
    a: "Removing metadata is legal and common, but do not use it to pass AI-generated work off as a real photograph where disclosure is expected or required. Many platforms, publishers, contests and some laws ask you to disclose AI use, and that duty does not depend on whether a file carries a tag.",
  },
  {
    q: "Will platforms still detect AI images after cleaning?",
    a: "Possibly. Untrace removes metadata only. Platforms also run visual classifiers, and some generators embed invisible watermarks in the pixels themselves. None of that is touched, and Untrace does not claim otherwise.",
  },
  {
    q: "What is C2PA and JUMBF?",
    a: "C2PA is the Coalition for Content Provenance and Authenticity specification that defines the provenance record. JUMBF is the JPEG box format that record is stored in, usually inside an APP11 segment. Untrace scans for both and reports them before cleaning.",
  },
  {
    q: "How do I know my image is not uploaded?",
    a: "Open your browser's developer tools, choose the Network tab and clean an image. No request carries the file. The code is open source under the MIT licence, so you can also read exactly what it does.",
  },
  {
    q: "Is my image uploaded anywhere?",
    a: "No. Reading the metadata and writing the clean file both happen in your browser using the File and Canvas APIs. Nothing is sent over the network, there is no account, and Untrace has no server to store an image on.",
  },
  {
    q: "Does cleaning reduce image quality?",
    a: "Small PNGs are rewritten as PNG with no quality loss. Everything else is re-encoded as JPEG at quality 0.92, which is visually indistinguishable at normal viewing sizes. The tool shows the size change so you can see exactly what happened.",
  },
  {
    q: "Can I clean several images at once?",
    a: "Yes. Choose or drop up to 50 images together. Untrace scans them all, shows what each one hides, cleans them one after another in your browser, and lets you download them individually or as one ZIP.",
  },
  {
    q: "Which formats are supported?",
    a: "JPEG, PNG, TIFF, HEIC and AVIF. The cleaned file is returned as JPEG, or as PNG when the original was a small PNG.",
  },
  {
    q: "Does it also remove EXIF and GPS data?",
    a: "Yes. EXIF, GPS, XMP, IPTC, Photoshop blocks, maker notes and embedded thumbnails all go at the same time as the content credentials, because the whole metadata section is dropped rather than edited.",
  },
];
