import { createWriteStream, mkdirSync } from "fs";
import { pipeline } from "stream/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = join(__dirname, "../src/assets/teams");

const TEAMS = [
  // NFL
  { slug: "pittsburgh-steelers",   league: "nfl", logo: "https://bestcolorcodes.com/wp-content/uploads/2020/01/Pittsburgh-Steelers-Logo.svg",      swatch: "https://bestcolorcodes.com/wp-content/uploads/2020/01/Pittsburgh-Steelers-Color-Codes.jpg" },
  { slug: "san-francisco-49ers",   league: "nfl", logo: "https://bestcolorcodes.com/wp-content/uploads/2019/11/San-Francisco-49ers-Logo.svg",       swatch: "https://bestcolorcodes.com/wp-content/uploads/2019/11/San-Francisco-49ers-Color-Codes.jpg" },
  { slug: "kansas-city-chiefs",    league: "nfl", logo: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Kansas-City-Chiefs-Logo.svg",        swatch: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Kansas-City-Chiefs-Color-Codes.jpg" },
  { slug: "los-angeles-rams",      league: "nfl", logo: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Los-Angeles-Rams-Logo.svg",          swatch: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Los-Angeles-Rams-Color-Codes.jpg" },
  { slug: "baltimore-ravens",      league: "nfl", logo: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Baltimore-Ravens-Logo.svg",          swatch: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Baltimore-Ravens-Color-Codes.jpg" },
  { slug: "cincinnati-bengals",    league: "nfl", logo: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Cincinnati-Bengals-Logo.svg",        swatch: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Cincinnati-Bengals-Color-Codes.jpg" },
  { slug: "washington-redskins",   league: "nfl", logo: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Washington-Redskins-Logo.svg",       swatch: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Washington-Redskins-Color-Codes.jpg" },
  { slug: "arizona-cardinals",     league: "nfl", logo: "https://bestcolorcodes.com/wp-content/uploads/2020/01/Arizona-Cardinals-Logo.svg",         swatch: "https://bestcolorcodes.com/wp-content/uploads/2020/01/Arizona-Cardinals-Color-Codes.jpg" },
  { slug: "buffalo-bills",         league: "nfl", logo: "https://bestcolorcodes.com/wp-content/uploads/2020/01/Buffalo-Bills-Logo.svg",             swatch: "https://bestcolorcodes.com/wp-content/uploads/2020/01/Buffalo-Bills-Color-Codes.jpg" },
  { slug: "green-bay-packers",     league: "nfl", logo: "https://bestcolorcodes.com/wp-content/uploads/2020/01/Green-Bay-Packers-Logo.svg",         swatch: "https://bestcolorcodes.com/wp-content/uploads/2020/01/Green-Bay-Packers-Color-Codes.jpg" },
  { slug: "minnesota-vikings",     league: "nfl", logo: "https://bestcolorcodes.com/wp-content/uploads/2020/01/Minnesota-Vikings-Logo.svg",         swatch: "https://bestcolorcodes.com/wp-content/uploads/2020/01/Minnesota-Vikings-Color-Codes.jpg" },
  // NBA
  { slug: "los-angeles-lakers",    league: "nba", logo: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Los-Angeles-Lakers-Logo.svg",        swatch: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Los-Angeles-Lakers-Color-Codes.jpg" },
  { slug: "golden-state-warriors", league: "nba", logo: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Golden-State-Warriors-Logo.svg",     swatch: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Golden-State-Warriors-Color-Codes.jpg" },
  { slug: "milwaukee-bucks",       league: "nba", logo: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Milwaukee-Bucks-Logo.svg",           swatch: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Milwaukee-Bucks-Color-Codes.jpg" },
  { slug: "miami-heat",            league: "nba", logo: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Miami-Heat-Logo.svg",                swatch: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Miami-Heat-Color-Codes.jpg" },
  { slug: "toronto-raptors",       league: "nba", logo: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Toronto-Raptors-Logo.png",           swatch: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Toronto-Raptors-Color-Codes.jpg" },
  // MLB
  { slug: "new-york-yankees",      league: "mlb", logo: "https://bestcolorcodes.com/wp-content/uploads/2019/12/New-York-Yankees-Logo.svg",          swatch: "https://bestcolorcodes.com/wp-content/uploads/2019/12/New-York-Yankees-Color-Codes.jpg" },
  { slug: "st-louis-cardinals",    league: "mlb", logo: "https://bestcolorcodes.com/wp-content/uploads/2019/12/St-Louis-Cardinals-Logo.svg",        swatch: "https://bestcolorcodes.com/wp-content/uploads/2019/12/St-Louis-Cardinals-Color-Codes.jpg" },
  { slug: "san-francisco-giants",  league: "mlb", logo: "https://bestcolorcodes.com/wp-content/uploads/2019/12/San-Francisco-Giants-Logo.svg",      swatch: "https://bestcolorcodes.com/wp-content/uploads/2019/12/San-Francisco-Giants-Color-Codes.jpg" },
  { slug: "boston-red-sox",        league: "mlb", logo: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Boston-Red-Sox-Logo.svg",            swatch: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Boston-Red-Sox-Color-Codes.jpg" },
  { slug: "chicago-cubs",          league: "mlb", logo: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Chicago-Cubs-Logo.svg",              swatch: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Chicago-Cubs-Color-Codes.jpg" },
  // NHL
  { slug: "edmonton-oilers",       league: "nhl", logo: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Edmonton-Oilers-Logo.svg",           swatch: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Edmonton-Oilers-Color-Codes.jpg" },
  { slug: "boston-bruins",         league: "nhl", logo: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Boston-Bruins-Logo.svg",             swatch: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Boston-Bruins-Color-Codes.jpg" },
  { slug: "dallas-stars",          league: "nhl", logo: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Dallas-Stars-Logo.svg",              swatch: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Dallas-Stars-Color-Codes.jpg" },
  { slug: "toronto-maple-leafs",   league: "nhl", logo: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Toronto-Maple-Leafs-Logo.svg",       swatch: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Toronto-Maple-Leafs-Color-Codes.jpg" },
  { slug: "nashville-predators",   league: "nhl", logo: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Nashville-Predators-Logo.svg",       swatch: "https://bestcolorcodes.com/wp-content/uploads/2019/12/Nashville-Predators-Color-Codes.jpg" },
  // Brand
  { slug: "hoka",                  league: "brand", logo: "https://bestcolorcodes.com/wp-content/uploads/2023/09/Hoka-Logo-Vector.svg",             swatch: null },
];

async function download(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  await pipeline(res.body, createWriteStream(destPath));
}

function ext(url) {
  return url.split(".").pop().split("?")[0];
}

async function main() {
  let ok = 0, fail = 0;

  for (const { slug, league, logo, swatch } of TEAMS) {
    const dir = join(ASSETS_DIR, league, slug);
    mkdirSync(dir, { recursive: true });

    const logoExt = ext(logo);
    const logoDest = join(dir, `logo.${logoExt}`);
    process.stdout.write(`  logo  ${slug} ... `);
    try {
      await download(logo, logoDest);
      console.log("✓");
      ok++;
    } catch (e) {
      console.log(`✗ ${e.message}`);
      fail++;
    }

    if (swatch) {
      const swatchExt = ext(swatch);
      const swatchDest = join(dir, `swatch.${swatchExt}`);
      process.stdout.write(`  swatch ${slug} ... `);
      try {
        await download(swatch, swatchDest);
        console.log("✓");
        ok++;
      } catch (e) {
        console.log(`✗ ${e.message}`);
        fail++;
      }
    }
  }

  console.log(`\nDone: ${ok} downloaded, ${fail} failed.`);
}

main().catch(console.error);
