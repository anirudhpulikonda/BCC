import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const colorSchema = z.object({
  name: z.string(),
  hex: z.string(),
  rgb: z.object({ r: z.number(), g: z.number(), b: z.number() }),
  cmyk: z.object({ c: z.number(), m: z.number(), y: z.number(), k: z.number() }),
  pantone: z.string(),
});

const teams = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/teams" }),
  schema: z.object({
    teamName: z.string(),
    league: z.string(),
    slug: z.string(),
    colors: z.array(colorSchema),
    logoPath: z.string(),
    swatchImagePath: z.string().optional().default(""),
    sourcingNote: z.string(),
    lastUpdated: z.string(),
  }),
});

export const collections = { teams };
