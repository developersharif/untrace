# Untrace

**Remove content credentials from an image.**

Untrace strips C2PA content credentials, AI generation tags, GPS coordinates
and EXIF metadata from a photo. It runs entirely in the browser — the file is
read and rewritten in the tab, never uploaded.

<https://untrace.realbrain.cc/>

## What it removes

| | |
|---|---|
| C2PA content credentials | Manifests, claims, assertions and signatures from the Content Authenticity Initiative |
| AI generation tags | ChatGPT, DALL·E, Midjourney, Stable Diffusion, Adobe Firefly, Google Imagen |
| JUMBF containers | The APP11 and APP2 boxes that carry provenance inside a JPEG |
| GPS location | Latitude, longitude, altitude, bearing and their timestamp |
| Camera and device | Make, model, lens, serial numbers, exposure and shooting settings |
| Timestamps | When the photo was taken, digitised and last modified |
| XMP and IPTC | Creator names, captions, keywords, copyright, editing history |
| Comments and thumbnails | User comments, maker notes, embedded previews |
| PNG text chunks | tEXt, iTXt and zTXt blocks, including generation prompts |

Supported input: JPEG, PNG, TIFF, HEIC, AVIF. Output is JPEG, or PNG when the
original was a small PNG.

## How it works

Detection and removal are two separate passes.

**Detection** (`src/lib/metadata.js`) reads the file twice: once through
[exifr](https://github.com/MikeKovarik/exifr) for structured segments, and once
as raw bytes to find C2PA strings and JUMBF boxes that exifr does not surface.
The results are merged and bucketed into named sections, then turned into the
findings list the review step renders.

**Removal** (`src/lib/clean.js`) decodes the image to pixels on a canvas and
re-encodes it. Nothing carries over, so every metadata container is dropped at
once rather than deleting known tags one by one and leaving the rest behind.
The output is then re-read to confirm it is clean; if anything survived, a
second pass forces JPEG on a white matte.

If the browser cannot decode or re-encode the file, the original bytes are
returned and the interface says so — it never reports a clean that did not
happen.

## Design

The interface follows the
[RealBrain Design System](https://realbrain.cc/design-system/) v2.0. Tokens are
vendored at `src/tokens.css`; refresh with:

```bash
curl -o src/tokens.css https://realbrain.cc/design-system/tokens.css
```

`AGENTS.md` carries the rules, the self-check commands, and this repository's
open token proposals. Read it before touching any CSS.

## Development

```bash
npm install
npm run dev      # vite dev server
npm run build    # production build to dist/
npm run preview  # serve the build
```

Stack: Svelte 4, Vite 5, exifr. No CSS framework — the design system is plain
CSS.

## Who it is for

Journalists protecting sources, activists maintaining anonymity, photographers
selling stock, and anyone who would rather a photo not carry its own history.

## License

MIT.
