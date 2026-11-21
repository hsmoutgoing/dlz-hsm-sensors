import Image from "next/image";
import { wideImageFor } from "@/lib/wide-images";

interface MediaFrameProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  /** Use the original framing in slots that may be taller than they are wide. */
  preserveFraming?: boolean;
  /** Layout classes for the positioning box (aspect ratio / min-height). */
  className?: string;
}

/**
 * Frame for the square 1:1 studio renders.
 *
 * The renders are square but most layouts are 16:9 or 1.9:1, and cropping a
 * square to fill a wide box cuts the instrument in half. Two fits keep it
 * whole, matching the reference site's wider, smaller-on-frame photography:
 *
 *  - a 2:1 companion in `lib/wide-images` fills the box; its extra width is
 *    soft studio floor, so cropping it costs nothing.
 *  - otherwise the square file is drawn whole (`contain`) over a blurred,
 *    over-scaled copy of itself, so the margins carry its own colours.
 */
export function MediaFrame({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
  preserveFraming = false,
}: MediaFrameProps) {
  const wideSrc = preserveFraming ? undefined : wideImageFor(src);
  if (wideSrc) {
    return (
      <div className={`media-frame media-frame-wide ${className}`.trim()}>
        <Image
          src={wideSrc}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="media-frame-image"
        />
      </div>
    );
  }

  // Catalogue cut-outs on white and line drawings must not sit on a colour
  // wash; only the studio scenes get the blurred continuation.
  const plain = src.startsWith("/images/products/");

  return (
    <div className={`media-frame${plain ? " media-frame-plain" : ""} ${className}`.trim()}>
      {!plain && (
        <Image
          src={src}
          alt=""
          aria-hidden="true"
          fill
          sizes={sizes}
          priority={priority}
          className="media-frame-backdrop"
        />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="media-frame-image"
      />
    </div>
  );
}
