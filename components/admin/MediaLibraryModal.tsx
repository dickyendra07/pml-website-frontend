"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  MediaAssetItem,
  getAdminMediaAssets,
  getAdminToken,
} from "@/lib/admin-api";

type Props = {
  onSelect: (url: string) => void;
  onClose: () => void;
};

function getAssetUrl(value: string) {
  if (!value) return "";

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  if (value.startsWith("/uploads")) {
    const apiOrigin =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
      "http://localhost:4000";

    return `${apiOrigin}${value}`;
  }

  return value;
}

export default function MediaLibraryModal({
  onSelect,
  onClose,
}: Props) {
  const [items, setItems] = useState<MediaAssetItem[]>([]);
  const [selected, setSelected] =
    useState<MediaAssetItem | null>(null);

  const load = useCallback(async () => {
    const token = getAdminToken();

    if (!token) return;

    const data = await getAdminMediaAssets(token);

    setItems(
      data.filter((item) => item.type === "IMAGE"),
    );
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">

      <div className="flex h-[620px] w-[900px] overflow-hidden rounded-[32px] bg-white shadow-2xl">

        <div className="w-[60%] overflow-y-auto p-6">

          <div className="mb-5">
            <h2 className="text-2xl font-black text-black">
              Insert Image
            </h2>

            <p className="mt-2 text-sm font-bold text-black/40">
              Select image from PML Media Library.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelected(item)}
                className={`overflow-hidden rounded-2xl border ${
                  selected?.id === item.id
                    ? "border-[#039147]"
                    : "border-black/10"
                }`}
              >

                <div className="relative h-36">
                  <Image
                    src={getAssetUrl(item.url)}
                    alt={item.altText || item.filename}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div className="p-3 text-left">
                  <p className="line-clamp-1 text-xs font-black">
                    {item.originalName || item.filename}
                  </p>
                </div>

              </button>
            ))}

          </div>

        </div>


        <div className="w-[40%] border-l border-black/5 bg-[#f6faf7] p-6">

          <p className="text-xs font-black uppercase text-[#039147]">
            Preview
          </p>


          {selected ? (
            <>
              <div className="relative mt-5 h-72 overflow-hidden rounded-3xl bg-white">

                <Image
                  src={getAssetUrl(selected.url)}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />

              </div>


              <button
                type="button"
                onClick={() => {
                  onSelect(
                    selected.url.startsWith("http")
                      ? selected.url
                      : `http://localhost:4000${selected.url}`
                  );
                  onClose();
                }}
                className="mt-6 w-full rounded-full bg-[#039147] px-6 py-3 text-sm font-black text-white"
              >
                Insert Image
              </button>
            </>
          ) : (
            <p className="mt-10 text-sm font-bold text-black/40">
              Select image first.
            </p>
          )}


          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full rounded-full border border-black/10 px-6 py-3 text-sm font-black"
          >
            Cancel
          </button>

        </div>

      </div>

    </div>,
    document.body
  );
}
