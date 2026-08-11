"use client";

import Image from "next/image";
import {
  ChangeEvent,
  FormEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import AdminShell from "@/components/admin/AdminShell";
import AdminState from "@/components/admin/AdminState";
import MediaVariantPreviewModal from "@/components/admin/MediaVariantPreviewModal";
import { getMediaVariantInfo } from "@/lib/media-variant-config";
import { resolveMediaUrl as getAssetUrl } from "@/lib/media";
import MediaCropModal from "@/components/admin/MediaCropModal";
import {
  MediaAssetItem,
  MediaAssetType,
  deleteAdminMediaAsset,
  cropAdminMediaAsset,
  getAdminMediaAssets,
  getAdminToken,
  updateAdminMediaAsset,
  uploadAdminMediaAsset,
} from "@/lib/admin-api";

type MediaForm = {
  id: string;
  title: string;
  altText: string;
  description: string;
  caption: string;
  tags: string;
  folder: string;
  type: MediaAssetType;
};

type UploadQueueItem = {
  id: string;
  name: string;
  progress: number;
  status: "waiting" | "uploading" | "done" | "error";
};

type VariantPreview = {
  url: string;
  name: string;
  width?: number | null;
  height?: number | null;
};

const emptyForm: MediaForm = {
  id: "",
  title: "",
  altText: "",
  description: "",
  caption: "",
  tags: "",
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

function formatAspectRatio(width?: number | null, height?: number | null) {
  if (!width || !height) return "-";

  return `${(width / height).toFixed(2)}:1`;
}

function getUploadStatusClass(status: UploadQueueItem["status"]) {
  if (status === "done") return "text-[#039147]";
  if (status === "error") return "text-red-500";

  return "text-black/40";
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function Show({ when, children }: { when: boolean; children: ReactNode }) {
  return when ? children : null;
}

function getMessageClass(tone: "success" | "error") {
  return tone === "error"
    ? "border-red-200 bg-red-50 text-red-700"
    : "border-[#039147]/15 bg-[#eaf8f0] text-[#039147]";
}

function getProgressClass(status: UploadQueueItem["status"]) {
  return status === "error" ? "bg-red-500" : "bg-[#039147]";
}

function getUploadLabel(uploading: boolean) {
  return uploading ? "Uploading..." : "Drop file here or click";
}

function SelectedMediaPreview({ media }: { media: MediaAssetItem }) {
  if (media.type === "IMAGE") {
    const isLogo =
      media.originalName?.toLowerCase().includes("logo") ||
      media.filename?.toLowerCase().includes("logo");

    return (
      <div className="relative h-64">
        <Image
          src={getAssetUrl(media.url)}
          alt={media.altText || media.originalName || media.filename}
          fill
          sizes="420px"
          className={isLogo ? "object-contain p-8" : "object-cover"}
          unoptimized
        />
      </div>
    );
  }

  if (media.type === "VIDEO") {
    return (
      <video
        controls
        className="h-64 w-full bg-black object-contain"
        src={getAssetUrl(media.url)}
      />
    );
  }

  return (
    <div className="flex h-44 items-center justify-center">
      <span className="rounded-full bg-white px-5 py-2 text-sm font-black uppercase tracking-[0.14em] text-black/45">
        {media.type}
      </span>
    </div>
  );
}

function getSelectedMediaUrl(media: MediaAssetItem | null) {
  return media ? getAssetUrl(media.url) : "";
}

function getVariantPreview(value: VariantPreview | null): VariantPreview {
  return value || { url: "", name: "", width: null, height: null };
}

function mapMediaToForm(item: MediaAssetItem): MediaForm {
  return {
    id: item.id,
    title: item.title || "",
    altText: item.altText || "",
    description: item.description || "",
    caption: item.caption || "",
    tags: (item.tags || []).join(", "),
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
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [uploadFolder, setUploadFolder] = useState("general");
  const [search, setSearch] = useState("");
  const [folderFilter, setFolderFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortMode, setSortMode] = useState<
    "newest" | "oldest" | "name-asc" | "name-desc" | "largest"
  >("newest");
  const [copiedId, setCopiedId] = useState("");
  const [cropOpen, setCropOpen] = useState(false);

  const [variantPreview, setVariantPreview] =
    useState<VariantPreview | null>(null);
  const activeVariantPreview = getVariantPreview(variantPreview);

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
      setMessage(getErrorMessage(error, "Failed to load media library."));
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

  const processUploadFiles = async (files: File[]) => {
    if (!files.length) return;

    const token = getAdminToken();

    if (!token) {
      setMessageTone("error");
      setMessage("Admin token not found. Please login again.");
      return;
    }

    const queue = files.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      name: file.name,
      progress: 0,
      status: "waiting" as const,
    }));

    setUploadQueue(queue);
    setUploading(true);
    setMessage("");

    let lastUploaded: MediaAssetItem | null = null;

    for (const item of queue) {
      const file = files.find((entry) => entry.name === item.name);

      if (!file) continue;

      setUploadQueue((current) =>
        current.map((upload) =>
          upload.id === item.id
            ? {
                ...upload,
                status: "uploading",
                progress: 30,
              }
            : upload,
        ),
      );

      try {
        const uploaded = await uploadAdminMediaAsset(
          token,
          file,
          uploadFolder || "general",
        );

        lastUploaded = uploaded;

        setUploadQueue((current) =>
          current.map((upload) =>
            upload.id === item.id
              ? {
                  ...upload,
                  status: "done",
                  progress: 100,
                }
              : upload,
          ),
        );
      } catch {
        setUploadQueue((current) =>
          current.map((upload) =>
            upload.id === item.id
              ? {
                  ...upload,
                  status: "error",
                  progress: 100,
                }
              : upload,
          ),
        );
      }
    }

    if (lastUploaded) {
      setForm(mapMediaToForm(lastUploaded));
      setMessageTone("success");
      setMessage(`${files.length} media uploaded successfully.`);
      await loadMedia();
    }

    setUploading(false);
  };


  const startRename = () => {
    if (!selectedMedia) return;

    setRenameValue(
      selectedMedia.filename || selectedMedia.originalName || "",
    );

    setIsRenaming(true);
  };


  const cancelRename = () => {
    setIsRenaming(false);
    setRenameValue("");
  };


  const saveRename = async () => {
    if (!selectedMedia) return;

    const token = getAdminToken();

    if (!token) return;

    const name = renameValue.trim();

    if (!name) return;

    setSaving(true);

    try {
      const updated = await updateAdminMediaAsset(
        token,
        selectedMedia.id,
        {
          filename: name,
        },
      );

      setForm(mapMediaToForm(updated));
      setMessageTone("success");
      setMessage("Filename updated successfully.");

      setIsRenaming(false);

      await loadMedia();

    } catch (error) {
      setMessageTone("error");
      setMessage(getErrorMessage(error, "Failed to rename media."));
    } finally {
      setSaving(false);
    }
  };


  const handleUpload = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    await processUploadFiles(files);
  };

  const handleDrop = async (
    event: React.DragEvent<HTMLLabelElement>,
  ) => {
    event.preventDefault();
    setIsDragging(false);

    const files = Array.from(event.dataTransfer.files || []);

    await processUploadFiles(files);
  };


  const handleVariantCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(getAssetUrl(url));

      setMessage("Variant URL copied.");
      setMessageTone("success");
    } catch {
      setMessage("Failed to copy variant URL.");
      setMessageTone("error");
    }
  };


  const handleCropSave = async (payload: {
    ratio: string;
    width: number;
    height: number;
    x: number;
    y: number;
  }) => {
    if (!selectedMedia) return;

    const token = getAdminToken();

    if (!token) {
      setMessage("Admin session expired.");
      setMessageTone("error");
      return;
    }

    try {
      setSaving(true);

      await cropAdminMediaAsset(
        token,
        selectedMedia.id,
        payload,
      );

      await loadMedia();

      setForm((current) => ({
        ...current,
      }));

      setCropOpen(false);

      setMessage("Image crop variant generated successfully.");
      setMessageTone("success");
    } catch (error) {
      setMessage(getErrorMessage(error, "Failed to crop image."));
      setMessageTone("error");
    } finally {
      setSaving(false);
    }
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
      const payload = {
        title: form.title.trim() || null,
        altText: form.altText.trim() || null,
        description: form.description.trim() || null,
        caption: form.caption.trim() || null,
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        folder: form.folder.trim() || "general",
        type: form.type,
      };

      console.log("MEDIA SAVE PAYLOAD:", payload);

      const updated = await updateAdminMediaAsset(
        token,
        form.id,
        payload,
      );

      console.log("MEDIA SAVE RESPONSE:", updated);

      setForm(mapMediaToForm(updated));
      setMessageTone("success");
      setMessage("Media metadata updated successfully.");

      await loadMedia();
    } catch (error) {
      setMessageTone("error");
      setMessage(getErrorMessage(error, "Failed to update media."));
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
      setMessage(getErrorMessage(error, "Failed to delete media."));
    } finally {
      setSaving(false);
    }
  };

  const copyUrl = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);

      setCopiedId(id);

      setTimeout(() => {
        setCopiedId("");
      }, 2000);

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

      <Show when={status === "loading"}>
        <AdminState
          title="Loading media library"
          description="Please wait while the CMS loads media assets."
        />
      </Show>

      <Show when={status === "error"}>
        <AdminState
          title="Unable to load media library"
          description={message}
          tone="error"
        />
      </Show>

      <Show when={status === "success"}>
        <>
          <Show when={Boolean(message)}>
            <div
              className={`mb-6 rounded-2xl border p-4 text-sm font-bold ${getMessageClass(messageTone)}`}
            >
              {message}
            </div>
          </Show>

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
              {getUploadLabel(uploading)}
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

          <Show when={uploadQueue.length > 0}>
            <div className="rounded-[24px] border border-black/5 bg-[#f6faf7] p-4">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-black/45">
                Upload Queue
              </p>

              <div className="grid gap-3">
                {uploadQueue.map((upload) => (
                  <div
                    key={upload.id}
                    className="rounded-2xl bg-white p-3 shadow-sm"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="truncate text-xs font-black text-black">
                        {upload.name}
                      </p>

                      <span
                        className={`text-[10px] font-black uppercase ${getUploadStatusClass(upload.status)}`}
                      >
                        {upload.status}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-black/5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getProgressClass(upload.status)}`}
                        style={{
                          width: `${upload.progress}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Show>

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
                                alt={item.altText || item.filename || item.originalName || ""}
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

                            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition duration-300 group-hover:opacity-100">
                              <a
                                href={getAssetUrl(item.url)}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full bg-white px-4 py-2 text-xs font-black text-black transition hover:-translate-y-0.5"
                                onClick={(event) =>
                                  event.stopPropagation()
                                }
                              >
                                Preview
                              </a>

                              <div
                                role="button"
                                tabIndex={0}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  copyUrl(getAssetUrl(item.url), item.id);
                                }}
                                onKeyDown={(event) => {
                                  if (event.key === "Enter") {
                                    event.stopPropagation();
                                    copyUrl(getAssetUrl(item.url), item.id);
                                  }
                                }}
                                className="cursor-pointer rounded-full bg-[#039147] px-4 py-2 text-xs font-black text-white transition hover:-translate-y-0.5"
                              >
                                {copiedId === item.id
                                  ? "✓ Copied"
                                  : "Copy URL"}
                              </div>
                            </div>
                          </div>

                          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-black shadow-sm">
                            {item.type}
                          </span>

                          <div className="space-y-2 p-4">
                            <p className="line-clamp-2 min-h-[42px] break-all text-sm font-black leading-5 text-black">
                              {item.filename || item.originalName}
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
                                alt={item.altText || item.filename || item.originalName || ""}
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
                            {item.filename || item.originalName}
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

                  <div className="mb-5 rounded-[24px] border border-black/5 bg-[#f6faf7] p-4">

                    <p className="text-xs font-black uppercase tracking-[0.14em] text-black/40">
                      Filename
                    </p>

                    {!isRenaming ? (
                      <div className="mt-3 flex items-center justify-between gap-3">

                        <p className="min-w-0 flex-1 break-all text-sm font-black text-black">
                          {selectedMedia.filename || selectedMedia.originalName}
                        </p>

                        <button
                          type="button"
                          onClick={startRename}
                          className="shrink-0 rounded-full border border-black/10 px-4 py-2 text-xs font-black transition hover:border-[#039147] hover:text-[#039147]"
                        >
                          Rename
                        </button>

                      </div>
                    ) : (

                      <div className="mt-3 grid gap-3">

                        <input
                          value={renameValue}
                          onChange={(event) =>
                            setRenameValue(event.target.value)
                          }
                          className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-sm font-bold outline-none focus:border-[#039147]"
                        />

                        <div className="flex gap-2">

                          <button
                            type="button"
                            onClick={saveRename}
                            className="rounded-full bg-[#039147] px-4 py-2 text-xs font-black text-white"
                          >
                            Save
                          </button>

                          <button
                            type="button"
                            onClick={cancelRename}
                            className="rounded-full border border-black/10 px-4 py-2 text-xs font-black"
                          >
                            Cancel
                          </button>

                        </div>

                      </div>

                    )}

                  </div>


                  <div className="mb-5 overflow-hidden rounded-[24px] border border-black/5 bg-[#f6faf7]">
                    <SelectedMediaPreview media={selectedMedia} />

                    <div className="p-4">
                      <p className="break-all text-sm font-black text-black">
                        {selectedMedia.filename ||
                          selectedMedia.originalName}
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

                    <Show
                      when={Boolean(selectedMedia.width && selectedMedia.height)}
                    >
                      <>
                        <div className="flex justify-between gap-3">
                          <span className="font-bold text-black/40">
                            Dimensions
                          </span>
                          <span className="font-black text-black">
                            {selectedMedia.width} × {selectedMedia.height}px
                          </span>
                        </div>

                        <div className="flex justify-between gap-3">
                          <span className="font-bold text-black/40">
                            Aspect Ratio
                          </span>
                          <span className="font-black text-black">
                            {formatAspectRatio(
                              selectedMedia.width,
                              selectedMedia.height,
                            )}
                          </span>
                        </div>
                      </>
                    </Show>

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


                  <Show when={Boolean(selectedMedia.variants?.length)}>
                    <div className="mb-5 rounded-[22px] border border-black/5 bg-white p-4">

                      <p className="mb-4 text-xs font-black uppercase tracking-[0.14em] text-[#039147]">
                        Generated Variants
                      </p>


                      <div className="grid gap-4">

                        {selectedMedia.variants.map((variant) => {

                          const variantInfo =
                            getMediaVariantInfo(
                              variant.name,
                            );


                          return (
                            <div
                              key={variant.id}
                              className="rounded-[24px] bg-[#f6faf7] p-4"
                            >

                              <div className="flex flex-col gap-4">


                                <div>

                                  <div className="flex items-center justify-between gap-3">

                                    <div>

                                      <p className="text-sm font-black text-black">
                                        {variantInfo.title}
                                      </p>


                                      <p className="mt-1 text-xs font-bold text-black/40">
                                        {variant.width && variant.height
                                          ? `${variant.width} × ${variant.height}px`
                                          : "Generated image"}
                                      </p>

                                    </div>


                                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-black/40">
                                      {variant.name}
                                    </span>

                                  </div>


                                  <p className="mt-3 text-xs leading-5 text-black/50">
                                    {variantInfo.description}
                                  </p>


                                  <div className="mt-4 rounded-2xl bg-white p-3">

                                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#039147]">
                                      Recommended Usage
                                    </p>


                                    <div className="mt-2 flex flex-wrap gap-2">

                                      {variantInfo.recommendedFor.map(
                                        (item) => (
                                          <span
                                            key={item}
                                            className="rounded-full bg-[#f6faf7] px-3 py-1 text-[11px] font-bold text-black/60"
                                          >
                                            {item}
                                          </span>
                                        ),
                                      )}

                                    </div>

                                  </div>

                                </div>


                                <button
                                  type="button"
                                  onClick={() =>
                                    setVariantPreview({
                                      url: getAssetUrl(
                                        variant.url,
                                      ),
                                      name:
                                        variantInfo.title,
                                      width:
                                        variant.width,
                                      height:
                                        variant.height,
                                    })
                                  }
                                  className="w-full rounded-full bg-black px-4 py-2.5 text-xs font-black text-white transition hover:-translate-y-0.5"
                                >
                                  Preview Variant
                                </button>


                              </div>

                            </div>
                          );

                        })}

                      </div>

                    </div>
                  </Show>

                  <Show when={selectedMedia.type === "IMAGE"}>
                    <div className="mb-5">
                      <button
                        type="button"
                        onClick={() => setCropOpen(true)}
                        className="w-full rounded-full bg-[#039147] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5"
                      >
                        Crop Image
                      </button>
                    </div>
                  </Show>

                  <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() =>
                        void copyUrl(selectedMedia.url, selectedMedia.id)
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
                        Title
                      </span>

                      <input
                        value={form.title}
                        onChange={(event) =>
                          updateField(
                            "title",
                            event.target.value,
                          )
                        }
                        placeholder="SEO title for this media asset"
                        className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm font-bold text-black outline-none placeholder:text-black/25 focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                      />
                    </label>

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
                        Description
                      </span>

                      <textarea
                        rows={5}
                        value={form.description}
                        onChange={(event) =>
                          updateField(
                            "description",
                            event.target.value,
                          )
                        }
                        placeholder="Describe this media asset for SEO and content context"
                        className="resize-y rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold leading-6 text-black outline-none placeholder:text-black/25 focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
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
                        Tags
                      </span>

                      <input
                        value={form.tags}
                        onChange={(event) =>
                          updateField(
                            "tags",
                            event.target.value,
                          )
                        }
                        placeholder="laboratory, clinical research, facility"
                        className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm font-bold text-black outline-none placeholder:text-black/25 focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
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
      </Show>
      <Show when={Boolean(cropOpen && selectedMedia)}>
        <MediaCropModal
          imageUrl={getSelectedMediaUrl(selectedMedia)}
          onClose={() => setCropOpen(false)}
          onSave={handleCropSave}
        />
      </Show>


      <Show when={Boolean(variantPreview)}>
        <MediaVariantPreviewModal
          open={Boolean(variantPreview)}
          url={activeVariantPreview.url}
          name={activeVariantPreview.name}
          width={activeVariantPreview.width}
          height={activeVariantPreview.height}
          onClose={() => setVariantPreview(null)}
          onCopy={() => void handleVariantCopy(activeVariantPreview.url)}
          onUse={() => {
            setMessage("Variant image ready to use.");
            setMessageTone("success");
            setVariantPreview(null);
          }}
        />
      </Show>

    </AdminShell>
  );
}
