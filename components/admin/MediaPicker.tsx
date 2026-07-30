"use client";

import { createPortal } from "react-dom";

import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

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

type VariantName =
  | "original"
  | "hero"
  | "card"
  | "thumbnail";

const variantOptions: VariantName[] = [
  "original",
  "hero",
  "card",
  "thumbnail",
];

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

function getVariantUrl(
  item: MediaAssetItem,
  variant: VariantName,
) {
  if (variant === "original") {
    return item.url;
  }

  const selected = item.variants?.find(
    (entry) =>
      entry.name.toLowerCase() === variant.toLowerCase(),
  );

  return selected?.url || item.url;
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
  const [selectedItem, setSelectedItem] =
    useState<MediaAssetItem | null>(null);
  const [selectedVariant, setSelectedVariant] =
    useState<VariantName>("original");

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const imageUrl = getAssetUrl(value);

  const loadMedia = useCallback(async () => {
    const token = getAdminToken();

    if (!token) {
      setMessage("Admin token not found.");
      return;
    }

    setLoading(true);

    try {
      const data = await getAdminMediaAssets(token);

      setItems(
        data.filter(
          (item) => item.type === "IMAGE",
        ),
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed loading media.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      void loadMedia();
    }
  }, [open, loadMedia]);

  const filteredItems = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    if (!keyword) {
      return items;
    }

    return items.filter((item) =>
      [
        item.filename,
        item.originalName,
        item.caption,
        item.altText,
        item.folder,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [items, search]);
  const handleUpload = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0] || null;

    event.target.value = "";

    if (!file) return;

    const token = getAdminToken();

    if (!token) {
      setMessage("Admin token not found.");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const uploaded =
        await uploadAdminMediaAsset(
          token,
          file,
          folder || "general",
        );

      setItems((current) => [
        uploaded,
        ...current,
      ]);

      setSelectedItem(uploaded);
      setSelectedVariant("original");

      onChange(uploaded.url);

      setMessage(
        "Image uploaded and selected.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Upload failed.",
      );
    } finally {
      setUploading(false);
    }
  };


  const confirmSelection = () => {
    if (!selectedItem) return;

    const url = getVariantUrl(
      selectedItem,
      selectedVariant,
    );

    onChange(url);

    setOpen(false);
    setSelectedItem(null);
    setSearch("");

    setMessage(
      `Selected ${selectedVariant} image.`,
    );
  };


  const selectedPreview = selectedItem
    ? getAssetUrl(
        getVariantUrl(
          selectedItem,
          selectedVariant,
        ),
      )
    : "";


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

          <p className="mt-2 text-sm leading-6 text-black/45">
            {description}
          </p>
        </div>

        <span className="rounded-full bg-[#eaf8f0] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#039147]">
          Folder: {folder}
        </span>
      </div>


      <div className="mt-5 overflow-hidden rounded-[24px] border border-black/5 bg-[#f6faf7]">

        {imageUrl ? (
          <div className="relative h-72 w-full">
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex h-72 items-center justify-center text-sm font-black text-black/40">
            No image selected
          </div>
        )}

      </div>


      {value ? (
        <div className="mt-3 rounded-2xl bg-[#f6faf7] p-4">
          <p className="break-all text-xs font-bold text-black/40">
            {value}
          </p>
        </div>
      ) : null}


      <div className="mt-5 flex flex-wrap gap-3">

        <label className="cursor-pointer rounded-full bg-[#039147] px-6 py-3 text-sm font-black text-white">
          {uploading
            ? "Uploading..."
            : "Upload Image"}

          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>


        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full border border-black/10 px-6 py-3 text-sm font-black text-black hover:border-[#039147] hover:text-[#039147]"
        >
          Browse Media Library
        </button>


        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="rounded-full border border-red-200 bg-red-50 px-6 py-3 text-sm font-black text-red-600"
          >
            Remove
          </button>
        ) : null}

      </div>
      {message ? (
        <div className="mt-4 rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-bold text-black/60">
          {message}
        </div>
      ) : null}


      {open && typeof window !== "undefined"
        ? createPortal(
        <div
          className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setOpen(false);
            }
          }}
        >

          <div className="flex h-[720px] w-full max-w-5xl flex-col overflow-hidden rounded-[32px] bg-white shadow-[0_30_100px_rgba(0,0,0,0.35)]">

            <div className="flex items-center justify-between border-b border-black/5 p-6">

              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                  Media Library
                </p>

                <h2 className="mt-2 text-3xl font-black text-black">
                  Select Image
                </h2>
              </div>


              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-xl font-black"
              >
                ×
              </button>

            </div>


            <div className="grid min-h-0 flex-1 lg:grid-cols-[1fr_360px]">


              <div className="overflow-y-auto p-6">

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search media..."
                  className="mb-6 h-12 w-full rounded-2xl border border-black/10 bg-[#f6faf7] px-4 text-sm font-bold outline-none focus:border-[#039147]"
                />


                {loading ? (
                  <div className="py-20 text-center text-sm font-black text-black/40">
                    Loading media...
                  </div>
                ) : null}


                {!loading ? (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

                    {filteredItems.map((item) => (

                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedItem(item);
                          setSelectedVariant("original");
                        }}
                        className={`overflow-hidden rounded-[24px] border text-left transition ${
                          selectedItem?.id === item.id
                            ? "border-[#039147] shadow-[0_18px_40px_rgba(3,145,71,0.15)]"
                            : "border-black/5 hover:border-[#039147]/40"
                        }`}
                      >

                        <div className="relative h-40 bg-[#f6faf7]">

                          <img
                            src={getAssetUrl(item.url)}
                            alt={
                              item.altText ||
                              item.filename
                            }
                            className="h-full w-full object-cover"
                          />

                        </div>


                        <div className="p-4">

                          <p className="line-clamp-1 text-sm font-black text-black">
                            {item.originalName ||
                              item.filename}
                          </p>


                          <p className="mt-2 text-xs font-bold uppercase text-black/40">
                            {item.folder || "general"}
                          </p>

                        </div>

                      </button>

                    ))}

                  </div>
                ) : null}

              </div>



              <div className="border-t border-black/5 bg-[#f6faf7] p-6 lg:border-l lg:border-t-0">


                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                  Preview
                </p>


                {selectedItem ? (

                  <>

                    <div className="mt-4 overflow-hidden rounded-[24px] bg-white">

                      <div className="relative h-64">

                        <img
                          src={selectedPreview}
                          alt="Selected preview"
                          className="h-full w-full object-cover"
                        />

                      </div>

                    </div>


                    <p className="mt-4 break-all text-sm font-black text-black">
                      {selectedItem.originalName ||
                        selectedItem.filename}
                    </p>



                    <div className="mt-5 flex flex-wrap gap-2">

                      {variantOptions.map(
                        (variant) => (

                          <button
                            key={variant}
                            type="button"
                            onClick={() =>
                              setSelectedVariant(
                                variant,
                              )
                            }
                            className={`rounded-full px-4 py-2 text-xs font-black ${
                              selectedVariant === variant
                                ? "bg-[#039147] text-white"
                                : "bg-white text-black/50"
                            }`}
                          >
                            {variant}
                          </button>

                        ),
                      )}

                    </div>



                    <button
                      type="button"
                      onClick={confirmSelection}
                      className="mt-6 w-full rounded-full bg-[#039147] px-6 py-3.5 text-sm font-black text-white"
                    >
                      Use This Image
                    </button>

                  </>

                ) : (

                  <div className="flex h-full min-h-64 items-center justify-center text-center text-sm font-black text-black/40">
                    Select an image to preview
                  </div>

                )}

              </div>


            </div>

          </div>

        </div>
      , document.body)
        : null}

    </section>
  );
}
