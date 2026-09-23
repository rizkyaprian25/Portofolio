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
 * SafeImage — Komponen Gambar Defensif Next.js
 * Berpijak pada Apple Human Interface Guidelines:
 * - Menangani kegagalan jaringan eksternal, token kedaluwarsa (403), atau link rusak (404) secara elegan.
 * - Tidak pernah merusak tata letak dengan ikon gambar pecah; menyajikan kapsul cadangan minimalis.
 * - Menerapkan ukuran gambar responsif dan mencegah layout shift.
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

  // Setel ulang status error jika sumber gambar berubah
  useEffect(() => {
    setHasError(false);
  }, [src]);

  // Jika sumber gambar tidak tersedia atau gagal dimuat
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
