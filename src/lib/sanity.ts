// Sanity client — gracefully no-ops if env not yet configured.
// Site falls back to constants in src/lib/site.ts until Sanity content lands.

import { createClient, type SanityClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || "production";

export const sanityConfigured = Boolean(projectId);

export const sanity: SanityClient | null = sanityConfigured
  ? createClient({
      projectId: projectId as string,
      dataset,
      apiVersion: "2024-01-01",
      useCdn: true,
    })
  : null;

const builder = sanity ? imageUrlBuilder(sanity) : null;

export function urlFor(source: unknown) {
  if (!builder || !source) return null;
  return builder.image(source as never);
}

export async function safeFetch<T>(query: string, params: Record<string, unknown> = {}, fallback: T): Promise<T> {
  if (!sanity) return fallback;
  try {
    return await sanity.fetch<T>(query, params);
  } catch (err) {
    console.warn("[sanity] fetch failed, returning fallback:", err);
    return fallback;
  }
}
