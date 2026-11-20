/**
 * 2:1 companions to the square studio renders.
 *
 * Each file is the original 1:1 photograph placed in the centre of a 2400×1200
 * canvas, with its own left and right edge columns stretched and blurred to
 * fill the margins. The instrument itself is untouched and unscaled; only
 * empty studio floor was added, so filling a 16:9 box with this file never
 * cuts the product.
 *
 * Regenerate with ffmpeg + cwebp whenever one of the square renders changes.
 */
const wide: Record<string, string> = {
  "/images/reference-style/feature-flow.webp": "/images/wide-feature-flow.webp",
  "/images/reference-style/feature-level.webp": "/images/wide-feature-level.webp",
  "/images/reference-style/product-flow.webp": "/images/wide-product-flow.webp",
  "/images/reference-style/product-level.webp": "/images/wide-product-level.webp",
  "/images/reference-style/hero-flow.webp": "/images/wide-hero-flow.webp",
  "/images/reference-style/hero-level.webp": "/images/wide-hero-level.webp",
  "/images/reference-style/guide-output.webp": "/images/wide-guide-output.webp",
  "/images/reference-style/guide-level.webp": "/images/wide-guide-level.webp",
  "/images/reference-style/guide-ip.webp": "/images/wide-guide-ip.webp",
  "/images/reference-style/resource-banner.webp": "/images/wide-resource-banner.webp",
  "/images/reference-style/story-factory.webp": "/images/wide-story-factory.webp",
  "/images/reference-style/story-custom.webp": "/images/wide-story-custom.webp",
  "/images/reference-style/detail-flow.webp": "/images/wide-detail-flow.webp",
  "/images/reference-style/detail-level.webp": "/images/wide-detail-level.webp",
};

export function wideImageFor(src: string): string | undefined {
  return wide[src];
}
