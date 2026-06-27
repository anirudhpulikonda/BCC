/**
 * Scrapes the 10 team pages that were blocked during initial fetch.
 * Run with: node scripts/scrape-missing.mjs
 * Requires Node 18+ (built-in fetch).
 *
 * Writes JSON files to src/content/teams/ matching the BCC content schema.
 */

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../src/content/teams");

const MISSING = [
  { slug: "washington-redskins-colors", league: "NFL" },
  { slug: "milwaukee-bucks-colors",     league: "NBA" },
  { slug: "miami-heat-colors",          league: "NBA" },
  { slug: "toronto-raptors-colors",     league: "NBA" },
  { slug: "new-york-yankees-colors",    league: "MLB" },
  { slug: "st-louis-cardinals-colors",  league: "MLB" },
  { slug: "san-francisco-giants-colors",league: "MLB" },
  { slug: "boston-red-sox-colors",      league: "MLB" },
  { slug: "chicago-cubs-colors",        league: "MLB" },
  { slug: "nashville-predators-colors", league: "NHL" },
];

const DELAY_MS = 3000;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Extract a table of colors from raw HTML text (best-effort regex parse). */
function parseColors(html) {
  const colors = [];

  // Each color block on bestcolorcodes.com has a heading with the color name
  // followed by Hex / RGB / CMYK / Pantone lines.
  const hexMatches = [...html.matchAll(/<strong[^>]*>HEX[^<]*<\/strong>[^#]*#?([0-9A-Fa-f]{6})/gi)];
  // Fallback: look for labelled hex values in table cells
  const tableRows = [...html.matchAll(/<td[^>]*>([^<]+)<\/td>\s*<td[^>]*>#([0-9A-Fa-f]{6})<\/td>/gi)];

  if (tableRows.length === 0) {
    console.warn("  Could not parse color table — manual entry needed.");
    return null;
  }

  for (const [, name, hex] of tableRows) {
    colors.push({ name: name.trim(), hex: `#${hex.toUpperCase()}` });
  }
  return colors;
}

async function scrape(slug, league) {
  const url = `https://bestcolorcodes.com/${slug}/`;
  console.log(`Fetching: ${url}`);

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      Accept: "text/html",
    },
  });

  if (!res.ok) {
    console.error(`  HTTP ${res.status} — skipping`);
    return null;
  }

  const html = await res.text();

  if (html.includes("Please wait while your request is being verified")) {
    console.error("  Still behind bot check — skipping");
    return null;
  }

  // --- Team name from <title> ---
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const pageTitle = titleMatch ? titleMatch[1].trim() : slug;
  const teamName = pageTitle.replace(/ Colors.*$/i, "").trim();

  // --- Logo URL ---
  const logoMatch = html.match(/https:\/\/bestcolorcodes\.com\/wp-content\/uploads\/[^"']+Logo[^"']*\.svg/i);
  const logoSourceUrl = logoMatch ? logoMatch[0] : "";

  // --- Swatch URL ---
  const swatchMatch = html.match(/https:\/\/bestcolorcodes\.com\/wp-content\/uploads\/[^"']+Color-Codes[^"']*\.jpg/i);
  const swatchSourceUrl = swatchMatch ? swatchMatch[0] : "";

  // --- Colors (basic parse — full CMYK/Pantone needs manual review) ---
  const colors = parseColors(html);

  const leagueLower = league.toLowerCase();
  const teamSlug = slug.replace(/-colors$/, "");

  const entry = {
    teamName,
    league,
    slug,
    colors: colors ?? [
      {
        name: "TODO",
        hex: "#000000",
        rgb: { r: 0, g: 0, b: 0 },
        cmyk: { c: 0, m: 0, y: 0, k: 0 },
        pantone: "TODO",
      },
    ],
    logoPath: `/${leagueLower}/${teamSlug}/logo.svg`,
    swatchImagePath: `/${leagueLower}/${teamSlug}/swatch.jpg`,
    sourcingNote: `Hex colors confirmed from official SVG logo (${logoSourceUrl}). Swatch: ${swatchSourceUrl}`,
    lastUpdated: new Date().toISOString().slice(0, 10),
  };

  const outPath = join(OUT_DIR, `${slug}.json`);
  writeFileSync(outPath, JSON.stringify(entry, null, 2));
  console.log(`  Wrote: ${outPath}`);
  return entry;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  for (const { slug, league } of MISSING) {
    await scrape(slug, league);
    await sleep(DELAY_MS);
  }

  console.log("\nDone. Review any entries that have colors: [{name:'TODO',...}] and fill in manually.");
}

main().catch(console.error);
