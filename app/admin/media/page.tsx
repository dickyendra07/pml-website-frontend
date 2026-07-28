"use client";

import Image from "next/image";
import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import AdminShell from "@/components/admin/AdminShell";
import AdminState from "@/components/admin/AdminState";
import {
  MediaAssetItem,
  MediaAssetType,
  deleteAdminMediaAsset,
  getAdminMediaAssets,
  getAdminToken,
  updateAdminMediaAsset,
  uploadAdminMediaAsset,
} from "@/lib/admin-api";

type MediaForm = {
  id: string;
  altText: string;
  caption: string;
  folder: string;
  type: MediaAssetType;
};

const emptyForm: MediaForm = {
  id: "",
  altText: "",
  caption: "",
  folder: "general",
  type: "OTHER",
};

const folderOptions = [
  "general",
  "homepage",
  "facilities",
  "catalogues",
  "insights",
  "careers",
  "popups",
];

function formatSize(size: number | null) {
  if (!size) return "-";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

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

function mapMediaToForm(item: MediaAssetItem): MediaForm {
  return {
    id: item.id,
    altText: item.altText || "",
    caption: item.caption || "",
    folder: item.folder || "general",
    type: item.type,
  };
}

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaAssetItem[]>([]);
  const [form, setForm] = useState<MediaForm>(emptyForm);
  const [status, setStatus] =
    useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] =
    useState<"success" | "error">("success");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadFolder, setUploadFolder] = useState("general");
  const [search, setSearch] = useState("");
  const [folderFilter, setFolderFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortMode, setSortMode] = useState<
    "newest" | "oldest" | "name-asc" | "name-desc" | "largest"
  >("newest");

  const selectedMedia = useMemo(() => {
    return items.find((item) => item.id === form.id) || null;
  }, [items, form.id]);

  const availableFolders = useMemo(() => {
    const dynamicFolders = items
      .map((item) => item.folder)
      .filter((value): value is string => Boolean(value));

    return Array.from(
      new Set([...folderOptions, ...dynamicFolders]),
    ).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const filtered = items.filter((item) => {
      const matchesSearch =
        !keyword ||
        [
          item.originalName,
          item.filename,
          item.altText,
          item.caption,
          item.folder,
          item.type,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(keyword);

      const matchesFolder =
        folderFilter === "all" ||
        (item.folder || "general") === folderFilter;

      const matchesType =
        typeFilter === "all" || item.type === typeFilter;

      return matchesSearch && matchesFolder && matchesType;
    });

    return [...filtered].sort((a, b) => {
      if (sortMode === "oldest") {
        return (
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        );
      }

      if (sortMode === "name-asc") {
        return (a.originalName || a.filename).localeCompare(
          b.originalName || b.filename,
        );
      }

      if (sortMode === "name-desc") {
        return (b.originalName || b.filename).localeCompare(
          a.originalName || a.filename,
        );
      }

      if (sortMode === "largest") {
        return (b.size || 0) - (a.size || 0);
      }

      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });
  }, [
    items,
    search,
    folderFilter,
    typeFilter,
    sortMode,
  ]);

  const loadMedia = useCallback(async () => {
    const token = getAdminToken();

    if (!token) {
      setStatus("error");
      setMessageTone("error");
      setMessage("Admin token not found. Please login again.");
      return;
    }

    try {
      const data = await getAdminMediaAssets(token);

      setItems(data);
      setStatus("success");

      setForm((current) => {
        if (data.length > 0 && !current.id) {
          return mapMediaToForm(data[0]);
        }

        if (current.id) {
          const refreshed = data.find(
            (item) => item.id === current.id,
          );

          if (refreshed) {
            return mapMediaToForm(refreshed);
          }
        }

        return current;
      });
    } catch (error) {
      setStatus("error");
      setMessageTone("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to load media library.",
      );
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadMedia();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadMedia]);

  const selectMedia = (item: MediaAssetItem) => {
    setForm(mapMediaToForm(item));
    setMessage("");
  };

  const updateField = (
    key: keyof MediaForm,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleUpload = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] || null;
    event.target.value = "";

    if (!file) return;

    const token = getAdminToken();

    if (!token) {
      setMessageTone("error");
      setMessage("Admin token not found. Please login again.");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const uploaded = await uploadAdminMediaAsset(
        token,
        file,
        uploadFolder || "general",
      );

      setForm(mapMediaToForm(uploaded));
      setMessageTone("success");
      setMessage("Media uploaded successfully.");

      await loadMedia();
    } catch (error) {
      setMessageTone("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to upload media.",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (
    event: DragEvent<HTMLLabelElement>,
  ) => {
    event.preventDefault();

    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (!file) return;

    const dataTransfer = new DataTransfer();

    dataTransfer.items.add(file);

    const input = document.querySelector(
      "#media-upload-input",
    ) as HTMLInputElement | null;

    if (!input) return;

    input.files = dataTransfer.files;

    input.dispatchEvent(
      new Event("change", {
        bubbles: true,
      }),
    );
  };

  const handleSave = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!form.id) {
      setMessageTone("error");
      setMessage("Please select a media asset first.");
      return;
    }

    const token = getAdminToken();

    if (!token) {
      setMessageTone("error");
      setMessage("Admin token not found. Please login again.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const updated = await updateAdminMediaAsset(
        token,
        form.id,
        {
          altText: form.altText.trim() || null,
          caption: form.caption.trim() || null,
          folder: form.folder.trim() || "general",
          type: form.type,
        },
      );

      setForm(mapMediaToForm(updated));
      setMessageTone("success");
      setMessage("Media metadata updated successfully.");

      await loadMedia();
    } catch (error) {
      setMessageTone("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to update media.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!form.id) {
      setMessageTone("error");
      setMessage("Please select a media asset first.");
      return;
    }

    const confirmed = window.confirm(
      "Delete this media library record? The physical uploaded file may remain on server storage.",
    );

    if (!confirmed) return;

    const token = getAdminToken();

    if (!token) {
      setMessageTone("error");
      setMessage("Admin token not found. Please login again.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      await deleteAdminMediaAsset(token, form.id);

      setForm(emptyForm);
      setMessageTone("success");
      setMessage("Media library record deleted successfully.");

      await loadMedia();
    } catch (error) {
      setMessageTone("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to delete media.",
      );
    } finally {
      setSaving(false);
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setMessageTone("success");
      setMessage("Media URL copied to clipboard.");
    } catch {
      setMessageTone("error");
      setMessage("Unable to copy media URL.");
    }
  };

  return (
    <AdminShell>
      <div className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#039147]">
            Media Library
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-black md:text-5xl">
            Media Assets
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-black/50">
            Upload, organise, preview, and reuse images, PDFs,
            documents, and videos across the PML CMS.
          </p>
        </div>

      </div>

      {status === "loading" ? (
        <AdminState
          title="Loading media library"
          description="Please wait while the CMS loads media assets."
        />
      ) : null}

      {status === "error" ? (
        <AdminState
          title="Unable to load media library"
          description={message}
          tone="error"
        />
      ) : null}

      {status === "success" ? (
        <>
          {message ? (
            <div
              className={`mb-6 rounded-2xl border p-4 text-sm font-bold ${
                messageTone === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-[#039147]/15 bg-[#eaf8f0] text-[#039147]"
              }`}
            >
              {message}
            </div>
          ) : null}

          <div className="mb-6 grid gap-4 rounded-[28px] border border-black/5 bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.06)] md:grid-cols-[minmax(0,1fr)_220px_180px]">
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.12em] text-black/45">
                Search Assets
              </span>

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search filename, caption, alt text, folder..."
                className="h-12 rounded-2xl border border-black/10 bg-[#f6faf7] px-4 text-sm font-bold text-black outline-none placeholder:text-black/25 focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.12em] text-black/45">
                Folder
              </span>

              <select
                value={folderFilter}
                onChange={(event) =>
                  setFolderFilter(event.target.value)
                }
                className="h-12 rounded-2xl border border-black/10 bg-[#f6faf7] px-4 text-sm font-bold text-black outline-none focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
              >
                <option value="all">All folders</option>

                {availableFolders.map((folder) => (
                  <option key={folder} value={folder}>
                    {folder}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.12em] text-black/45">
                Sort
              </span>

              <select
                value={sortMode}
                onChange={(event) =>
                  setSortMode(
                    event.target.value as
                      | "newest"
                      | "oldest"
                      | "name-asc"
                      | "name-desc"
                      | "largest",
                  )
                }
                className="h-12 rounded-2xl border border-black/10 bg-[#f6faf7] px-4 text-sm font-bold text-black outline-none focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="largest">Largest File</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.12em] text-black/45">
                Type
              </span>

              <select
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(event.target.value)
                }
                className="h-12 rounded-2xl border border-black/10 bg-[#f6faf7] px-4 text-sm font-bold text-black outline-none focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
              >
                <option value="all">All types</option>
                <option value="IMAGE">Image</option>
                <option value="PDF">PDF</option>
                <option value="VIDEO">Video</option>
                <option value="DOCUMENT">Document</option>
                <option value="OTHER">Other</option>
              </select>
            </label>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_420px]">
            <section className="rounded-[30px] border border-black/5 bg-white p-5 shadow-[0_22px_70px_rgba(0,0,0,0.08)] md:p-7">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                    Library
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-black">
                    Uploaded Media
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex rounded-full border border-black/5 bg-[#f6faf7] p-1">
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      className={`rounded-full px-3 py-1.5 text-xs font-black ${
                        viewMode === "grid"
                          ? "bg-[#039147] text-white"
                          : "text-black/40"
                      }`}
                    >
                      Grid
                    </button>

                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      className={`rounded-full px-3 py-1.5 text-xs font-black ${
                        viewMode === "list"
                          ? "bg-[#039147] text-white"
                          : "text-black/40"
                      }`}
                    >
                      List
                    </button>
                  </div>

                  <span className="rounded-full bg-[#f6faf7] px-4 py-2 text-xs font-black text-black/45">
                    {filteredItems.length} of {items.length} assets
                  </span>
                </div>
              </div>

        <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
          Upload New Asset
        </p>

        <div className="mb-6 grid w-full gap-4 rounded-[28px] border border-black/5 bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
          <label
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`group flex min-h-[180px] w-full cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed transition ${
              isDragging
                ? "border-[#039147] bg-[#eaf8f0]"
                : "border-black/10 bg-[#f6faf7] hover:border-[#039147]/50"
            }`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7 text-[#039147]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 16V4" />
                <path d="M7 9l5-5 5 5" />
                <path d="M5 20h14" />
              </svg>
            </div>

            <p className="mt-4 text-sm font-black text-black">
              {uploading
                ? "Uploading..."
                : "Drop file here or click"}
            </p>

            <p className="mt-2 text-xs font-bold text-black/40">
              PNG JPG WEBP PDF MP4
            </p>

            <input
              id="media-upload-input"
              type="file"
              accept="image/png,image/jpeg,image/webp,application/pdf,video/mp4"
              onChange={handleUpload}
              disabled={uploading}
              className="sr-only"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-black/45">
              Upload Folder
            </span>

            <select
              value={uploadFolder}
              onChange={(event) =>
                setUploadFolder(event.target.value)
              }
              className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-sm font-bold text-black outline-none focus:border-[#039147]"
            >
              {availableFolders.map((folder) => (
                <option key={folder} value={folder}>
                  {folder}
                </option>
              ))}
            </select>
          </label>
        </div>

              <p className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-black/40">
                Media Collection
              </p>

              {filteredItems.length > 0 ? (
                <>
                  {viewMode === "grid" ? (
                    <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                      {filteredItems.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => selectMedia(item)}
                          className={`group relative min-w-0 overflow-hidden rounded-[22px] border text-left transition focus:outline-none ${
                            item.id === form.id
                              ? "border-[#039147] bg-[#eaf8f0] shadow-[0_18px_45px_rgba(3,145,71,0.14)]"
                              : "border-black/5 bg-white hover:-translate-y-1 hover:border-[#039147]/30 hover:shadow-[0_18px_50px_rgba(0,0,0,0.08)]"
                          }`}
                        >
                          <div className="relative aspect-square overflow-hidden bg-[#f6faf7]">
                            {item.type === "IMAGE" ? (
                              <Image
                                src={getAssetUrl(item.url)}
                                alt={item.altText || item.originalName || item.filename}
                                fill
                                sizes="320px"
                                className={`transition duration-500 group-hover:scale-105 ${
                                  item.originalName?.toLowerCase().includes("logo") ||
                                  item.filename?.toLowerCase().includes("logo")
                                    ? "object-contain p-8"
                                    : "object-cover"
                                }`}
                                unoptimized
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <span className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-black/45">
                                  {item.type}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="space-y-2 p-4">
                            <p className="line-clamp-2 min-h-[42px] break-all text-sm font-black leading-5 text-black">
                              {item.originalName || item.filename}
                            </p>

                            <div className="flex flex-wrap gap-2">
                              <span className="rounded-full bg-[#eaf8f0] px-3 py-1 text-[10px] font-black uppercase text-[#039147]">
                                {item.type}
                              </span>

                              <span className="rounded-full bg-black/5 px-3 py-1 text-[10px] font-black uppercase text-black/45">
                                {item.folder || "general"}
                              </span>
                            </div>

                            <p className="text-xs font-bold text-black/40">
                              {formatSize(item.size)} • {formatDate(item.createdAt)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-[24px] border border-black/5">
                      <div className="hidden grid-cols-[90px_1fr_120px_120px_120px_150px] gap-4 bg-[#f6faf7] px-5 py-3 text-[11px] font-black uppercase tracking-[0.1em] text-black/40 md:grid">
                        <span>Preview</span>
                        <span>File Name</span>
                        <span>Type</span>
                        <span>Folder</span>
                        <span>Size</span>
                        <span>Uploaded</span>
                      </div>

                      {filteredItems.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => selectMedia(item)}
                          className={`grid w-full gap-4 border-t px-5 py-4 text-left transition md:grid-cols-[90px_1fr_120px_120px_120px_150px] md:items-center ${
                            item.id === form.id
                              ? "bg-[#eaf8f0]"
                              : "bg-white hover:bg-[#f6faf7]"
                          }`}
                        >
                          <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-[#f6faf7]">
                            {item.type === "IMAGE" ? (
                              <Image
                                src={getAssetUrl(item.url)}
                                alt={item.altText || item.originalName || item.filename}
                                fill
                                sizes="64px"
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-[10px] font-black text-black/40">
                                {item.type}
                              </div>
                            )}
                          </div>

                          <span className="line-clamp-2 text-sm font-black text-black">
                            {item.originalName || item.filename}
                          </span>

                          <span className="text-xs font-bold text-black/50">
                            {item.type}
                          </span>

                          <span className="text-xs font-bold text-black/50">
                            {item.folder || "general"}
                          </span>

                          <span className="text-xs font-bold text-black/50">
                            {formatSize(item.size)}
                          </span>

                          <span className="text-xs font-bold text-black/50">
                            {formatDate(item.createdAt)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex min-h-72 items-center justify-center rounded-[24px] border border-dashed border-black/10 bg-[#f6faf7] p-8 text-center">
                  <div>
                    <p className="text-sm font-black text-black/45">
                      No matching media found
                    </p>

                    <p className="mt-2 text-xs leading-5 text-black/30">
                      Adjust the search or filters, or upload a new
                      asset.
                    </p>
                  </div>
                </div>
              )}
            </section>

            <section className="h-fit rounded-[30px] border border-black/5 bg-white p-5 shadow-[0_22px_70px_rgba(0,0,0,0.08)] md:p-7 xl:sticky xl:top-6">
              <div className="mb-6">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                  Media Detail
                </p>

                <h2 className="mt-2 text-2xl font-black text-black">
                  Asset Metadata
                </h2>
              </div>

              {selectedMedia ? (
                <>
                  <div className="mb-5 overflow-hidden rounded-[24px] border border-black/5 bg-[#f6faf7]">
                    {selectedMedia.type === "IMAGE" ? (
                      <div className="relative h-64">
                        <Image
                          src={getAssetUrl(selectedMedia.url)}
                          alt={
                            selectedMedia.altText ||
                            selectedMedia.originalName ||
                            selectedMedia.filename
                          }
                          fill
                          sizes="420px"
                          className={
                            selectedMedia.originalName?.toLowerCase().includes("logo") ||
                            selectedMedia.filename?.toLowerCase().includes("logo")
                              ? "object-contain p-8"
                              : "object-cover"
                          }
                          unoptimized
                        />
                      </div>
                    ) : selectedMedia.type === "VIDEO" ? (
                      <video
                        controls
                        className="h-64 w-full bg-black object-contain"
                        src={getAssetUrl(selectedMedia.url)}
                      />
                    ) : (
                      <div className="flex h-44 items-center justify-center">
                        <span className="rounded-full bg-white px-5 py-2 text-sm font-black uppercase tracking-[0.14em] text-black/45">
                          {selectedMedia.type}
                        </span>
                      </div>
                    )}

                    <div className="p-4">
                      <p className="break-all text-sm font-black text-black">
                        {selectedMedia.originalName ||
                          selectedMedia.filename}
                      </p>

                      <p className="mt-2 break-all text-xs leading-5 text-black/40">
                        {selectedMedia.url}
                      </p>
                    </div>
                  </div>

                  <div className="mb-5 grid gap-3 rounded-[22px] bg-[#f6faf7] p-4 text-xs">
                    <div className="flex justify-between gap-3">
                      <span className="font-bold text-black/40">
                        Type
                      </span>
                      <span className="font-black text-black">
                        {selectedMedia.type}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="font-bold text-black/40">
                        Size
                      </span>
                      <span className="font-black text-black">
                        {formatSize(selectedMedia.size)}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="font-bold text-black/40">
                        Folder
                      </span>
                      <span className="font-black text-black">
                        {selectedMedia.folder || "general"}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="font-bold text-black/40">
                        Uploaded
                      </span>
                      <span className="text-right font-black text-black">
                        {formatDate(selectedMedia.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() =>
                        void copyUrl(selectedMedia.url)
                      }
                      className="flex-1 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black text-black transition hover:border-[#039147] hover:text-[#039147]"
                    >
                      Copy Relative URL
                    </button>

                    <a
                      href={getAssetUrl(selectedMedia.url)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 rounded-full bg-black px-5 py-3 text-center text-sm font-black text-white transition hover:-translate-y-0.5"
                    >
                      Open Asset
                    </a>
                  </div>

                  <form
                    onSubmit={handleSave}
                    className="grid gap-4"
                  >
                    <label className="grid gap-2">
                      <span className="text-sm font-black text-black">
                        Alt Text
                      </span>

                      <input
                        value={form.altText}
                        onChange={(event) =>
                          updateField(
                            "altText",
                            event.target.value,
                          )
                        }
                        placeholder="Describe the image for accessibility"
                        className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm font-bold text-black outline-none placeholder:text-black/25 focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm font-black text-black">
                        Caption
                      </span>

                      <textarea
                        rows={4}
                        value={form.caption}
                        onChange={(event) =>
                          updateField(
                            "caption",
                            event.target.value,
                          )
                        }
                        placeholder="Optional media caption"
                        className="resize-y rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold leading-6 text-black outline-none placeholder:text-black/25 focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm font-black text-black">
                        Folder
                      </span>

                      <input
                        value={form.folder}
                        onChange={(event) =>
                          updateField(
                            "folder",
                            event.target.value,
                          )
                        }
                        list="media-folder-options"
                        className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm font-bold text-black outline-none focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                      />

                      <datalist id="media-folder-options">
                        {availableFolders.map((folder) => (
                          <option key={folder} value={folder} />
                        ))}
                      </datalist>
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm font-black text-black">
                        Asset Type
                      </span>

                      <select
                        value={form.type}
                        onChange={(event) =>
                          updateField(
                            "type",
                            event.target.value as MediaAssetType,
                          )
                        }
                        className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm font-bold text-black outline-none focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                      >
                        <option value="IMAGE">Image</option>
                        <option value="PDF">PDF</option>
                        <option value="VIDEO">Video</option>
                        <option value="DOCUMENT">
                          Document
                        </option>
                        <option value="OTHER">Other</option>
                      </select>
                    </label>

                    <div className="mt-2 grid gap-3">
                      <button
                        type="submit"
                        disabled={saving}
                        className="rounded-full bg-[#039147] px-6 py-3.5 text-sm font-black text-white shadow-[0_16px_40px_rgba(3,145,71,0.2)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {saving
                          ? "Saving Metadata..."
                          : "Save Metadata"}
                      </button>

                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={saving}
                        className="rounded-full border border-red-200 bg-red-50 px-6 py-3.5 text-sm font-black text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Delete Library Record
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex min-h-72 items-center justify-center rounded-[24px] border border-dashed border-black/10 bg-[#f6faf7] p-8 text-center">
                  <div>
                    <p className="text-sm font-black text-black/45">
                      No media selected
                    </p>

                    <p className="mt-2 text-xs leading-5 text-black/30">
                      Select an asset from the library to preview
                      and edit its metadata.
                    </p>
                  </div>
                </div>
              )}
            </section>
          </div>
        </>
      ) : null}
    </AdminShell>
  );
}
