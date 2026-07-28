"use client";

import Image from "next/image";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  MediaAssetItem,
  getAdminMediaAssets,
  getAdminToken,
  uploadAdminMediaAsset,
} from "@/lib/admin-api";

type MediaPickerProps = {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  title?: string;
  description?: string;
};

function getAssetUrl(value: string) {
  if (!value) return "";

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:")
  ) {
    return value;
  }

  if (value.startsWith("/uploads")) {
    const apiOrigin =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
      (process.env.NODE_ENV === "development"
        ? "http://localhost:4000"
        : "");

    return `${apiOrigin}${value}`;
  }

  return value;
}

export default function MediaPicker({
  value,
  onChange,
  folder = "general",
  title = "Featured Image",
  description = "Upload a new image or choose an existing asset from the media library.",
}: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaAssetItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const loadMedia = useCallback(async () => {
    const token = getAdminToken();

    if (!token) {
      setMessage("Admin token not found. Please login again.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const data = await getAdminMediaAssets(token);

      setItems(data.filter((item) => item.type === "IMAGE"));
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to load media library.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    void loadMedia();
  }, [open, loadMedia]);

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return items;

    return items.filter((item) => {
      const searchableText = [
        item.originalName,
        item.filename,
        item.altText,
        item.caption,
        item.folder,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(keyword);
    });
  }, [items, search]);

  const handleUpload = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] || null;
    event.target.value = "";

    if (!file) return;

    const token = getAdminToken();

    if (!token) {
      setMessage("Admin token not found. Please login again.");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const uploaded = await uploadAdminMediaAsset(
        token,
        file,
        folder || "general",
      );

      onChange(uploaded.url);
      setItems((current) => [uploaded, ...current]);
      setMessage("Image uploaded and selected successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to upload image.",
      );
    } finally {
      setUploading(false);
    }
  };

  const selectMedia = (item: MediaAssetItem) => {
    onChange(item.url);
    setOpen(false);
    setSearch("");
    setMessage("Image selected from media library.");
  };

  const imageUrl = getAssetUrl(value);

  return (
    <section className="rounded-[30px] border border-black/5 bg-white p-5 shadow-[0_18px_60px_rgba(0,0,0,0.06)] md:p-6">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
            Media
          </p>

          <h3 className="mt-2 text-xl font-black text-black">
            {title}
          </h3>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/45">
            {description}
          </p>
        </div>

        <span className="w-fit rounded-full bg-[#eaf8f0] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#039147]">
          Folder: {folder}
        </span>
      </div>

      <div className="mt-5 overflow-hidden rounded-[24px] border border-black/5 bg-[#f6faf7]">
        {imageUrl ? (
          <div className="relative h-64 w-full md:h-80">
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 900px"
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center px-6 text-center md:h-80">
            <div>
              <p className="text-sm font-black text-black/40">
                No image selected
              </p>

              <p className="mt-2 text-xs leading-5 text-black/30">
                Upload a new image or choose one from the media library.
              </p>
            </div>
          </div>
        )}
      </div>

      {value ? (
        <div className="mt-3 rounded-2xl border border-black/5 bg-[#f6faf7] px-4 py-3">
          <p className="break-all text-xs font-semibold text-black/45">
            {value}
          </p>
        </div>
      ) : null}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[#039147] px-6 py-3 text-sm font-black text-white shadow-[0_14px_40px_rgba(3,145,71,0.2)] transition hover:-translate-y-0.5">
          {uploading ? "Uploading Image..." : "Upload New Image"}

          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            disabled={uploading}
            onChange={handleUpload}
            className="sr-only"
          />
        </label>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-black text-black transition hover:border-[#039147] hover:text-[#039147]"
        >
          Browse Media Library
        </button>

        {value ? (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setMessage("Image removed from this content.");
            }}
            className="rounded-full border border-red-200 bg-red-50 px-6 py-3 text-sm font-black text-red-600 transition hover:bg-red-600 hover:text-white"
          >
            Remove Image
          </button>
        ) : null}
      </div>

      <div className="mt-5 rounded-2xl bg-[#f6faf7] p-4 text-xs leading-5 text-black/45">
        Recommended size: <strong>1920 × 1080 px</strong>.
        Supported formats: JPG, PNG, and WEBP.
      </div>

      {message ? (
        <div className="mt-4 rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-bold text-black/60">
          {message}
        </div>
      ) : null}

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-[30px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.3)]">
            <div className="flex items-start justify-between gap-4 border-b border-black/5 p-5 md:p-7">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                  Media Library
                </p>

                <h2 className="mt-2 text-2xl font-black text-black">
                  Choose an Image
                </h2>

                <p className="mt-2 text-sm text-black/45">
                  Select an existing image to use for this content.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-lg font-black text-black transition hover:bg-black hover:text-white"
                aria-label="Close media library"
              >
                ×
              </button>
            </div>

            <div className="border-b border-black/5 p-5 md:px-7">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by filename, folder, caption, or alt text..."
                className="h-12 w-full rounded-2xl border border-black/10 bg-[#f6faf7] px-4 text-sm font-bold text-black outline-none transition placeholder:text-black/30 focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
              />
            </div>

            <div className="overflow-y-auto p-5 md:p-7">
              {loading ? (
                <div className="flex min-h-64 items-center justify-center text-sm font-black text-black/40">
                  Loading media library...
                </div>
              ) : null}

              {!loading && filteredItems.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectMedia(item)}
                      className="group overflow-hidden rounded-[22px] border border-black/5 bg-white text-left transition hover:-translate-y-1 hover:border-[#039147] hover:shadow-[0_18px_50px_rgba(0,0,0,0.1)]"
                    >
                      <div className="relative h-40 bg-[#f6faf7]">
                        <Image
                          src={getAssetUrl(item.url)}
                          alt={
                            item.altText ||
                            item.originalName ||
                            item.filename
                          }
                          fill
                          sizes="280px"
                          className="object-cover transition duration-500 group-hover:scale-105"
                          unoptimized
                        />
                      </div>

                      <div className="p-4">
                        <p className="line-clamp-1 text-sm font-black text-black">
                          {item.originalName || item.filename}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.1em] text-black/40">
                          <span>{item.folder || "general"}</span>
                          <span>•</span>
                          <span>{item.type}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : null}

              {!loading && filteredItems.length === 0 ? (
                <div className="flex min-h-64 items-center justify-center rounded-[24px] border border-dashed border-black/10 bg-[#f6faf7] px-6 text-center">
                  <div>
                    <p className="text-sm font-black text-black/45">
                      No matching images found
                    </p>

                    <p className="mt-2 text-xs leading-5 text-black/30">
                      Upload a new image or try another search keyword.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
