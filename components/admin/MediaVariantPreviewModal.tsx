"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  open: boolean;
  url: string;
  name: string;
  width?: number | null;
  height?: number | null;
  onClose: () => void;
  onUse: () => void;
  onCopy: () => void;
};

function getVariantInfo(name: string) {
  const key = name.toLowerCase();

  if (key === "hero") {
    return {
      title: "Hero Banner",
      usage: "Homepage Hero & Full Width Section",
    };
  }

  if (key === "card") {
    return {
      title: "Content Card",
      usage: "Article Preview & Listing Card",
    };
  }

  if (key === "thumbnail") {
    return {
      title: "Thumbnail",
      usage: "Small Preview & Search Listing",
    };
  }

  if (key === "3-4") {
    return {
      title: "Portrait Content",
      usage: "Mobile Content & Portrait Layout",
    };
  }

  if (key === "16-9") {
    return {
      title: "Wide Banner",
      usage: "Video Banner & Landscape Section",
    };
  }

  if (key === "1-1") {
    return {
      title: "Square Content",
      usage: "Social Media & Square Layout",
    };
  }

  return {
    title: name,
    usage: "Optimized Media Variant",
  };
}


export default function MediaVariantPreviewModal({
  open,
  url,
  name,
  width,
  height,
  onClose,
  onUse,
  onCopy,
}: Props) {
  const [copied, setCopied] = useState(false);

  const variantInfo = getVariantInfo(name);

  if (!open) return null;

  const handleCopy = async () => {
    onCopy();
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-6">

      <div className="w-full max-w-3xl rounded-[32px] bg-white p-6 shadow-2xl">

        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
              Variant Preview
            </p>

            <h3 className="mt-2 text-2xl font-black">
              {variantInfo.title}
            </h3>

            <p className="mt-1 text-sm font-bold text-black/40">
              {variantInfo.usage}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-black"
          >
            Close
          </button>
        </div>


        <div className="relative h-[50vh] min-h-[300px] overflow-hidden rounded-[24px] bg-black/5">

          <Image
            src={url}
            alt={name}
            fill
            className="object-contain"
            unoptimized
          />

        </div>


        <div className="mt-5 rounded-[20px] bg-[#f6faf7] p-4 text-sm">

          <p className="text-xs font-black uppercase tracking-[0.12em] text-black/40">
            Dimensions
          </p>

          <p className="mt-1 font-black">
            {width} × {height}px
          </p>

          <p className="mt-4 text-xs font-black uppercase tracking-[0.12em] text-black/40">
            Recommended Usage
          </p>

          <p className="mt-1 font-black">
            {variantInfo.usage}
          </p>

        </div>


        <div className="mt-5 grid gap-3 sm:grid-cols-2">

          <button
            onClick={handleCopy}
            className="rounded-full border border-black/10 px-5 py-3 font-black transition hover:border-[#039147] hover:text-[#039147]"
          >
            {copied ? "✓ Copied" : "Copy URL"}
          </button>


          <button
            onClick={onUse}
            className="rounded-full bg-[#039147] px-5 py-3 font-black text-white"
          >
            Select This Variant
          </button>

        </div>

        {copied ? (
          <div className="mt-4 rounded-2xl bg-[#039147]/10 px-4 py-3 text-center text-sm font-black text-[#039147]">
            ✓ Variant URL copied successfully
          </div>
        ) : null}


      </div>

    </div>
  );
}
