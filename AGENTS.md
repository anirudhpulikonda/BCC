# BCC — Brand Color Codes

## Project Overview

A reference site for sports team brand colors across major leagues (NFL, NBA, NHL, MLB, MLS, etc.), providing exact hex, RGB, CMYK, and Pantone values for every team.

---

## Content Schema — Team Color Page

Each team is represented as a structured data entry (e.g. a JSON/TS file in `src/data/teams/`).

```ts
{
  teamName: string;          // "Pittsburgh Steelers"
  league: string;            // "NFL" | "NBA" | "NHL" | "MLB" | "MLS" | ...
  slug: string;              // "pittsburgh-steelers-colors" (see Slug Convention)
  colors: [
    {
      name: string;          // "Steelers Black"
      hex: string;           // "#101820"
      rgb: { r: number; g: number; b: number };   // { r: 16, g: 24, b: 32 }
      cmyk: { c: number; m: number; y: number; k: number }; // { c: 50, m: 25, y: 0, k: 87 }
      pantone: string;       // "Pantone Black 6 C"
    },
    // ... additional colors
  ];
  logoPath: string;          // "/teams/nfl/pittsburgh-steelers/logo.svg"
  swatchImagePath: string;   // "/teams/nfl/pittsburgh-steelers/swatch.png"
  sourcingNote: string;      // Free text: where color values were sourced from
  lastUpdated: string;       // ISO date "2026-06-27"
}
```

**Rules:**
- All five color representations (name, hex, rgb, cmyk, pantone) are required for every color entry.
- `logoPath` and `swatchImagePath` are paths relative to `public/` — local files in the repo.
- `league` should be a consistent uppercase abbreviation (NFL, NBA, NHL, MLB, MLS, NCAAF, etc.).
- `lastUpdated` must be updated whenever color values are changed.

---

## URL Slug Convention

- Format: `/[team-name-in-kebab-case]-colors/`
- Always suffix with `-colors`
- No league prefix in the slug
- All lowercase, hyphens only (no underscores)

**Examples:**
```
/pittsburgh-steelers-colors/
/los-angeles-lakers-colors/
/chicago-blackhawks-colors/
```

---

## SEO — Title & Meta Description Format

> **Note:** These are proposed defaults. Update this section with the final format once a reference page is reviewed.

**Title tag:**
```
[Team Name] Colors – Hex, RGB, CMYK & Pantone Codes | BCC
```
Example: `Pittsburgh Steelers Colors – Hex, RGB, CMYK & Pantone Codes | BCC`

**Meta description:**
```
Explore the official [Team Name] color codes including hex, RGB, CMYK, and Pantone values. The complete [Team Name] brand color palette for designers and fans.
```
Example: `Explore the official Pittsburgh Steelers color codes including hex, RGB, CMYK, and Pantone values. The complete Pittsburgh Steelers brand color palette for designers and fans.`

---

## Design Tokens

All tokens are CSS custom properties defined in `src/styles/tokens.css` and imported via `src/styles/global.css`.

### Surfaces (light / dark)

| Token | Light | Dark |
|-------|-------|------|
| `--surface-0` | `#f4f4f2` | `#1a1a18` |
| `--surface-1` | `#f9f9f8` | `#232320` |
| `--surface-2` | `#ffffff` | `#2c2c2a` |

### Text

| Token | Light | Dark |
|-------|-------|------|
| `--text-primary` | `#1a1a18` | `#f0efe8` |
| `--text-secondary` | `#5f5e5a` | `#b4b2a9` |
| `--text-muted` | `#888780` | `#888780` |
| `--text-accent` | `#185fa5` | `#85b7eb` |
| `--text-success` | `#3b6d11` | `#97c459` |

### Borders

| Token | Light | Dark |
|-------|-------|------|
| `--border` | `rgba(0,0,0,.10)` | `rgba(255,255,255,.10)` |
| `--border-strong` | `rgba(0,0,0,.15)` | `rgba(255,255,255,.18)` |
| `--border-accent` | `#b5d4f4` | `#0c447c` |
| `--border-success` | `#c0dd97` | `#3b6d11` |

### Accent fills

| Token | Light | Dark |
|-------|-------|------|
| `--bg-accent` | `#e6f1fb` | `#042c53` |

### Typography

| Token | Value |
|-------|-------|
| `--font-sans` | `'Inter', system-ui, sans-serif` |
| `--font-mono` | `ui-monospace, 'Cascadia Code', monospace` |
| Body | `16px / 1.7` |
| `h1` | `28px / 500` |
| Nav logo | `15px / 500` |
| Nav links | `13px` |
| Hero subtitle | `14px` |
| Section label | `12px / 500 / uppercase / 0.08em tracking` |
| Color card name | `13px / 500` |
| Color label | `11px / 500 / monospace` |
| Badge, sourcing, footer | `12px` |

### Spacing & layout

| Token | Value |
|-------|-------|
| `--radius` | `8px` |
| Card radius | `12px` |
| Nav height | `56px` |
| Max content width | `900px` |
| Hero padding | `3rem 2rem 2.5rem` |
| Main padding | `2.5rem 2rem` |
| Color swatch height | `100px` |
| Logo tile size | `110 × 110px` (14px inner padding) |
| Colors grid gap | `12px` |
| Related grid gap | `10px` |
| Section bottom margin | `3rem` |

---

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
