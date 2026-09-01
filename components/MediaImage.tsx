"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

import {
  resolveMediaUrl,
  shouldBypassImageOptimization,
  type MediaSource,
} from "@/lib/media";

type MediaImageProps = Omit<ImageProps, "src"> & {
  src: MediaSource;
  fallbackSrc?: string;
};

export default function MediaImage({
  src,
  alt,
  fallbackSrc = "/images/pml/cta-lab-background.png",
  unoptimized,
  onError,
  ...props
}: MediaImageProps) {
  const resolvedSource = resolveMediaUrl(src);
  const [failedSource, setFailedSource] = useState("");
  const source =
    resolvedSource && failedSource !== resolvedSource
      ? resolvedSource
      : fallbackSrc;

  return (
    <Image
      {...props}
      src={source}
      alt={alt}
      unoptimized={
        unoptimized ?? shouldBypassImageOptimization(source)
      }
      onError={(event) => {
        if (resolvedSource && source === resolvedSource) {
          setFailedSource(resolvedSource);
        }

        onError?.(event);
      }}
    />
  );
}
