"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { ImageOff } from "lucide-react";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackText?: string;
  fallbackIcon?: React.ReactNode;
  fallbackClassName?: string;
}

/**
 * SafeImage — Defensive Next.js Image Component
 * Grounded in Apple Human Interface Guidelines:
 * - Gracefully handles upstream network failures, expired tokens (403), or broken links (404).
 * - Never breaks layout with broken image icons; presents a serene, minimalist fallback capsule.
 * - Enforces responsive image sizing and avoids layout shifts.
 */
export default function SafeImage({
  src,
  alt,
  fill,
  width,
  height,
  sizes,
  className,
  priority,
  fallbackText = "Pratinjau tidak tersedia",
  fallbackIcon,
  fallbackClassName,
  ...rest
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  // Reset error state if source changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  // If no source provided or failed to load
  if (!src || hasError) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center bg-black/5 dark:bg-white/5 text-apple-secondary dark:text-apple-secondary-dark p-3 text-center select-none transition-colors ${
          fallbackClassName || ""
        }`}
      >
        <div className="mb-1 opacity-60">
          {fallbackIcon || <ImageOff className="w-4 h-4" />}
        </div>
        <span className="text-[11px] font-medium leading-tight line-clamp-2 max-w-[85%]">
          {alt || fallbackText}
        </span>
        <span className="text-[9px] opacity-60 mt-0.5">{fallbackText}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt || "Image"}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      sizes={sizes}
      className={className}
      priority={priority}
      onError={() => setHasError(true)}
      {...rest}
    />
  );
}
