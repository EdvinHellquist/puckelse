import Image from "next/image";
import { cn } from "@workspace/ui/lib/utils";
import {
  processImageData,
  sanityCdnUrlFromId,
  type SanityImageProps,
} from "@workspace/sanity/image";

type Props = SanityImageProps & {
  width?: number;
  height?: number;
  fill?: boolean;
  quality?: number;
  fit?: "crop" | "clip" | "fill" | "max" | "min" | "scale";
};

export function SanityImage({
  image,
  alt,
  className,
  width,
  height,
  fill,
  quality = 80,
  fit = "max",
  ...rest
}: Props) {
  const processed = processImageData(image);
  if (!processed) return null;

  const src = sanityCdnUrlFromId(processed.id, {
    w: width,
    h: height,
    q: quality,
    fit,
  });

  if (!src) return null;

  const finalAlt = alt ?? processed.alt ?? "image";

  // If fill -> parent must be relative + have height
  if (fill) {
    return (
      <Image
        src={src}
        alt={finalAlt}
        fill
        className={cn("object-cover", className)}
        sizes="100vw"
        {...rest}
      />
    );
  }

  const w = width ?? 1600;
  const h = height ?? 900;

  return (
    <Image
      src={src}
      alt={finalAlt}
      width={w}
      height={h}
      className={cn("h-auto w-full object-cover", className)}
      {...rest}
    />
  );
}
