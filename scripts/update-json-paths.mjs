/**
 * Updates logoPath and swatchImagePath in every team JSON to point at the
 * locally downloaded files in src/assets/teams/.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEAMS_DIR  = join(__dirname, "../src/content/teams");
const ASSETS_DIR = join(__dirname, "../src/assets/teams");

const files = readdirSync(TEAMS_DIR).filter(f => f.endsWith(".json"));

for (const file of files) {
  const fullPath = join(TEAMS_DIR, file);
  const entry = JSON.parse(readFileSync(fullPath, "utf8"));
  const { league, slug } = entry;
  const leagueLower = league.toLowerCase();
  // slug in the JSON already includes the "-colors" suffix; strip it to match asset dir name
  const teamSlug = slug.replace(/-colors$/, "");
  const assetDir = join(ASSETS_DIR, leagueLower, teamSlug);

  // Detect actual logo extension
  let logoExt = null;
  for (const ext of ["svg", "png", "jpg", "webp"]) {
    if (existsSync(join(assetDir, `logo.${ext}`))) { logoExt = ext; break; }
  }

  // Detect actual swatch extension
  let swatchExt = null;
  for (const ext of ["jpg", "png", "webp", "svg"]) {
    if (existsSync(join(assetDir, `swatch.${ext}`))) { swatchExt = ext; break; }
  }

  // Relative path from src/content/teams/ to src/assets/teams/
  const base = `../../assets/teams/${leagueLower}/${teamSlug}`;

  if (logoExt)   entry.logoPath        = `${base}/logo.${logoExt}`;
  if (swatchExt) entry.swatchImagePath = `${base}/swatch.${swatchExt}`;
  else           entry.swatchImagePath = "";   // Hoka has no swatch

  writeFileSync(fullPath, JSON.stringify(entry, null, 2) + "\n");
  console.log(`  ${file}: logo=${logoExt ?? "MISSING"} swatch=${swatchExt ?? "MISSING"}`);
}

console.log("\nAll JSON paths updated.");
