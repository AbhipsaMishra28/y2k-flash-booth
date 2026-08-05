# Y2K Flash Booth

# THEy2Kbooth. — Product Requirements Document
**Version:** 1.0  
**Date:** 2026-08-05  
**Target Audience:** Teenagers & Influencers  
**Platform:** Desktop-first Web App (React + Vite)

---

## 1. Product Vision

THEy2Kbooth. is a desktop-first web photobooth that captures 4-photo strips in a single session with a warm, calming vintage-leopard aesthetic. Photos are processed in-browser with a glowy Y2K flash polar filter, film grain, vignette, and soft center focus — every strip feels like it was pulled from a 1990s mall booth crossed with a K-beauty studio. The output is a downloadable, shareable, uploadable strip image stamped with the user's custom message and handle.

---

## 2. Inspiration Sources

| Reference | Extraction |
|---|---|
| Leopard strip photo | 4-frame vertical strip, sepia-toned film look, leopard print surround, "photobooth + date" footer stamp, slight paper-aged border |
| Korean studio strip | Wide black border strips, pearl heart + bow decorative overlays, studio branding footer |
| Retro ephemera collage | Film strip frame, Polaroid stack, kiss lip stamps, ticket stub, Canon camera — decorative layer vocabulary |
| Star scatter | Silver + gold stars in varying sizes — sparkle/confetti overlay for strip decoration |

---

## 3. Design Language

### 3.1 Colour Palette — Calming Vintage Leopard

| Token | Hex | Use |
|---|---|---|
| `--background` | `#2B1F14` | Deep espresso — app background |
| `--surface` | `#3D2B1A` | Warm dark brown — panel ground |
| `--leopard-tan` | `#C9A96E` | Muted ochre — primary accent |
| `--leopard-spot` | `#6B4226` | Chestnut brown — spot motif, borders |
| `--leopard-cream` | `#F0E6D3` | Vintage cream — text, strip border |
| `--film-sepia` | `#D4B896` | Sepia mid-tone — photo tint overlay |
| `--muted-sage` | `#8A9E7E` | Faded sage — calm secondary accent |
| `--ink-black` | `#1A1208` | Near-black — strip inner border |

### 3.2 Typography

| Role | Font | Source |
|---|---|---|
| Display / UI labels | Playfair Display | Google Fonts |
| Body / dates / stamps | Courier Prime | Google Fonts |
| Decorative footer branding | Great Vibes | Google Fonts |

### 3.3 Strip Border & Background

- **Border:** Vintage black border (28px) with 6px inner ink-black rule
- **Background behind strip:** Leopard print texture at **30% opacity** — visible but calm, not overwhelming
- **Strip margin:** Leopard-cream matte inside the black border

---

## 4. Photo Filter System

### 4.1 Default Filter — Y2K (Warm Pink Glow, Dreamy)

Applied to every captured frame via canvas post-processing:

| Step | Technique | Value |
|---|---|---|
| Warm pink tone | CSS filter base | `sepia(0.25) saturate(1.3) hue-rotate(-15deg) brightness(1.1)` |
| Glowy polar bloom | Radial white-pink gradient center overlay | `rgba(255,220,230,0.22)` center → transparent at 60% radius |
| Vintage flash burn | Highlight clipping simulation | Lighten blend at corners `rgba(255,240,245,0.14)` |
| Soft dreamy halo | Blurred composite layer | Blurred copy of frame at 35% opacity overlaid |
| Vignette | Radial gradient edge burn | `rgba(26,18,8,0.7)` at edges → transparent at 50% radius |
| Film grain | Procedural `ImageData` noise pass | 6% opacity |

### 4.2 Filter Presets (2–3 saveable)

| Preset | Vibe | Key Treatment |
|---|---|---|
| **Y2K** *(default)* | Warm pink glow, dreamy | Pink tone shift, bloom, soft grain |
| **Noir** | Heavy sepia, moody, dark | `sepia(0.85)` full desaturate, heavy vignette, high contrast |
| **Film** | Muted, cinematic, green shadows | `hue-rotate(15deg)` green-teal shadows, muted saturation, sharp grain |

- User selects preset on the Welcome screen before session starts
- Selection persists for the full 4-shot session
- Y2K polar glow layer applies on top of all presets as a signature treatment

---

## 5. App Screens & Flow

```
Screen 1: WELCOME
  └── THEy2Kbooth. logo + tagline
  └── Filter preset selector (Y2K / Noir / Film)
  └── "Turn flash on?" toggle card
  └── "let's go ✦" CTA

Screen 2: VIEWFINDER (Live Preview)
  └── Live mirrored camera feed — always visible before shooting
  └── Decorative film strip border overlay on feed
  └── Active filter name badge (top-left)
  └── Shot counter badge (top-right: "1 / 4")
  └── Countdown overlay (3 → 2 → 1, large centred numeral)
  └── White flash overlay on capture (120ms)
  └── 2-second frozen frame hold after each shot
  └── Auto-advances to next shot

Screen 3: STRIP PREVIEW + EDIT
  └── Rendered vertical strip (4 frames + footer)
  └── Live-editable footer panel (message + handle → debounced 300ms re-render)
  └── Strip updates in real time as user types
  └── Action row: "save it" / "share it" / "upload it"
  └── "do it again" — restarts session
```

---

## 6. Feature Specifications

### 6.1 Camera Access

- `navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })`
- Feed is **mirrored horizontally** (selfie-natural)
- Camera permission requested on Welcome screen before session starts
- Graceful error state with retry if permission is denied
- Live feed displays immediately on `getUserMedia` resolve — no delay

### 6.2 Flash

- **Welcome screen** — card asks: `☀ yes, flash me` / `✦ no thanks`
- **Flash simulation** — full-screen white overlay at 85% opacity for 120ms at moment of capture
- Desktop torch control is not available via web; flash is screen-simulated
- Small note displayed: *"flash is screen-simulated on desktop ✦"*

### 6.3 Countdown & Capture Sequence

- Session auto-starts after viewfinder is live and user taps `let's go ✦`
- 3-second countdown between shots (`INTERVAL_MS = 3000`)
- Countdown: large centred numeral animates (scale pop on each number)
- At `0` → white flash overlay → `drawImage` to canvas → apply filters → store frame
- 2-second frozen preview of captured frame shown before next countdown begins
- Total session: 4 frames × ~5 seconds = ~20 seconds end-to-end
- Shutter click SFX plays on each capture (audio unlocked on first user gesture)
- Soft ding SFX when full strip is ready

### 6.4 Photo Strip Composition

| Property | Value |
|---|---|
| Strip canvas width | 600px |
| Strip canvas height | 2200px (4 frames) |
| Frame dimensions | 600 × 480px each |
| Gap between frames | 16px |
| Border | 28px vintage black outer + 6px ink-black inner rule |
| Background | Leopard SVG tiled at 30% opacity behind strip |
| Footer zone | 160px |

### 6.5 Footer

Three lines, editable before download:

| Line | Content | Style |
|---|---|---|
| Line 1 | Custom message (max 32 chars) | Great Vibes script, 22px, leopard-cream |
| Line 2 | @handle (max 20 chars) — optional | Courier Prime, 14px, muted ochre |
| Line 3 | Auto date `05 · 08 · 2026` | Courier Prime, 11px, 60% opacity cream |

- Placeholder if message left empty: `photobooth` (faint, matching inspo)
- Handle line omitted entirely if left blank
- Both fields update strip canvas live (debounced 300ms)

### 6.6 Sticker Overlays — All of Them

Scattered on the strip canvas on render, randomised positions with seeded layout:

| Sticker | Source Inspo | Placement |
|---|---|---|
| Gold + silver stars (8–12) | Star scatter reference | Scattered across margins, animated stagger pop on reveal |
| Kiss lip stamps (2–3) | Retro ephemera collage | Lower third, slightly rotated |
| Film strip frame motif | Retro ephemera collage | Left margin strip edge |
| Pearl hearts (2) | Korean studio strip | Top corners of strip |
| Ribbon bow (1) | Korean studio strip | Right edge, mid-strip |

- Stars animate in with a stagger pop (50ms delay per star) on strip reveal
- All stickers rendered as SVG to canvas — crisp at any resolution
- Sticker density: present but not overwhelming — editorial scatter, not chaos

### 6.7 Viewfinder Live Preview

- Camera feed is always live and visible before any shot fires
- Full filter pipeline previewed in real-time via CSS filters on `` element (close approximation)
- Overlays on live feed: film strip border, filter badge, shot counter, countdown
- **No pose prompts** — viewfinder kept clean
- Between shots: 2-second frozen frame of just-captured photo before next countdown

### 6.8 Output Actions

Three pill buttons on Strip Preview screen:

| Button | Behaviour | Style |
|---|---|---|
| `save it` | `canvas.toBlob()` → `` | Ghost pill |
| `share it` | `navigator.share()` with strip file; fallback: copies base64 to clipboard + toast *"copied ✦"* | Filled leopard-tan `#C9A96E` |
| `upload it` | `showSaveFilePicker()` (File System Access API); fallback: standard `` + toast *"saving to downloads ✦"* | Ghost pill with ↑ icon |

- `do it again` text link below the button row — restarts full session

---

## 7. UI Component Inventory

| Component | Description |
|---|---|
| `WelcomeScreen` | Logo, filter preset selector, flash toggle, start CTA |
| `FilterPresetSelector` | 3 cards — Y2K / Noir / Film, saves to app state |
| `FlashToggleCard` | Two-option yes/no, saves to app state |
| `ViewfinderScreen` | `` mirrored, countdown overlay, shot badge, flash overlay, frozen frame hold |
| `CountdownBadge` | Animates 3→2→1 with scale pop |
| `ShotCounter` | `"1 / 4"` badge top-right |
| `FlashOverlay` | Full-screen white at 85% opacity, 120ms duration |
| `StripCanvas` | Hidden `

` — composites 4 frames + stickers + footer |
| `StripPreview` | Displays rendered PNG strip, footer edit panel, action buttons |
| `FooterEditPanel` | Message + handle text inputs, live debounced strip re-render |
| `LeopardBackground` | SVG tiled leopard spot pattern at 30% opacity |
| `StickerLayer` | Renders all stickers to canvas — stars, lips, hearts, bow, film frame |
| `StarScatter` | Animated gold/silver stars with stagger pop |
| `SoundManager` | Manages shutter click + ding SFX, unlocked on first gesture |

---

## 8. Technical Stack

| Concern | Solution |
|---|---|
| Camera | `getUserMedia` Web API |
| Capture | `HTMLCanvasElement.drawImage(videoEl)` |
| Photo filters | Canvas 2D API + CSS filter compositing |
| Y2K glow / polar bloom | `createRadialGradient` on canvas |
| Film grain | Procedural `ImageData` noise pass |
| Vignette | `createRadialGradient` edge burn |
| Stickers | SVG rendered to canvas via `drawImage` |
| Strip assembly | Single `

` composite |
| Download | `canvas.toBlob` + `

` element |
| Upload | `showSaveFilePicker` (File System Access API) |
| Share | Web Share API with file payload |
| Sound | `AudioContext` + short PCM clips |
| Fonts | Google Fonts CSS2 `@import` |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Framework | React 19 + Vite 8 |

---

## 9. Desktop Layout

- **Minimum viewport:** 1024px wide
- **Viewfinder:** centred, `480 × 360px` live feed, landscape crop, film strip border overlay
- **Strip preview:** centred, max `600px` wide, scaled to fit viewport height
- **Background:** full bleed `#2B1F14` with SVG leopard-spot watermark at 6% opacity
- **No mobile optimisation in v1** — desktop-first, can revisit post-launch

---

## 10. Copy & Tone

- Lowercase, casual, confident — feels like a text from a cool older sister
- CTAs: `let's go ✦` / `save it` / `share it` / `upload it` / `do it again`
- Error states: *"camera shy? check your permissions and try again ✦"*
- Flash note: *"flash is screen-simulated on desktop ✦"*
- Strip ready toast: *"your strip is ready ✦"*

---

## 11. Out of Scope — v1

- Multiple strip layout options (2×3 grid)
- Custom sticker packs / sticker picker
- Video / GIF strip export
- Cloud upload / shareable link with backend
- Print integration
- Mobile torch hardware control (best-effort only)
- Sticker position customisation

---

## 12. Success Criteria

- Camera opens without page reload after permission grant
- All 4 frames captured within ~20 seconds from session start
- Y2K glow filter visibly renders on every frame — warm, dreamy, not flat
- Strip renders with stickers, border, footer in under 2 seconds
- PNG downloads successfully and looks identical to the in-app preview
- Footer message and handle update the strip live as user types
- App feels like a designed object — not a utility — at first glance
- Shutter click plays on every capture without audio lag

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3ff9ff33-3ad1-48a5-9b5b-baf35177f850).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
