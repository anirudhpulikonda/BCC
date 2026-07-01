# BCC - Best Color Codes

## Project Overview

A reference site for sports team brand colors across major leagues (NFL, NBA, NHL, MLB, MLS, etc.), providing exact hex, RGB, CMYK, and Pantone values for every team.

**Live URL:** `https://bestcolorcodes.com`
**Deployment:** Cloudflare Pages - `main` is the Production branch (configured in Cloudflare Settings → Builds & deployments) and deploys directly to `https://bestcolorcodes.com`. There is no separate `production` branch - pushing only to `main` is correct and sufficient.
**Stack:** Astro v5 + Tailwind CSS v4 (`@tailwindcss/vite`)

---

## Content Schema - Team Color Page

Each team is a JSON file loaded via Astro Content Collections (`glob` loader).

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
  logoPath: string;          // "/teams/nfl/arizona-cardinals-logo.svg"
  swatchImagePath: string;   // "/teams/nfl/pittsburgh-steelers/swatch.png"
  sourcingNote: string;      // Free text: where color values were sourced from
  sources?: { label: string; url: string }[];  // optional source links shown on team page
  description?: string;      // optional team description paragraph
  ogImage?: string;          // "/og/pittsburgh-steelers-colors.png" - path to OG image in public/og/
  lastUpdated: string;       // ISO date "2026-06-27"
}
```

**Rules:**
- All five color representations (name, hex, rgb, cmyk, pantone) are required for every color entry.
- `logoPath` and `swatchImagePath` are paths relative to `public/` - local files in the repo.
- `league` should be a consistent uppercase abbreviation (NFL, NBA, NHL, MLB, MLS, NCAAF, etc.).
- `lastUpdated` must be updated whenever color values are changed.
- `ogImage` must be set for the team page to show a rich social preview - see OG Images section below.

---

## URL Slug Convention

### Team pages
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

### Sport category pages
- Format: `/sports/[sport]/`
- Each sport category page lists only the leagues that belong to that sport
- Live pages: `/sports/football/` (NFL), `/sports/basketball/` (NBA), `/sports/hockey/` (NHL), `/sports/baseball/` (MLB), `/sports/footwear/`
- When adding a new sport, also add its category pill to `/src/pages/index.astro` and the card to `/src/pages/sports/index.astro`

### League pages
- Format: `/[league-lowercase]-team-color-codes/`
- Breadcrumb: `Best Color Codes › Sports › [Sport] › [League]` — the sport link must point to the correct `/sports/[sport]/` page

**Examples:**
```
/nfl-team-color-codes/   (breadcrumb sport: /sports/football/)
/nba-team-color-codes/   (breadcrumb sport: /sports/basketball/)
/nhl-team-color-codes/   (breadcrumb sport: /sports/hockey/)
/mlb-team-color-codes/   (breadcrumb sport: /sports/baseball/)
```

### Trailing slashes
- `trailingSlash: 'always'` is set in `astro.config.mjs`
- **All internal `href` links must end with `/`** - e.g. `href="/nfl-team-color-codes/"` not `href="/nfl-team-color-codes"`
- Production redirects (non-trailing → trailing) are handled by `public/_redirects`
- The dev server does NOT redirect - this is an Astro 5 limitation; test trailing slash behaviour on the deployed site

---

## Images & Logos

- All team logos live in `public/teams/{league}/{team-name}-logo.svg`
  - Example: `public/teams/nfl/arizona-cardinals-logo.svg`
- **Never put team images in `src/assets/`** - Vite hashes those filenames (e.g. `logo.B6wPjyxK.svg`), which breaks SEO crawlers
- `logoPath` in team JSON should be the public path: `/teams/nfl/arizona-cardinals-logo.svg`
- Always include descriptive `alt` text on every `<img>` tag

---

## SEO - Meta Tags

### Title & Meta Description Format

**Title tag:**
```
[Team Name] Colors - Hex, RGB, CMYK & Pantone Codes | Best Color Codes
```
Example: `Pittsburgh Steelers Colors - Hex, RGB, CMYK & Pantone Codes | Best Color Codes`

**Meta description:**
```
Explore the official [Team Name] color codes including hex, RGB, CMYK, and Pantone values. The complete [Team Name] brand color palette for designers and fans.
```

### Open Graph & Twitter - All pages (via `Base.astro`)

Every page automatically gets:
- `og:site_name` - "Best Color Codes"
- `og:type` - "website"
- `og:url` - canonical page URL
- `og:title` - page title
- `og:description` - page meta description
- `og:image` - falls back to `site.logo`
- `twitter:card` - "summary"
- `twitter:title`, `twitter:description`, `twitter:image`

> To update the fallback image across the entire site, change `site.logo` in `src/config/site.ts`.

### Open Graph & Twitter - Team pages (via `TeamColorPage.astro`)

Team pages additionally get when `ogImage` is set in the JSON:
- `og:image` - absolute URL to the generated OG image
- `og:image:width` - 2400
- `og:image:height` - 1260
- `og:image:alt` - "{Team Name} official brand colors"
- `twitter:card` - upgraded to "summary_large_image"
- `twitter:title`, `twitter:description`, `twitter:image`

Falls back to `site.logo` + `summary` card if `ogImage` is not set.

---

## OG Images

Generated OG images (2400×1260 PNG) live in `public/og/{slug}.png`.

- Generated via a local app running at `http://localhost:3456`
- The generator must be running locally when generating images
- Set `"ogImage": "/og/{slug}.png"` in the team JSON to activate the `og:image` tag

### Adding OG image for a new team

1. Make sure the generator app is running at `http://localhost:3456`
2. Run:
   ```
   curl "http://localhost:3456/generate?url=https://bestcolorcodes.com/{slug}/" -o public/og/{slug}.png
   ```
3. Add `"ogImage": "/og/{slug}.png"` to the team's JSON file
4. Commit both the PNG and the updated JSON

### Workflow when adding a new team page

When the user provides an SVG logo + team details and asks for the OG image in the same prompt:
1. Create the JSON file in `src/content/teams/`
2. Save the SVG to `public/teams/{league}/{slug}-logo.svg`
3. Call the generator and save the PNG to `public/og/{slug}.png`
4. Set `ogImage` in the JSON
5. Commit and push everything in one go

---

## Schema Markup

All schema.org JSON-LD is injected via `src/components/JsonLd.astro`. The site implements 10 schema types:

| Schema type | Where injected |
|---|---|
| `WebSite` | `Base.astro` (every page) |
| `Organization` | `Base.astro` (every page) |
| `WebPage` | `Base.astro` (every page) |
| `BreadcrumbList` | `Base.astro` (when `breadcrumbs` prop passed) and `TeamColorPage.astro` |
| `SportsOrganization` | `[league].astro` and static league pages via `<Fragment slot="head">` |
| `ItemList` | `[league].astro`, static league pages, and sport category pages via `<Fragment slot="head">` |
| `CollectionPage` | `/sports/` index and sport category pages (`/sports/football/` etc.) |
| `TechArticle` | Static league pages (nfl-, nba-, nhl-, mlb-team-color-codes.astro) |
| `SiteLinksSearchBox` | `Base.astro` via `potentialAction` on the `WebSite` schema (every page) |
| `SportsTeam` | `TeamColorPage.astro` |
| `ImageObject` | `TeamColorPage.astro` |
| `DefinedTermSet` | `TeamColorPage.astro` |
| `Dataset` | `TeamColorPage.astro` |
| `FAQPage` | `contact.astro` via `<Fragment slot="head">` |

### Central config - `src/config/site.ts`
This is the **single source of truth** for all schema data. Update here and every schema updates automatically:
- `site.url` - production domain (`https://bestcolorcodes.com`)
- `site.name` - site display name
- `site.logo` - absolute URL to logo/favicon (also used as OG image fallback site-wide)
- `site.email` - contact email
- `site.social` - array of social profile URLs (add here to populate `Organization.sameAs`)
- `leagueMeta` - full name, sport, slug, sportPath, and sportLabel for each league

### Adding schemas to a new page
1. Import `JsonLd` from `../components/JsonLd.astro`
2. Import `site` / `leagueMeta` from `../config/site` if needed
3. Inject inside `<Fragment slot="head">` when using `Base.astro` layout
4. Pass `breadcrumbs` prop to `Base.astro` to get a `BreadcrumbList` automatically

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
| `--font-sans` | `'Raleway', system-ui, sans-serif` |
| `--font-mono` | `ui-monospace, 'Cascadia Code', monospace` |
| Body font | Inter Tight (loaded via Google Fonts) |
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

## Contact Form

The contact form on `/contact/` uses **Web3Forms** (not Netlify Forms, not SMTP).
- Access key is stored as a hidden field in `src/pages/contact.astro`
- Submissions go to `bestcolorcodes@gmail.com`
- Form submits via `fetch` (async, no page reload)

---

## Development

Start the dev server:

```
npx astro dev
```

Stop it:

```
npx astro dev stop
```

> Note: `astro dev --background` does not exist in Astro 5. Use `npx astro dev` normally.

### Dark mode
Toggled manually via `[data-theme="dark"]` on `<html>`, persisted in `localStorage`.

### Scoped CSS gotcha
Astro scopes component styles by content hash. If styles don't apply after edits, restart the dev server to clear the stale CID.

---

## Documentation

Full documentation: https://docs.astro.build

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
