"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import AdminState from "@/components/admin/AdminState";
import {
  AdminCatalogueItem,
  CatalogueDownloadMode,
  PageSeoStatus,
  archiveAdminCatalogue,
  createAdminCatalogue,
  getAdminCatalogues,
  getAdminToken,
  updateAdminCatalogue,
  uploadAdminCatalogueCover,
  uploadAdminCatalogueFile,
} from "@/lib/admin-api";

type CatalogueForm = {
  id: string;
  title: string;
  slug: string;
  description: string;
  serviceType: string;
  fileUrl: string;
  coverImage: string;
  downloadMode: CatalogueDownloadMode;
  status: PageSeoStatus;
  sortOrder: string;
};

const emptyForm: CatalogueForm = {
  id: "",
  title: "",
  slug: "",
  description: "",
  serviceType: "",
  fileUrl: "",
  coverImage: "",
  downloadMode: "REQUEST_REQUIRED",
  status: "DRAFT",
  sortOrder: "0",
};

const serviceTypes = [
  "Company Profile",
  "BA/BE Study",
  "Clinical Trial",
  "Contract Analysis",
  "Regulatory Management",
];

function mapCatalogueToForm(item: AdminCatalogueItem): CatalogueForm {
  return {
    id: item.id,
    title: item.title || "",
    slug: item.slug || "",
    description: item.description || "",
    serviceType: item.serviceType || "",
    fileUrl: item.fileUrl || "",
    coverImage: item.coverImage || "",
    downloadMode: item.downloadMode || "REQUEST_REQUIRED",
    status: item.status,
    sortOrder: String(item.sortOrder || 0),
  };
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

export default function AdminCataloguesPage() {
  const [items, setItems] = useState<AdminCatalogueItem[]>([]);
  const [form, setForm] = useState<CatalogueForm>(emptyForm);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [message, setMessage] = useState("");

  const selectedCatalogue = useMemo(() => {
    return items.find((item) => item.id === form.id) || null;
  }, [items, form.id]);

  const loadCatalogues = useCallback(async () => {
    const token = getAdminToken();

    if (!token) {
      setStatus("error");
      setMessage("Admin token not found. Please login again.");
      return;
    }

    try {
      const data = await getAdminCatalogues(token);
      setItems(data);
      setStatus("success");

      setForm((current) => {
        if (data.length > 0 && !current.id) {
          return mapCatalogueToForm(data[0]);
        }

        return current;
      });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Failed to load catalogues.");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadCatalogues();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadCatalogues]);

  const updateField = (key: keyof CatalogueForm, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setMessage("");
  };

  const selectCatalogue = (item: AdminCatalogueItem) => {
    setForm(mapCatalogueToForm(item));
    setMessage("");
  };

  const handleCoverUpload = async (file: File | null) => {
    if (!file) return;

    const token = getAdminToken();

    if (!token) {
      setMessage("Admin token not found. Please login again.");
      return;
    }

    setUploadingCover(true);
    setMessage("");

    try {
      const result = await uploadAdminCatalogueCover(token, file);
      updateField("coverImage", result.url);
      setMessage("Cover image uploaded successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to upload cover image.");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;

    const token = getAdminToken();

    if (!token) {
      setMessage("Admin token not found. Please login again.");
      return;
    }

    setUploadingFile(true);
    setMessage("");

    try {
      const result = await uploadAdminCatalogueFile(token, file);
      updateField("fileUrl", result.url);
      setMessage("PDF catalogue uploaded successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to upload PDF catalogue.");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleArchive = async () => {
    if (!form.id) {
      setMessage("Please select a catalogue first.");
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
      const archived = await archiveAdminCatalogue(token, form.id);
      setForm(mapCatalogueToForm(archived));
      await loadCatalogues();
      setMessage("Catalogue archived successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to archive catalogue.");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = getAdminToken();

    if (!token) {
      setMessage("Admin token not found. Please login again.");
      return;
    }

    setSaving(true);
    setMessage("");

    const payload = {
      title: form.title,
      slug: form.slug || undefined,
      description: form.description || null,
      serviceType: form.serviceType || null,
      fileUrl: form.fileUrl || null,
      coverImage: form.coverImage || null,
      downloadMode: form.downloadMode,
      status: form.status,
      sortOrder: Number(form.sortOrder || 0),
    };

    try {
      if (form.id) {
        const updated = await updateAdminCatalogue(token, form.id, payload);
        setForm(mapCatalogueToForm(updated));
        setMessage("Catalogue updated successfully.");
      } else {
        const created = await createAdminCatalogue(token, payload);
        setForm(mapCatalogueToForm(created));
        setMessage("Catalogue created successfully.");
      }

      await loadCatalogues();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save catalogue.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#039147]">
            Catalogue CMS
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-black md:text-5xl">
            Catalogue Library
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-black/50">
            Manage public catalogue cards, PDF files, cover images, categories, download mode, and publishing status.
          </p>
        </div>

        <button
          type="button"
          onClick={resetForm}
          className="w-fit rounded-full bg-[#039147] px-6 py-3 text-sm font-black text-white shadow-[0_18px_50px_rgba(3,145,71,0.22)] transition hover:-translate-y-0.5"
        >
          Create New Catalogue
        </button>
      </div>

      {status === "loading" ? (
        <AdminState title="Loading catalogues" description="Please wait while the CMS loads catalogue data." />
      ) : null}

      {status === "error" ? (
        <AdminState title="Unable to load catalogues" description={message} tone="error" />
      ) : null}

      {status === "success" ? (
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.3fr]">
          <section className="rounded-[30px] border border-black/5 bg-white p-5 shadow-[0_22px_70px_rgba(0,0,0,0.08)] backdrop-blur md:p-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                  Catalogue List
                </p>
                <h2 className="mt-2 text-2xl font-black text-black">
                  Existing Catalogues
                </h2>
              </div>

              <span className="rounded-full border border-black/5 bg-white5 px-4 py-2 text-xs font-black text-black/50">
                {items.length} items
              </span>
            </div>

            <div className="grid gap-3">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectCatalogue(item)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    item.id === form.id
                      ? "border-[#039147] bg-[#eaf8f0]"
                      : "border-black/5 bg-white5 hover:border-white/20 hover:bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-black text-black">{item.title}</h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-black/45">
                        {item.description || "No description"}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-black ${
                        item.status === "PUBLISHED"
                          ? "bg-[#039147]/20 text-[#039147]"
                          : "bg-white/10 text-black/45"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.1em] text-black/50">
                    <span>{item.serviceType || "No Category"}</span>
                    <span>•</span>
                    <span>{item.downloadMode}</span>
                    <span>•</span>
                    <span>{item._count?.requests || 0} requests</span>
                  </div>
                </button>
              ))}

              {items.length === 0 ? (
                <div className="rounded-2xl border border-black/5 bg-white5 p-5 text-sm font-bold text-black/45">
                  No catalogue yet. Create the first catalogue item.
                </div>
              ) : null}
            </div>
          </section>

          <form
            onSubmit={handleSubmit}
            className="rounded-[30px] border border-black/5 bg-white p-5 shadow-[0_22px_70px_rgba(0,0,0,0.08)] backdrop-blur md:p-7"
          >
            <div className="mb-6 flex flex-col justify-between gap-2 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                  {selectedCatalogue ? "Edit Catalogue" : "Create Catalogue"}
                </p>
                <h2 className="mt-2 text-2xl font-black text-black">
                  Catalogue Content
                </h2>
              </div>

              <span className="w-fit rounded-full border border-black/5 bg-white5 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-black/50">
                {form.downloadMode === "PUBLIC_DOWNLOAD" ? "Public Download" : "Request Required"}
              </span>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 md:col-span-2">
                <span className="text-sm font-black text-black">Title</span>
                <input
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                  required
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black text-black">Slug</span>
                <input
                  value={form.slug}
                  onChange={(event) => updateField("slug", event.target.value)}
                  className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                  placeholder="babe-catalogue"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black text-black">Category</span>
                <select
                  value={form.serviceType}
                  onChange={(event) => updateField("serviceType", event.target.value)}
                  className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                >
                  <option value="">Choose category</option>
                  {serviceTypes.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 md:col-span-2">
                <span className="text-sm font-black text-black">Description</span>
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  className="resize-none rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-bold leading-7 text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                />
              </label>

              <div className="grid gap-4 rounded-[26px] border border-black/5 bg-white5 p-4 md:col-span-2 md:grid-cols-[0.9fr_1.1fr] md:p-5">
                <div className="overflow-hidden rounded-[22px] border border-black/5 bg-black/30">
                  {form.coverImage ? (
                    <div className="relative h-56 w-full">
                      <Image
                        src={getAssetUrl(form.coverImage)}
                        alt="Catalogue cover preview"
                        fill
                        sizes="(max-width: 768px) 100vw, 420px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="flex h-56 items-center justify-center px-6 text-center text-sm font-bold text-black/50">
                      Upload cover image to preview catalogue card.
                    </div>
                  )}
                </div>

                <div className="grid gap-4">
                  <label className="grid gap-2">
                    <span className="text-sm font-black text-black">Cover Image</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(event) => {
                        void handleCoverUpload(event.target.files?.[0] || null);
                        event.target.value = "";
                      }}
                      className="rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-bold text-black file:mr-4 file:rounded-full file:border-0 file:bg-[#039147] file:px-4 file:py-2 file:text-xs file:font-black file:text-black"
                    />

                    <input
                      value={form.coverImage}
                      onChange={(event) => updateField("coverImage", event.target.value)}
                      placeholder="/uploads/catalogues/covers/image.png"
                      className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition placeholder:text-black/20 focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                    />

                    <span className="text-xs font-semibold text-black/50">
                      {uploadingCover ? "Uploading cover..." : "Upload image or paste cover URL manually."}
                    </span>
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-black text-black">PDF Catalogue</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(event) => {
                        void handleFileUpload(event.target.files?.[0] || null);
                        event.target.value = "";
                      }}
                      className="rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-bold text-black file:mr-4 file:rounded-full file:border-0 file:bg-[#039147] file:px-4 file:py-2 file:text-xs file:font-black file:text-black"
                    />

                    <input
                      value={form.fileUrl}
                      onChange={(event) => updateField("fileUrl", event.target.value)}
                      placeholder="/uploads/catalogues/files/catalogue.pdf"
                      className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition placeholder:text-black/20 focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                    />

                    <span className="text-xs font-semibold text-black/50">
                      {uploadingFile ? "Uploading PDF..." : "Upload PDF or paste file URL manually."}
                    </span>
                  </label>
                </div>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-black text-black">Download Mode</span>
                <select
                  value={form.downloadMode}
                  onChange={(event) =>
                    updateField("downloadMode", event.target.value as CatalogueDownloadMode)
                  }
                  className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                >
                  <option value="REQUEST_REQUIRED">Request Required</option>
                  <option value="PUBLIC_DOWNLOAD">Public Download</option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black text-black">Status</span>
                <select
                  value={form.status}
                  onChange={(event) => updateField("status", event.target.value as PageSeoStatus)}
                  className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black text-black">Sort Order</span>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(event) => updateField("sortOrder", event.target.value)}
                  className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                />
              </label>
            </div>

            {message ? (
              <div className="mt-6 rounded-2xl border border-black/5 bg-white5 p-4 text-sm font-bold text-black/70">
                {message}
              </div>
            ) : null}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
              {form.id ? (
                <button
                  type="button"
                  onClick={handleArchive}
                  disabled={saving}
                  className="rounded-full border border-red-400/30 bg-red-500/10 px-8 py-4 text-sm font-black text-red-200 transition hover:bg-red-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Archive
                </button>
              ) : null}

              <button
                type="submit"
                disabled={saving || uploadingCover || uploadingFile}
                className="rounded-full bg-[#039147] px-8 py-4 text-sm font-black text-black shadow-[0_18px_50px_rgba(3,145,71,0.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving Catalogue..." : "Save Catalogue"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </AdminShell>
  );
}
