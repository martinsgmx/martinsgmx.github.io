import type { ImageMetadata } from 'astro'

/**
 * Custom per-post OG header images.
 *
 * A post can ship its own OpenGraph preview by placing a `header.png` file in a
 * folder named after the post id (slug), e.g.:
 *
 *   src/content/posts/_assets/2026-10-07-kit-product-launch/header.png
 *
 * When present, that image is used as the post's `og:image` / `twitter:image`
 * instead of the auto-generated one from `/open-graph/<post-id>.png`.
 */
const headerImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/content/posts/_assets/**/header.png',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>

/**
 * Resolve a custom OG header image URL for a post id.
 *
 * Falls back to a prefix match so assets stored under a slightly different
 * folder name (e.g. `2026-08-10-sentinel-ops-mcp` for the post
 * `2026-08-10-sentinel-ops`) still resolve. Returns `undefined` when the post
 * has no custom header, so callers can use the default OG generation.
 */
export function getCustomOgImage(postId: string): string | undefined {
  const exactKey = `/src/content/posts/_assets/${postId}/header.png`
  if (headerImages[exactKey]) {
    return headerImages[exactKey]
  }

  const prefix = `/src/content/posts/_assets/${postId}`
  const prefixMatch = Object.keys(headerImages).find((key) => key.startsWith(prefix))
  if (prefixMatch) {
    return headerImages[prefixMatch]
  }

  return undefined
}
