import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const collections = {
  docs: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/docs" }),
    schema: z
      .object({
        title: z.string(),
        description: z.string().optional(),
        featured: z.number().int().positive().optional(),
        tags: z.array(z.string()).optional(),
        sidebar: z.object({ hidden: z.boolean().optional() }).optional(),
      })
      .loose(),
  }),
};
