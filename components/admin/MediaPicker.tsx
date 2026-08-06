"use client";

import Image from "next/image";
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import MediaCropModal, {
  MediaCropPayload,
} from "@/components/admin/MediaCropModal";
import {
  MediaAssetItem,
  MediaVariantItem,
  cropAdminMediaAsset,
  getAdminMediaAssets,
  getAdminToken,
  updateAdminMediaAsset,
  uploadAdminMediaAsset,
} from "@/lib/admin-api";
import {
  MediaReference,
  MediaVariantName,
  createMediaReference,
  resolveMediaUrl,
} from "@/lib/media";

export type MediaPickerVariant =
  | "original"
  | "hero"
  | "card"
  | "thumbnail";

type MediaPickerProps = {
  value: string;
  onChange: (url: string) => void;
  onReferenceChange?: (reference: MediaReference | null) => void;
  folder?: string;
  title?: string;
  description?: string;
  defaultVariant?: MediaPickerVariant;
  dialogOnly?: boolean;
  dialogTitle?: string;
  confirmLabel?: string;
  onDismiss?: () => void;
};

type VariantOption = {
  value: MediaPickerVariant;
  label: string;
  description: string;
};

const variantOptions: VariantOption[] = [
  {
    value: "original",
    label: "Original",
    description: "Full-resolution source",
  },
  {
    value: "hero",
    label: "Hero Banner",
    description: "1600 × 900",
  },
  {
    value: "card",
    label: "Card Image",
    description: "900 × 600",
  },
  {
    value: "thumbnail",
    label: "Thumbnail",
    description: "400 × 400",
  },
];

function getVariant(
  item: MediaAssetItem,
  variant: MediaVariantName,
): MediaVariantItem | null {
  if (variant === "original") return null;

  return (
    item.variants?.find(
      (entry) => entry.name.toLowerCase() === variant.toLowerCase(),
    ) || null
  );
}

function getVariantDetails(
  item: MediaAssetItem,
  variant: MediaVariantName,
) {
  const mediaVariant = getVariant(item, variant);

  return {
    url: mediaVariant?.url || item.url,
    width: mediaVariant?.width ?? item.width,
    height: mediaVariant?.height ?? item.height,
    variant: (mediaVariant ? mediaVariant.name : "original") as MediaVariantName,
  };
}

function getInitialVariant(
  item: MediaAssetItem,
  preferred: MediaPickerVariant,
): MediaVariantName {
  if (preferred === "original") return "original";

  return getVariant(item, preferred) ? preferred : "original";
}

function findAssetSelection(items: MediaAssetItem[], value: string) {
  if (!value) return null;

  const resolvedValue = resolveMediaUrl(value);

  for (const item of items) {
    if (resolveMediaUrl(item.url) === resolvedValue) {
      return { item, variant: "original" as MediaVariantName };
    }

    const variant = item.variants?.find(
      (entry) => resolveMediaUrl(entry.url) === resolvedValue,
    );

    if (variant) {
      return { item, variant: variant.name as MediaVariantName };
    }
  }

  return null;
}

function formatBytes(value: number | null) {
  if (!value) return "Size unavailable";

  if (value < 1024 * 1024) {
    return `${Math.max(1, Math.round(value / 1024))} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function filenameFromUrl(value: string) {
  const cleanValue = value.split("?")[0];
  return decodeURIComponent(cleanValue.split("/").pop() || "Selected image");
}

export default function MediaPicker({
  value,
  onChange,
  onReferenceChange,
  folder = "general",
  title = "Featured Image",
  description = "Upload a new image, choose an existing asset, or keep a manual URL.",
  defaultVariant = "original",
  dialogOnly = false,
  dialogTitle = "Select Media",
  confirmLabel = "Use This Image",
  onDismiss,
}: MediaPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(dialogOnly);
  const [items, setItems] = useState<MediaAssetItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MediaAssetItem | null>(null);
  const [selectedVariant, setSelectedVariant] =
    useState<MediaVariantName>(defaultVariant);
  const [cropItem, setCropItem] = useState<MediaAssetItem | null>(null);

  const [search, setSearch] = useState("");
  const [activeFolder, setActiveFolder] = useState("all");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [processingCrop, setProcessingCrop] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [failedImageUrl, setFailedImageUrl] = useState("");
  const [failedModalUrl, setFailedModalUrl] = useState("");
  const [failedAssetIds, setFailedAssetIds] = useState<string[]>([]);
  const [metadataOpen, setMetadataOpen] = useState(false);
  const [editingMetadata, setEditingMetadata] = useState(false);
  const [savingMetadata, setSavingMetadata] = useState(false);

  const [metadataForm, setMetadataForm] = useState({
    title: "",
    altText: "",
    description: "",
    caption: "",
    tags: "",
  });

  const imageUrl = resolveMediaUrl(value);
  const imageUnavailable = Boolean(imageUrl && failedImageUrl === imageUrl);
  const currentSelection = useMemo(
    () => findAssetSelection(items, value),
    [items, value],
  );

  const folders = useMemo(() => {
    return Array.from(
      new Set(items.map((item) => item.folder || "general")),
    ).sort((first, second) => first.localeCompare(second));
  }, [items]);

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return items.filter((item) => {
      const folderMatches =
        activeFolder === "all" ||
        (item.folder || "general").toLowerCase() === activeFolder;
      const searchMatches =
        !keyword ||
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
          .includes(keyword);

      return folderMatches && searchMatches;
    });
  }, [activeFolder, items, search]);

  const selectedDetails = selectedItem
    ? getVariantDetails(selectedItem, selectedVariant)
    : null;
  const selectedPreview = selectedDetails
    ? resolveMediaUrl(selectedDetails.url)
    : "";
  const selectedPreviewUnavailable = Boolean(
    selectedPreview && failedModalUrl === selectedPreview,
  );

  const loadMedia = useCallback(async () => {
    const token = getAdminToken();

    if (!token) {
      setErrorMessage("Your admin session has expired. Please sign in again.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const data = await getAdminMediaAssets(token);
      const imageItems = data.filter((item) => item.type === "IMAGE");
      const matched = findAssetSelection(imageItems, value);

      setItems(imageItems);

      if (matched) {
        setSelectedItem(matched.item);
        setSelectedVariant(matched.variant);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The media library could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [value]);

  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => {
      void loadMedia();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadMedia, open]);

  useEffect(() => {
    if (!open && !cropItem) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      if (cropItem) {
        setCropItem(null);
      } else {
        setOpen(false);
        onDismiss?.();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [cropItem, onDismiss, open]);

  const emitReference = (reference: MediaReference | null) => {
    onChange(reference?.url || "");
    onReferenceChange?.(reference);
    setFailedImageUrl("");
  };

  const applyAssetReference = (
    item: MediaAssetItem,
    variant: MediaVariantName,
  ) => {
    const details = getVariantDetails(item, variant);
    const reference = createMediaReference(details.url, {
      mediaId: item.id,
      variant: details.variant,
    });

    emitReference(reference);
  };

  const closeLibrary = () => {
    setOpen(false);
    setSearch("");
    setActiveFolder("all");
    setFailedModalUrl("");
    setEditingMetadata(false);
    onDismiss?.();
  };


  const startMetadataEdit = () => {
    if (!selectedItem) return;

    setMetadataForm({
      title: selectedItem.title || "",
      altText: selectedItem.altText || "",
      description: selectedItem.description || "",
      caption: selectedItem.caption || "",
      tags: (selectedItem.tags || []).join(", "),
    });

    setEditingMetadata(true);
  };


  const saveMetadataEdit = async () => {
    if (!selectedItem) return;

    const token = getAdminToken();

    if (!token) {
      setErrorMessage("Your admin session has expired. Please sign in again.");
      return;
    }

    setSavingMetadata(true);

    try {
      const updated = await updateAdminMediaAsset(
        token,
        selectedItem.id,
        {
          title: metadataForm.title,
          altText: metadataForm.altText,
          description: metadataForm.description,
          caption: metadataForm.caption,
          tags: metadataForm.tags
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        },
      );

      setSelectedItem(updated);
      setEditingMetadata(false);
      setMessage("Metadata updated successfully.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to update metadata.",
      );
    } finally {
      setSavingMetadata(false);
    }
  };


  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    event.target.value = "";

    if (!file) return;

    const token = getAdminToken();

    if (!token) {
      setErrorMessage("Your admin session has expired. Please sign in again.");
      return;
    }

    setUploading(true);
    setMessage("");
    setErrorMessage("");

    try {
      const uploaded = await uploadAdminMediaAsset(token, file, folder);
      const variant = getInitialVariant(uploaded, defaultVariant);

      setItems((current) => [
        uploaded,
        ...current.filter((item) => item.id !== uploaded.id),
      ]);
      setSelectedItem(uploaded);
      setSelectedVariant(variant);
      if (!dialogOnly) {
        applyAssetReference(uploaded, variant);
      }
      setMessage(
        dialogOnly
          ? "Image uploaded to the Media Library. Review it, then insert it."
          : "Image uploaded to the Media Library and selected.",
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Image upload failed.",
      );
    } finally {
      setUploading(false);
    }
  };

  const confirmSelection = () => {
    if (!selectedItem) return;

    applyAssetReference(selectedItem, selectedVariant);
    closeLibrary();
    setMessage("Media reference saved to this field.");
  };

  const handleCropSave = async (payload: MediaCropPayload) => {
    if (!cropItem) return;

    const token = getAdminToken();

    if (!token) {
      setErrorMessage("Your admin session has expired. Please sign in again.");
      return;
    }

    setProcessingCrop(true);
    setErrorMessage("");

    try {
      const createdVariant = await cropAdminMediaAsset(
        token,
        cropItem.id,
        payload,
      );
      const updatedItem = {
        ...cropItem,
        variants: [
          ...(cropItem.variants || []).filter(
            (variant) => variant.id !== createdVariant.id,
          ),
          createdVariant,
        ],
      };

      setItems((current) =>
        current.map((item) =>
          item.id === updatedItem.id ? updatedItem : item,
        ),
      );
      setSelectedItem(updatedItem);
      setSelectedVariant(createdVariant.name as MediaVariantName);
      setCropItem(null);
      setMessage("Custom crop created and selected as a new variant.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "The crop variant could not be created.",
      );
    } finally {
      setProcessingCrop(false);
    }
  };

  const currentFilename = currentSelection
    ? currentSelection.item.filename || currentSelection.item.originalName
    : filenameFromUrl(value);
  const currentDetails = currentSelection
    ? getVariantDetails(currentSelection.item, currentSelection.variant)
    : null;

  return (
    <section
      className={`${dialogOnly ? "hidden" : ""} rounded-[30px] border border-black/5 bg-white p-5 shadow-[0_18px_60px_rgba(0,0,0,0.06)] md:p-6`}
    >
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
            Media
          </p>
          <h3 className="mt-2 text-xl font-black text-black">{title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/45">
            {description}
          </p>
        </div>

        <span className="w-fit rounded-full bg-[#eaf8f0] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#039147]">
          Folder: {folder}
        </span>
      </div>

      <div
        className={`mt-5 overflow-hidden rounded-[24px] border bg-[#f6faf7] transition ${
          imageUrl && !imageUnavailable
            ? "border-[#039147]/30"
            : "border-black/5"
        }`}
      >
        {imageUrl && !imageUnavailable ? (
          <div className="relative h-72 w-full bg-[#edf4ef]">
            <Image
              key={imageUrl}
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 900px"
              className="object-cover"
              unoptimized
              onError={() => setFailedImageUrl(imageUrl)}
            />
            <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-[#039147] px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-lg">
              <span aria-hidden="true">✓</span>
              Selected
            </div>
          </div>
        ) : imageUnavailable ? (
          <div className="flex h-72 items-center justify-center p-8 text-center">
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl text-red-500">
                !
              </div>
              <p className="mt-4 text-sm font-black text-black">
                Image file unavailable
              </p>
              <p className="mt-2 text-xs leading-5 text-black/40">
                The saved reference exists, but the image file cannot be loaded.
              </p>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="mt-4 rounded-full border border-[#039147]/25 bg-white px-5 py-2.5 text-xs font-black text-[#039147]"
              >
                Replace Image
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-72 items-center justify-center p-8 text-center">
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl text-[#039147] shadow-sm">
                +
              </div>
              <p className="mt-4 text-sm font-black text-black/45">
                No image selected
              </p>
              <p className="mt-2 text-xs text-black/30">
                Upload or select an image to create a media reference.
              </p>
            </div>
          </div>
        )}
      </div>

      {value ? (
        <div className="mt-3 grid gap-3 rounded-2xl bg-[#f6faf7] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-black">
              {currentFilename}
            </p>
            <p className="mt-1 text-xs font-semibold text-black/40">
              {currentDetails?.width && currentDetails.height
                ? `${currentDetails.width} × ${currentDetails.height}px · ${currentDetails.variant}`
                : "Manual or legacy media reference"}
            </p>
          </div>
          <span className="w-fit rounded-full bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#039147]">
            {currentDetails?.variant || "URL"}
          </span>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="rounded-full bg-[#039147] px-6 py-3 text-sm font-black text-white shadow-[0_14px_32px_rgba(3,145,71,0.18)] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60"
        >
          {uploading ? "Uploading Image…" : value ? "Change Image" : "Upload Image"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full border border-black/10 px-6 py-3 text-sm font-black text-black transition hover:border-[#039147] hover:text-[#039147]"
        >
          Browse Media Library
        </button>

        {currentSelection ? (
          <button
            type="button"
            onClick={() => setCropItem(currentSelection.item)}
            className="rounded-full border border-black/10 px-6 py-3 text-sm font-black text-black transition hover:border-[#039147] hover:text-[#039147]"
          >
            Edit Crop
          </button>
        ) : null}

        {value ? (
          <button
            type="button"
            onClick={() => emitReference(null)}
            className="rounded-full border border-red-200 bg-red-50 px-6 py-3 text-sm font-black text-red-600 transition hover:bg-red-600 hover:text-white"
          >
            Remove Image
          </button>
        ) : null}
      </div>

      {uploading ? (
        <div className="mt-4 overflow-hidden rounded-full bg-[#eaf8f0]">
          <div className="h-1.5 w-2/3 animate-pulse rounded-full bg-[#039147]" />
        </div>
      ) : null}

      <div className="mt-5 rounded-[22px] border border-black/5 bg-[#fbfdfb] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black text-black">Manual URL</p>
            <p className="mt-1 text-xs text-black/40">
              Kept for legacy content and externally hosted images.
            </p>
          </div>
          <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-black/35">
            Optional
          </span>
        </div>
        <input
          value={value}
          onChange={(event) =>
            emitReference(createMediaReference(event.target.value))
          }
          placeholder="https://… or /images/…"
          className="mt-3 h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm font-bold text-black outline-none transition placeholder:text-black/20 focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
        />
      </div>

      {message ? (
        <div className="mt-4 rounded-2xl border border-[#039147]/15 bg-[#eaf8f0] px-4 py-3 text-sm font-bold text-[#02783b]">
          {message}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-6"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) closeLibrary();
              }}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Select media"
                className="flex h-[min(820px,94vh)] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:rounded-[34px]"
              >
                <div className="flex items-center justify-between gap-4 border-b border-black/5 px-5 py-5 sm:px-7">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                      Media Library
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-black sm:text-3xl">
                      {dialogTitle}
                    </h2>
                    <p className="mt-1 text-xs font-semibold text-black/40 sm:text-sm">
                      Choose an asset and the best variant for this placement.
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="hidden rounded-full bg-[#039147] px-5 py-3 text-xs font-black text-white shadow-[0_10px_24px_rgba(3,145,71,0.18)] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60 sm:inline-flex"
                    >
                      {uploading ? "Uploading…" : "Upload Image"}
                    </button>
                    <button
                      type="button"
                      onClick={closeLibrary}
                      aria-label="Close media library"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 text-xl font-black transition hover:border-[#039147] hover:text-[#039147]"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_380px]">
                  <div className="flex min-h-0 flex-col">
                    <div className="border-b border-black/5 px-5 py-4 sm:px-7">
                      <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/30">
                          ⌕
                        </span>
                        <input
                          value={search}
                          onChange={(event) => setSearch(event.target.value)}
                          placeholder="Search filename, caption, or folder…"
                          className="h-12 w-full rounded-2xl border border-black/10 bg-[#f6faf7] pl-10 pr-4 text-sm font-bold outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                        />
                      </div>

                      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                        {["all", ...folders].map((folderOption) => (
                          <button
                            key={folderOption}
                            type="button"
                            onClick={() => setActiveFolder(folderOption)}
                            className={`shrink-0 rounded-full px-4 py-2 text-xs font-black capitalize transition ${
                              activeFolder === folderOption
                                ? "bg-[#039147] text-white shadow-[0_8px_20px_rgba(3,145,71,0.18)]"
                                : "border border-black/8 bg-white text-black/45 hover:border-[#039147]/30 hover:text-[#039147]"
                            }`}
                          >
                            {folderOption === "all" ? "All Media" : folderOption}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
                      {loading ? (
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                          {Array.from({ length: 6 }).map((_, index) => (
                            <div
                              key={index}
                              className="overflow-hidden rounded-[24px] border border-black/5 bg-white"
                            >
                              <div className="h-40 animate-pulse bg-[#edf4ef]" />
                              <div className="space-y-2 p-4">
                                <div className="h-3 w-3/4 animate-pulse rounded-full bg-black/8" />
                                <div className="h-3 w-1/2 animate-pulse rounded-full bg-black/5" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {!loading && filteredItems.length === 0 ? (
                        <div className="flex min-h-72 items-center justify-center rounded-[26px] border border-dashed border-black/10 bg-[#f8fbf9] p-8 text-center">
                          <div>
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl text-[#039147] shadow-sm">
                              ⌕
                            </div>
                            <p className="mt-4 text-sm font-black text-black">
                              No matching media
                            </p>
                            <p className="mt-2 text-xs leading-5 text-black/40">
                              Try another keyword or upload a new image.
                            </p>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="mt-4 rounded-full bg-[#039147] px-5 py-2.5 text-xs font-black text-white"
                            >
                              Upload Image
                            </button>
                          </div>
                        </div>
                      ) : null}

                      {!loading && filteredItems.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                          {filteredItems.map((item) => {
                            const selected = selectedItem?.id === item.id;
                            const assetUrl = resolveMediaUrl(item.url);
                            const unavailable = failedAssetIds.includes(item.id);

                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  setSelectedItem(item);
                                  setSelectedVariant(
                                    getInitialVariant(item, defaultVariant),
                                  );
                                  setFailedModalUrl("");
                                }}
                                className={`group overflow-hidden rounded-[24px] border bg-white text-left transition duration-200 ${
                                  selected
                                    ? "-translate-y-0.5 border-[#039147] shadow-[0_18px_40px_rgba(3,145,71,0.16)] ring-2 ring-[#039147]/10"
                                    : "border-black/5 hover:-translate-y-0.5 hover:border-[#039147]/35 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)]"
                                }`}
                              >
                                <div className="relative h-40 bg-[#edf4ef]">
                                  {!unavailable ? (
                                    <Image
                                      src={assetUrl}
                                      alt={item.altText || item.filename}
                                      fill
                                      sizes="(max-width: 640px) 100vw, 280px"
                                      className="object-cover transition duration-300 group-hover:scale-[1.02]"
                                      unoptimized
                                      onError={() =>
                                        setFailedAssetIds((current) =>
                                          current.includes(item.id)
                                            ? current
                                            : [...current, item.id],
                                        )
                                      }
                                    />
                                  ) : (
                                    <div className="flex h-full items-center justify-center p-5 text-center text-xs font-black text-black/35">
                                      Image file unavailable
                                    </div>
                                  )}

                                  {selected ? (
                                    <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#039147] text-xs font-black text-white shadow-lg">
                                      ✓
                                    </span>
                                  ) : null}
                                </div>
                                <div className="p-4">
                                  <p className="line-clamp-1 text-sm font-black text-black">
                                    {item.filename || item.originalName}
                                  </p>
                                  <p className="mt-2 text-[11px] font-semibold text-black/40">
                                    {formatBytes(item.size)} · {formatDate(item.createdAt)}
                                  </p>
                                  <p className="mt-2 text-[10px] font-black uppercase tracking-[0.1em] text-[#039147]">
                                    {item.folder || "general"}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <aside className="min-h-0 overflow-y-auto border-t border-black/5 bg-[#f6faf7] p-5 sm:p-7 lg:border-l lg:border-t-0">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                      Preview & Usage
                    </p>

                    {selectedItem && selectedDetails ? (
                      <>
                        <div className="relative mt-4 h-60 overflow-hidden rounded-[24px] border border-black/5 bg-white">
                          {!selectedPreviewUnavailable ? (
                            <Image
                              key={selectedPreview}
                              src={selectedPreview}
                              alt={selectedItem.altText || "Selected image preview"}
                              fill
                              sizes="380px"
                              className="object-contain"
                              unoptimized
                              onError={() => setFailedModalUrl(selectedPreview)}
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center p-6 text-center">
                              <div>
                                <p className="text-sm font-black text-black">
                                  Image file unavailable
                                </p>
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="mt-3 rounded-full border border-[#039147]/25 px-4 py-2 text-xs font-black text-[#039147]"
                                >
                                  Replace Image
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <p className="mt-4 break-words text-sm font-black text-black">
                          {selectedItem.filename || selectedItem.originalName}
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <div className="rounded-2xl bg-white p-3">
                            <p className="font-semibold text-black/35">Dimensions</p>
                            <p className="mt-1 font-black text-black">
                              {selectedDetails.width && selectedDetails.height
                                ? `${selectedDetails.width} × ${selectedDetails.height}`
                                : "Unavailable"}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-white p-3">
                            <p className="font-semibold text-black/35">File size</p>
                            <p className="mt-1 font-black text-black">
                              {formatBytes(selectedItem.size)}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-white p-3">
                            <p className="font-semibold text-black/35">Folder</p>
                            <p className="mt-1 truncate font-black capitalize text-black">
                              {selectedItem.folder || "general"}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-white p-3">
                            <p className="font-semibold text-black/35">Uploaded</p>
                            <p className="mt-1 font-black text-black">
                              {formatDate(selectedItem.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 rounded-[24px] border border-black/5 bg-white p-4">
                          <div className="flex items-center justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => setMetadataOpen((current) => !current)}
                              className="flex items-center gap-3 text-left"
                            >
                              <span className="text-xs font-black uppercase tracking-[0.12em] text-[#039147]">
                                Asset Metadata
                              </span>

                              <span className="text-xs font-black text-black/40">
                                {metadataOpen ? "−" : "+"}
                              </span>
                            </button>

                            {metadataOpen && !editingMetadata ? (
                              <button
                                type="button"
                                onClick={startMetadataEdit}
                                className="rounded-full border border-black/10 px-4 py-2 text-[11px] font-black transition hover:border-[#039147] hover:text-[#039147]"
                              >
                                Edit Metadata
                              </button>
                            ) : null}
                          </div>

                          {metadataOpen ? (
                            editingMetadata ? (
                              <div className="mt-4 space-y-3">
                                {[
                                  ["title", "Title"],
                                  ["altText", "Alt Text"],
                                  ["caption", "Caption"],
                                  ["tags", "Tags"],
                                ].map(([key, label]) => (
                                  <div key={key}>
                                    <p className="mb-1 text-xs font-bold text-black/40">
                                      {label}
                                    </p>
                                    <input
                                      value={metadataForm[key as keyof typeof metadataForm]}
                                      onChange={(event) =>
                                        setMetadataForm((current) => ({
                                          ...current,
                                          [key]: event.target.value,
                                        }))
                                      }
                                      className="h-10 w-full rounded-xl border border-black/10 px-3 text-sm font-bold outline-none focus:border-[#039147]"
                                    />
                                  </div>
                                ))}

                                <div>
                                  <p className="mb-1 text-xs font-bold text-black/40">
                                    Description
                                  </p>
                                  <textarea
                                    value={metadataForm.description}
                                    onChange={(event) =>
                                      setMetadataForm((current) => ({
                                        ...current,
                                        description: event.target.value,
                                      }))
                                    }
                                    rows={3}
                                    className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm font-bold outline-none focus:border-[#039147]"
                                  />
                                </div>

                                <div className="flex gap-2 pt-2">
                                  <button
                                    type="button"
                                    onClick={saveMetadataEdit}
                                    disabled={savingMetadata}
                                    className="rounded-full bg-[#039147] px-5 py-2 text-xs font-black text-white"
                                  >
                                    {savingMetadata ? "Saving..." : "Save"}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setEditingMetadata(false)}
                                    className="rounded-full border border-black/10 px-5 py-2 text-xs font-black"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="mt-4 space-y-3 text-xs">
                                <div>
                                  <p className="font-semibold text-black/35">
                                    Filename
                                  </p>
                                  <p className="mt-1 break-words font-black text-black">
                                    {selectedItem.filename || selectedItem.originalName}
                                  </p>
                                </div>

                                {[
                                  ["Title", selectedItem.title],
                                  ["Alt Text", selectedItem.altText],
                                  ["Description", selectedItem.description],
                                  ["Caption", selectedItem.caption],
                                  ["Tags", (selectedItem.tags || []).join(", ")],
                                ].map(([label, value]) => (
                                  <div key={label}>
                                    <p className="font-semibold text-black/35">
                                      {label}
                                    </p>
                                    <p className="mt-1 break-words font-black text-black">
                                      {value || "-"}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )
                          ) : null}
                        </div>

                        <div className="mt-5">
                          <div className="flex items-end justify-between gap-3">
                            <div>
                              <p className="text-xs font-black uppercase tracking-[0.12em] text-black/45">
                                Choose Usage
                              </p>
                              <p className="mt-1 text-xs text-black/35">
                                Recommended: {defaultVariant}
                              </p>
                            </div>
                            {!["original", "hero", "card", "thumbnail"].includes(
                              selectedVariant,
                            ) ? (
                              <span className="rounded-full bg-[#eaf8f0] px-3 py-1.5 text-[10px] font-black uppercase text-[#039147]">
                                Custom {selectedVariant}
                              </span>
                            ) : null}
                          </div>

                          <div className="mt-3 grid gap-2">
                            {variantOptions.map((option) => {
                              const available =
                                option.value === "original" ||
                                Boolean(getVariant(selectedItem, option.value));
                              const active = selectedVariant === option.value;

                              return (
                                <button
                                  key={option.value}
                                  type="button"
                                  disabled={!available}
                                  onClick={() => {
                                    setSelectedVariant(option.value);
                                    setFailedModalUrl("");
                                  }}
                                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                                    active
                                      ? "border-[#039147] bg-[#eaf8f0]"
                                      : available
                                        ? "border-black/5 bg-white hover:border-[#039147]/30"
                                        : "cursor-not-allowed border-black/5 bg-white/50 opacity-45"
                                  }`}
                                >
                                  <span>
                                    <span className="block text-xs font-black text-black">
                                      {option.label}
                                    </span>
                                    <span className="mt-1 block text-[10px] font-semibold text-black/35">
                                      {available
                                        ? option.description
                                        : "Variant not generated"}
                                    </span>
                                  </span>
                                  <span
                                    className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                                      active
                                        ? "border-[#039147] bg-[#039147] text-white"
                                        : "border-black/15"
                                    }`}
                                  >
                                    {active ? "✓" : ""}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setCropItem(selectedItem)}
                          className="mt-4 w-full rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black text-black transition hover:border-[#039147] hover:text-[#039147]"
                        >
                          Edit Crop
                        </button>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={closeLibrary}
                            className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black text-black"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={confirmSelection}
                            disabled={selectedPreviewUnavailable}
                            className="rounded-full bg-[#039147] px-5 py-3 text-sm font-black text-white shadow-[0_12px_28px_rgba(3,145,71,0.18)] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {confirmLabel}
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex min-h-72 items-center justify-center text-center">
                        <div>
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl text-[#039147] shadow-sm">
                            ✓
                          </div>
                          <p className="mt-4 text-sm font-black text-black/45">
                            Select an image to preview
                          </p>
                          <p className="mt-2 text-xs leading-5 text-black/30">
                            Metadata and usage variants will appear here.
                          </p>
                        </div>
                      </div>
                    )}
                  </aside>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}

      {cropItem && typeof document !== "undefined"
        ? createPortal(
            <MediaCropModal
              imageUrl={cropItem.url}
              processing={processingCrop}
              onClose={() => setCropItem(null)}
              onSave={handleCropSave}
            />,
            document.body,
          )
        : null}
    </section>
  );
}
