import { env } from "@workspace/env/client";
import type { WrapperProps } from "sanity-image";

import type { QueryImageTypeResult } from "./sanity.types";

type SanityImageData = NonNullable<QueryImageTypeResult>;

// Types
type ImageHotspot = {
  readonly x: number;
  readonly y: number;
};

type ImageCrop = {
  readonly top: number;
  readonly bottom: number;
  readonly left: number;
  readonly right: number;
};

type ProcessedImageData = {
  readonly id: string;
  readonly alt: string;
  readonly preview?: string;
  readonly hotspot?: ImageHotspot;
  readonly crop?: ImageCrop;
};

export type SanityImageProps = {
  readonly image: SanityImageData;
} & Omit<WrapperProps<"img">, "id" | "src">;

// Base URL construction
export const SANITY_BASE_URL =
  `https://cdn.sanity.io/images/${env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${env.NEXT_PUBLIC_SANITY_DATASET}/` as const;

// Type guards
function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value);
}

function isValidHotspot(hotspot: unknown): hotspot is ImageHotspot {
  if (!hotspot || typeof hotspot !== "object") {
    return false;
  }
  const h = hotspot as Record<string, unknown>;
  return isValidNumber(h.x) && isValidNumber(h.y);
}

function isValidCrop(crop: unknown): crop is ImageCrop {
  if (!crop || typeof crop !== "object") {
    return false;
  }
  const c = crop as Record<string, unknown>;
  return (
    isValidNumber(c.top) &&
    isValidNumber(c.bottom) &&
    isValidNumber(c.left) &&
    isValidNumber(c.right)
  );
}

// Pure functions for data processing
function extractHotspot(image: SanityImageData): ImageHotspot | undefined {
  if (!isValidHotspot(image?.hotspot)) {
    return;
  }
  return {
    x: image.hotspot.x,
    y: image.hotspot.y,
  };
}

function extractCrop(image: SanityImageData): ImageCrop | undefined {
  if (!isValidCrop(image?.crop)) {
    return;
  }
  return {
    top: image.crop.top,
    bottom: image.crop.bottom,
    left: image.crop.left,
    right: image.crop.right,
  };
}

function hasPreview(preview: unknown): preview is string {
  return typeof preview === "string" && preview.length > 0;
}

// Main image processing function
export function processImageData(
  image: SanityImageData
): ProcessedImageData | null {
  // Early return for invalid image data
  if (!image?.id || typeof image.id !== "string") {
    return null;
  }

  const hotspot = extractHotspot(image);
  const crop = extractCrop(image);
  const preview = hasPreview(image.preview) ? image.preview : undefined;

  return {
    id: image.id,
    alt: image.alt,
    ...(preview && { preview }),
    ...(hotspot && { hotspot }),
    ...(crop && { crop }),
  };
}

// Converts Sanity asset id (image-<hash>-<WxH>-<ext>) to a CDN filename (<hash>-<WxH>.<ext>)
export function sanityCdnUrlFromId(
  id: string,
  options?: { w?: number; h?: number; q?: number; fit?: "crop" | "clip" | "fill" | "max" | "min" | "scale" }
) {
  // id example: "image-abc123-2000x1333-jpg"
  if (!id.startsWith("image-")) {
    return null;
  }

  const parts = id.replace("image-", "").split("-");
  if (parts.length < 3) {
    return null;
  }

  const format = parts[parts.length - 1]; // jpg/png/webp
  const dims = parts[parts.length - 2];   // 2000x1333
  const hash = parts.slice(0, -2).join("-");

  const filename = `${hash}-${dims}.${format}`;
  const url = new URL(`${SANITY_BASE_URL}${filename}`);

  if (options?.w) url.searchParams.set("w", String(options.w));
  if (options?.h) url.searchParams.set("h", String(options.h));
  if (options?.q) url.searchParams.set("q", String(options.q));
  if (options?.fit) url.searchParams.set("fit", options.fit);

  // You can add auto=format if you want:
  url.searchParams.set("auto", "format");

  return url.toString();
}

