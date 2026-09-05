/**
 * FAQ content. Kept in one place because the same questions and answers are
 * mirrored as FAQPage structured data in index.html — edit both together.
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
    q: "Does this remove the AI label on LinkedIn?",
    a: "LinkedIn shows its AI label when it reads C2PA content credentials in the file you upload. Cleaning the image before you upload removes the data the label is generated from. It does not change a label on a post that is already published — delete that post and upload the clean copy instead.",
  },
  {
    q: "Does it remove the AI tag on Instagram or Facebook?",
    a: "Meta reads the same C2PA signals plus its own classifiers. Removing the credentials removes the metadata signal, so the automatic “AI info” tag is far less likely to appear. Visual detection is separate and no metadata tool can affect it.",
  },
  {
    q: "What is C2PA and JUMBF?",
    a: "C2PA is the Coalition for Content Provenance and Authenticity specification that defines the provenance record. JUMBF is the JPEG box format that record is stored in, usually inside an APP11 segment. Untrace scans for both and reports them before cleaning.",
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
    q: "Which formats are supported?",
    a: "JPEG, PNG, TIFF, HEIC and AVIF. The cleaned file is returned as JPEG, or as PNG when the original was a small PNG.",
  },
  {
    q: "Does it also remove EXIF and GPS data?",
    a: "Yes. EXIF, GPS, XMP, IPTC, Photoshop blocks, maker notes and embedded thumbnails all go at the same time as the content credentials, because the whole metadata section is dropped rather than edited.",
  },
];
