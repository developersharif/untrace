# Untrace - Advanced EXIF Metadata & AI Content Credential Remover

**Remove all metadata from images. Keep your privacy.**

Clean your photos from location data, AI signatures, C2PA content credentials, and other tracking information. Works 100% in your browser - no uploads, no tracking.

## Features

**[•] Complete Privacy Protection**

- Removes GPS location data
- Strips camera information
- Cleans AI generation tags (ChatGPT, DALL-E, Midjourney, Stable Diffusion)
- Eliminates C2PA content credentials and provenance data
- Removes JUMBF metadata containers
- Clears Adobe Firefly and Google Imagen signatures
- Eliminates timestamps and device info

**[✓] Enhanced AI Content Credential Removal**

- Advanced detection of AI generation markers
- C2PA (Content Authenticity Initiative) signature removal
- DALL-E and OpenAI watermark stripping
- Midjourney metadata cleaning
- Stable Diffusion tag removal
- Adobe Content Authenticity removal
- JUMBF (JPEG Universal Metadata Box Format) cleaning

**[✓] Secure & Private**

- No server uploads - everything happens in your browser
- No tracking or data collection
- Supports JPEG, PNG, TIFF, HEIC, AVIF

**[↕] Easy to Use**

- Drag & drop interface
- Instant preview of what data will be removed
- One-click cleaning
- Mobile-friendly design

## Quick Start

1. **Upload** - Drag your image to the page
2. **Review** - See what metadata was found
3. **Clean** - Click "Remove Metadata"
4. **Download** - Save your privacy-safe image

## For Developers

```bash
npm install
npm run dev

npm run build
```

**Built with:** Svelte + Vite + exifr

## Why Use Untrace?

Modern images contain hidden data that can compromise your privacy:

- **Location data** reveals where photos were taken
- **AI signatures** show which tools generated images (DALL-E, Midjourney, ChatGPT, Stable Diffusion)
- **C2PA content credentials** track the entire creation and editing history
- **Device info** identifies your camera/phone
- **Timestamps** reveal when images were created
- **JUMBF containers** store complex metadata structures
- **Content Authenticity** markers link images to specific AI tools
- **Provenance data** creates a digital paper trail

Untrace removes all this data while keeping your images looking exactly the same.

## Supported AI Tools & Formats

**AI Generation Platforms:**

- OpenAI DALL-E & ChatGPT
- Midjourney
- Stable Diffusion
- Adobe Firefly
- Google Imagen
- Runway ML
- NightCafe
- Artbreeder

**Content Credential Standards:**

- C2PA (Content Provenance and Authenticity)
- Content Authenticity Initiative (CAI)
- JUMBF (JPEG Universal Metadata Box Format)
- Adobe Content Credentials
- Project Origin signatures

## License

MIT License - Free for personal and commercial use.
