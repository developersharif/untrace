# RealBrain Design System — instructions for coding agents

Copy this file into a RealBrain repository as `AGENTS.md` (or append it to `CLAUDE.md`). It tells an agent how to apply the design system without being reminded each time. Adjust the one path in "Source of truth" to wherever the repository vendors `tokens.css`.

## Source of truth

- In this repository: `src/tokens.css` — a vendored copy of https://realbrain.cc/design-system/tokens.css. Never edit it by hand; refresh it with `curl -o src/tokens.css https://realbrain.cc/design-system/tokens.css`.
- Full guide: https://realbrain.cc/design-system/design-system.md
- Short reference for agents: https://realbrain.cc/design-system/llms.txt
- Tokens as JSON (DTCG): https://realbrain.cc/design-system/tokens.json

Read the guide's §2 (non-negotiables) and §6 (components) before writing or editing any CSS, component, or UI copy.

## Rules

1. **Tokens only.** Every colour, size, radius, shadow, duration, and easing in component code is a `var(--token)` from `tokens.css`. No raw hex, no raw px, no `rgba()`.
2. **One accent per screen.** Exactly one `.btn-primary` (or one accent-coloured action). Everything else is `.btn-secondary`, `.btn-ghost`, or neutral text.
3. **Weight ≤ 600.** Never `font-weight: 700` or `bold`. The font import does not even load 700.
4. **Flat.** No `linear-gradient`, `radial-gradient`, `backdrop-filter`, `text-shadow`, glow, or decorative `box-shadow`. `--shadow-*` is only for surfaces that are actually elevated (menus, modals, toasts).
5. **Never white on accent.** Text and icons on `--accent` use `--accent-fg`.
6. **Semantic colour is never the only signal.** Use `.status.ok|warn|err|info` (dot plus text) or an icon plus text.
7. **Copy:** sentence case everywhere. Buttons are verbs ("Sign in", "Create project"). "Sign in", never "Log in" or "Login". Errors say what happened and what to do next.
8. **One density per product.** `.density-comfortable` (default, 44px controls) or `.density-compact` (32px) on a container. Never both.
9. **Use the existing component classes** (`.btn`, `.field`, `.input`, `.select`, `.checkbox`, `.radio`, `.toggle`, `.card`, `dialog.modal`, `.toast`, `.tabs`, `.table`, `.status`, `.scaffold`, `.empty`, `.skeleton`). Do not re-style them locally. Do not build a div-based fake of a native control.
10. **Motion goes through `--dur-1/2/3` and `--ease`.** Nothing else. Reduced motion is handled globally by `tokens.css`.

## When the system doesn't have what you need

Do not invent a value. Build the piece from existing tokens if you can. If you genuinely need a new token or component, ship the work with a clearly marked proposal in your final message:

```
⚑ NEW TOKEN  --{category}-{name}: {value}
   why nothing existing fits: …
```

Do the same for drift you notice in existing code (`⚑ DRIFT  file:line  #3b82f6 → --accent`) rather than silently patching it.

## Self-check before you finish

Run these from the repository root (adjust `src` and the excluded path). Every command should print nothing:

```sh
# raw colours or px outside the token file
grep -rnE --include=*.css --include=*.vue --include=*.jsx --include=*.tsx --include=*.svelte \
  --exclude=tokens.css '#[0-9a-fA-F]{3,8}\b|rgba?\(|\b[0-9]+px\b' src

# forbidden weight and effects
grep -rnE --include=*.css --include=*.vue --include=*.jsx --include=*.tsx --include=*.svelte \
  --exclude=tokens.css 'font-weight:\s*(700|800|900|bold)|linear-gradient|radial-gradient|backdrop-filter|text-shadow' src

# copy rules
grep -rniE --exclude-dir=node_modules 'log ?in|Sign In\b|Log In\b' src
```

Then check by eye: one `.btn-primary` per screen, focus rings visible when tabbing, and every status or badge has text next to its colour.

## Quick reference

<!-- BEGIN GENERATED: quickref -->
```
--bg              #080808   light: #F7F7F9
--surface         #121216   light: #FFFFFF
--elevated        #1A1A20   light: #FFFFFF
--text-1          #F4F4F6   light: #16161C
--text-2          #A9A9B4   light: #4C4C58
--text-3          #83838F   light: #6E6E7A
--accent          #8FA8FF   light: #3450C8
--accent-fg       #080808   light: #FFFFFF
--accent-hover    #9EB5FF   light: #4C6BD2
--accent-pressed  #6173B1   light: #21358A
--success         #3ECF8E   light: #177A4E
--warning         #E8B23D   light: #8A5A00
--error           #F26D6D   light: #C2373C
--info            #62B0F5   light: #1D62A8
--border          #26262E   light: #E3E3E9
--border-strong   #3A3A46   light: #C6C6D0
--font-ui        'IBM Plex Sans', system-ui, sans-serif
--font-mono      'IBM Plex Mono', ui-monospace, monospace
type steps       display:60/64  8:40/48  7:30/38  6:24/32  5:20/28  4:17/26  3:15/24  2:13/20  1:12/16
weights          400 · 500 · 600 (never 700)
space            4px 8px 12px 16px 24px 32px 48px 64px 96px
radius           sm 6px · md 10px · lg 16px · full 999px
motion           120ms · 200ms · 360ms · ease cubic-bezier(.22,.61,.36,1)
layout           marketing 1200px · app 1440px · control-h 44px (compact 32px)
```
<!-- END GENERATED: quickref -->

Light theme: `document.documentElement.setAttribute('data-theme', 'light')`. Dark: remove the attribute.

---

## Untrace specifics

Applied to this repository on 2026-09-05, design system v2.0.0.

- `src/tokens.css` is the vendored copy. `src/app.css` imports it and adds only
  app-level composition (layout, dropzone, stepper, disclosure, tiles, the
  mobile action bar). No component from `tokens.css` is restyled locally.
- Density is **comfortable** throughout — this is a consumer surface.
- Dark is the default. `src/lib/theme.js` reads a saved choice first and falls
  back to the operating system, and `index.html` applies the result before
  first paint so the page never flashes the wrong surface.
- One `.btn-primary` per step of the tool: the dropzone step has none, review
  has "Clean image", download has "Download clean image".
- There is no Tailwind and no PostCSS. The design system is plain CSS and the
  app needs nothing on top of it.

### Open token proposals

```
NEW TOKEN  --border-w: 1px
   why nothing existing fits: every surface in the system draws a 1px
   hairline, but the width itself is only ever written literally inside
   tokens.css. Defined locally in src/app.css until the system adopts it.

NEW TOKEN  --topbar-h: 56px
   why nothing existing fits: no layout token covers a sticky product bar.
   Derived locally as calc(var(--space-7) + var(--space-2)).

NEW TOKEN  breakpoints — 560px / 768px / 900px
   why nothing existing fits: the system documents container maximums
   (--max-marketing, --max-app) but no breakpoint scale. Custom properties
   cannot be used in a media query, so a literal is unavoidable; this app
   pins itself to exactly these three widths.
```

`src/lib/clean.js` contains one literal hex, `JPEG_MATTE = "#FFFFFF"`. That is
image data written to a canvas, not interface styling, so it is intentionally
not a token.
