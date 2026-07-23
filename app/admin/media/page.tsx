"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
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

function formatSize(size: number | null) {
  if (!size) return "-";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function getAssetUrl(value: string) {
  if (!value) return "";

  if (value.startsWith("http")) return value;

  if (value.startsWith("/uploads")) {
    const apiOrigin =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
      (process.env.NODE_ENV === "development" ? "http://localhost:4000" : "");

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
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadFolder, setUploadFolder] = useState("general");

  const selectedMedia = useMemo(() => {
    return items.find((item) => item.id === form.id) || null;
  }, [items, form.id]);

  const loadMedia = useCallback(async () => {
    const token = getAdminToken();

    if (!token) {
      setStatus("error");
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

        return current;
      });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Failed to load media library.");
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

  const updateField = (key: keyof MediaForm, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
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
      const uploaded = await uploadAdminMediaAsset(token, file, uploadFolder || "general");
      setForm(mapMediaToForm(uploaded));
      await loadMedia();
      setMessage("Media uploaded successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to upload media.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.id) {
      setMessage("Please select media asset first.");
      return;
    }

    const token = getAdminToken();

    if (!token) {
      setMessage("Admin token not found. Please login again.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const updated = await updateAdminMediaAsset(token, form.id, {
        altText: form.altText || null,
        caption: form.caption || null,
        folder: form.folder || null,
        type: form.type,
      });

      setForm(mapMediaToForm(updated));
      await loadMedia();
      setMessage("Media metadata updated successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to update media.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!form.id) {
      setMessage("Please select media asset first.");
      return;
    }

    const token = getAdminToken();

    if (!token) {
      setMessage("Admin token not found. Please login again.");
      return;
    }

    const confirmed = window.confirm(
      "Delete this media library record? The uploaded physical file may still remain on server storage."
    );

    if (!confirmed) return;

    setSaving(true);
    setMessage("");

    try {
      await deleteAdminMediaAsset(token, form.id);
      setForm(emptyForm);
      await loadMedia();
      setMessage("Media library record deleted successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to delete media.");
    } finally {
      setSaving(false);
    }
  };

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setMessage("Media URL copied to clipboard.");
  };

  return (
    <AdminShell>
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#039147]">
            Media Library
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-black md:text-5xl">
            Media Assets
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-black/50">
            Upload, organize, preview, and copy media URLs for popup, catalogue, insight, homepage, and other CMS content.
          </p>
        </div>

        <div className="grid gap-3 rounded-[24px] border border-black/5 bg-white p-4">
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-black/50">
              Upload Folder
            </span>
            <input
              value={uploadFolder}
              onChange={(event) => setUploadFolder(event.target.value)}
              className="h-11 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none"
            />
          </label>

          <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[#039147] px-6 py-3 text-sm font-black text-white shadow-[0_18px_50px_rgba(3,145,71,0.22)] transition hover:-translate-y-0.5">
            {uploading ? "Uploading..." : "Upload Media"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,application/pdf,video/mp4"
              onChange={handleUpload}
              disabled={uploading}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      {status === "loading" ? (
        <AdminState title="Loading media library" description="Please wait while the CMS loads media assets." />
      ) : null}

      {status === "error" ? (
        <AdminState title="Unable to load media library" description={message} tone="error" />
      ) : null}

      {status === "success" ? (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[30px] border border-black/5 bg-white p-5 shadow-[0_22px_70px_rgba(0,0,0,0.08)] backdrop-blur md:p-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                  Library
                </p>
                <h2 className="mt-2 text-2xl font-black text-black">
                  Uploaded Media
                </h2>
              </div>

              <span className="rounded-full border border-black/5 bg-white5 px-4 py-2 text-xs font-black text-black/50">
                {items.length} assets
              </span>
            </div>

            {items.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setForm(mapMediaToForm(item));
                      setMessage("");
                    }}
                    className={`overflow-hidden rounded-[24px] border text-left transition ${
                      item.id === form.id
                        ? "border-[#039147] bg-[#eaf8f0]"
                        : "border-black/5 bg-white5 hover:border-white/20 hover:bg-white"
                    }`}
                  >
                    <div className="relative h-36 bg-black/40">
                      {item.type === "IMAGE" ? (
                        <Image
                          src={getAssetUrl(item.url)}
                          alt={item.altText || item.originalName || item.filename}
                          fill
                          sizes="280px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-4 text-center text-xs font-black uppercase tracking-[0.14em] text-black/45">
                          {item.type}
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <p className="line-clamp-1 text-sm font-black text-black">
                        {item.originalName || item.filename}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.1em] text-black/50">
                        <span>{item.type}</span>
                        <span>•</span>
                        <span>{formatSize(item.size)}</span>
                        <span>•</span>
                        <span>{item.folder || "general"}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-black/5 bg-white5 p-8 text-center text-sm font-bold text-black/45">
                No media uploaded yet. Upload the first image, PDF, or document.
              </div>
            )}
          </section>

          <section className="rounded-[30px] border border-black/5 bg-white p-5 shadow-[0_22px_70px_rgba(0,0,0,0.08)] backdrop-blur md:p-7">
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
                <div className="mb-5 overflow-hidden rounded-[24px] border border-black/5 bg-white">
                  {selectedMedia.type === "IMAGE" ? (
                    <div className="relative h-64">
                      <Image
                        src={getAssetUrl(selectedMedia.url)}
                        alt={selectedMedia.altText || selectedMedia.originalName || selectedMedia.filename}
                        fill
                        sizes="420px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="flex h-40 items-center justify-center text-sm font-black uppercase tracking-[0.16em] text-black/45">
                      {selectedMedia.type}
                    </div>
                  )}

                  <div className="p-4">
                    <p className="break-all text-sm font-black text-black">
                      {selectedMedia.originalName || selectedMedia.filename}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-black/50">
                      {selectedMedia.mimeType || "-"} • {formatSize(selectedMedia.size)}
                    </p>
                  </div>
                </div>

                <div className="mb-5 rounded-[20px] border border-black/5 bg-white5 p-4">
                  <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-black/50">
                    Media URL
                  </p>
                  <p className="break-all rounded-2xl bg-white p-3 font-mono text-xs text-[#039147]">
                    {selectedMedia.url}
                  </p>
                  <button
                    type="button"
                    onClick={() => void copyUrl(selectedMedia.url)}
                    className="mt-3 rounded-full bg-white px-5 py-2.5 text-xs font-black text-[#039147] transition hover:bg-[#039147] hover:text-white"
                  >
                    Copy URL
                  </button>
                </div>

                <form onSubmit={handleSave} className="grid gap-5">
                  <label className="grid gap-2">
                    <span className="text-sm font-black text-black">Alt Text</span>
                    <input
                      value={form.altText}
                      onChange={(event) => updateField("altText", event.target.value)}
                      className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-black text-black">Caption</span>
                    <textarea
                      rows={3}
                      value={form.caption}
                      onChange={(event) => updateField("caption", event.target.value)}
                      className="resize-none rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-bold leading-7 text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                    />
                  </label>

                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-sm font-black text-black">Folder</span>
                      <input
                        value={form.folder}
                        onChange={(event) => updateField("folder", event.target.value)}
                        className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm font-black text-black">Type</span>
                      <select
                        value={form.type}
                        onChange={(event) => updateField("type", event.target.value)}
                        className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                      >
                        <option value="IMAGE">Image</option>
                        <option value="DOCUMENT">Document</option>
                        <option value="VIDEO">Video</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </label>
                  </div>

                  {message ? (
                    <div className="rounded-2xl border border-black/5 bg-white5 p-4 text-sm font-bold text-black/70">
                      {message}
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={saving}
                      className="rounded-full border border-red-400/30 bg-red-500/10 px-7 py-3.5 text-sm font-black text-red-200 transition hover:bg-red-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Delete Record
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-full bg-[#039147] px-7 py-3.5 text-sm font-black text-black shadow-[0_18px_50px_rgba(3,145,71,0.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Save Metadata"}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="rounded-2xl border border-black/5 bg-white5 p-8 text-center text-sm font-bold text-black/45">
                Select a media asset to preview and edit metadata.
              </div>
            )}
          </section>
        </div>
      ) : null}
    </AdminShell>
  );
}
