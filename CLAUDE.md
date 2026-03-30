# Unlocked.it — Maintenance Guide

## File structure

```
unlocked.it/
├── index.html          ← Single-page HTML, structure only — no hardcoded content
├── config.json         ← ALL editable content: texts, events, artists, links, sponsors
├── css/
│   ├── tokens.css      ← CSS variables, typography, reset, grain overlay
│   ├── components.css  ← nav, cursor, buttons, tags, badges, marquee, form, sticky bar
│   └── sections.css    ← layout and style for each section
├── js/
│   ├── config-loader.js ← reads config.json and populates all DOM elements
│   ├── i18n.js          ← IT/EN language toggle
│   ├── animations.js    ← all GSAP animations
│   └── main.js          ← entry point, orchestrates everything
└── asset/
    ├── font/DirtyStains-DEMO.otf
    ├── img/             ← event images (grayscale on page)
    └── video/           ← hero background video
```

**Rule: never hardcode content in index.html. All text, dates, and links live in config.json.**

---

## How to update events

Edit `config.json` → `events` array. Each event:

```json
{
  "id": "unique-slug",
  "brand": "AURA",              // "AURA", "UMF", or "SOLO"
  "brandIntensity": "full",     // "full" = AURA, "medium" = UMF, "muted" = SOLO
  "date": {
    "it": "21 Giugno 2026",
    "en": "June 21, 2026"
  },
  "dateISO": "2026-06-21",      // Used for countdown and sorting — keep accurate
  "location": {
    "it": "Nome location",
    "en": "Location name"
  },
  "artists": ["Artist Name"],
  "artistsTba": false,          // true = appends "+ altri TBA" after artist list
  "ticketUrl": "https://...",   // Leave "" if no link yet
  "soldOut": false,
  "tba": false                  // true = shows TBA badge, no ticket button
}
```

**To mark sold out:** set `"soldOut": true` — shows strikethrough badge automatically.
**To mark TBA:** set `"tba": true` — hides ticket button, shows TBA badge, card appears at 55% opacity.

---

## How to add an artist to the marquee

Edit `config.json` → `artists.marquee` array — just append the name:

```json
"marquee": [
  "Marco Carola", "Ilario Alicante", ..., "New Artist Name"
]
```

The marquee duplicates the array automatically for infinite scroll.

---

## How to change ticket links

Edit `config.json` → find the event by `id` → update `ticketUrl`.

---

## How to change IT/EN texts

All UI texts are in `config.json` → `ui.it` and `ui.en`. Structure mirrors the page sections. Never edit text directly in `index.html` — it will be overwritten by config-loader.js on load.

---

## How to add a new brand

1. Add entry to `config.json` → `brands`
2. Add `brandIntensity` value to `intensityMap` in `js/config-loader.js`
3. Add CSS class `.brand-[key]` in `css/sections.css` for the card accent line
4. Update `populateBrands()` in `config-loader.js` to include the new key

---

## Color palette — do not change

All colors are defined in `css/tokens.css` → `:root`. The design intentionally uses **only the cream scale** — no accent colors. Do not introduce new color variables.

Brand differentiation is achieved **only through cream intensity**:
- AURA → `var(--cream)` (full)
- UMF  → `var(--cream-80)` (medium)
- SOLO → `var(--cream-50)` (muted)

---

## Fonts

- **DirtyStains** — display/headlines — loaded from `asset/font/DirtyStains-DEMO.otf`
- **Inter** — body — loaded from Google Fonts (weights 300, 400, 500 only — never 600+)

If DirtyStains fails to load, check the `@font-face` path in `css/tokens.css` — the path must be relative from the CSS file location: `../asset/font/DirtyStains-DEMO.otf`.

---

## Adding gallery images

Drop images into `asset/img/`. Then in `index.html` find `.history-gallery` and replace `<div class="gallery-placeholder">` with:

```html
<div class="gallery-item">
  <img src="asset/img/your-image.jpg" alt="Description" loading="lazy">
</div>
```

Images are displayed in grayscale with color on hover — this is handled in `css/sections.css`.

---

## Animations

All GSAP animations are in `js/animations.js`. They respect `prefers-reduced-motion` — if that system preference is active, all animations are skipped and elements are shown at full opacity without transitions.

Do not add animations outside `animations.js`.
