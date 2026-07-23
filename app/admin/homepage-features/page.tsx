"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import AdminState from "@/components/admin/AdminState";
import {
  HomepageFeatureItem,
  PageSeoStatus,
  archiveAdminHomepageFeature,
  createAdminHomepageFeature,
  getAdminHomepageFeatures,
  getAdminToken,
  updateAdminHomepageFeature,
  uploadAdminHomepageFeatureImage,
} from "@/lib/admin-api";

type HomepageFeatureForm = {
  id: string;
  title: string;
  description: string;
  type: string;
  referenceId: string;
  imageUrl: string;
  buttonLabel: string;
  buttonUrl: string;
  status: PageSeoStatus;
  sortOrder: string;
};

const emptyForm: HomepageFeatureForm = {
  id: "",
  title: "",
  description: "",
  type: "homepage_highlight",
  referenceId: "",
  imageUrl: "",
  buttonLabel: "",
  buttonUrl: "",
  status: "DRAFT",
  sortOrder: "0",
};

const featureTypes = [
  { label: "Homepage Highlight", value: "homepage_highlight" },
  { label: "Homepage CTA", value: "homepage_cta" },
  { label: "Homepage Insight", value: "homepage_insight" },
  { label: "Homepage Campaign", value: "homepage_campaign" },
  { label: "Featured Service", value: "featured_service" },
];

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

function mapFeatureToForm(item: HomepageFeatureItem): HomepageFeatureForm {
  return {
    id: item.id,
    title: item.title || "",
    description: item.description || "",
    type: item.type || "homepage_highlight",
    referenceId: item.referenceId || "",
    imageUrl: item.imageUrl || "",
    buttonLabel: item.buttonLabel || "",
    buttonUrl: item.buttonUrl || "",
    status: item.status,
    sortOrder: String(item.sortOrder || 0),
  };
}

export default function AdminHomepageFeaturesPage() {
  const [items, setItems] = useState<HomepageFeatureItem[]>([]);
  const [form, setForm] = useState<HomepageFeatureForm>(emptyForm);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState("");

  const selectedFeature = useMemo(() => {
    return items.find((item) => item.id === form.id) || null;
  }, [items, form.id]);

  const loadFeatures = useCallback(async () => {
    const token = getAdminToken();

    if (!token) {
      setStatus("error");
      setMessage("Admin token not found. Please login again.");
      return;
    }

    try {
      const data = await getAdminHomepageFeatures(token);
      setItems(data);
      setStatus("success");

      setForm((current) => {
        if (data.length > 0 && !current.id) {
          return mapFeatureToForm(data[0]);
        }

        return current;
      });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Failed to load homepage features.");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadFeatures();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadFeatures]);

  const updateField = (key: keyof HomepageFeatureForm, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setMessage("");
  };

  const selectFeature = (item: HomepageFeatureItem) => {
    setForm(mapFeatureToForm(item));
    setMessage("");
  };

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;

    const token = getAdminToken();

    if (!token) {
      setMessage("Admin token not found. Please login again.");
      return;
    }

    setUploadingImage(true);
    setMessage("");

    try {
      const result = await uploadAdminHomepageFeatureImage(token, file);
      updateField("imageUrl", result.url);
      setMessage("Image uploaded successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleArchive = async () => {
    if (!form.id) {
      setMessage("Please select a homepage feature first.");
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
      const archived = await archiveAdminHomepageFeature(token, form.id);
      setForm(mapFeatureToForm(archived));
      await loadFeatures();
      setMessage("Homepage feature archived successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to archive homepage feature.");
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
      description: form.description || null,
      type: form.type,
      referenceId: form.referenceId || null,
      imageUrl: form.imageUrl || null,
      buttonLabel: form.buttonLabel || null,
      buttonUrl: form.buttonUrl || null,
      status: form.status,
      sortOrder: Number(form.sortOrder || 0),
    };

    try {
      if (form.id) {
        const updated = await updateAdminHomepageFeature(token, form.id, payload);
        setForm(mapFeatureToForm(updated));
        setMessage("Homepage feature updated successfully.");
      } else {
        const created = await createAdminHomepageFeature(token, payload);
        setForm(mapFeatureToForm(created));
        setMessage("Homepage feature created successfully.");
      }

      await loadFeatures();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save homepage feature.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#039147]">
            Homepage CMS
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-black md:text-5xl">
            Homepage Features
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-black/50">
            Manage homepage highlights, CTA blocks, featured insight, campaign cards, and homepage promotional content.
          </p>
        </div>

        <button
          type="button"
          onClick={resetForm}
          className="w-fit rounded-full bg-[#039147] px-6 py-3 text-sm font-black text-white shadow-[0_18px_50px_rgba(3,145,71,0.22)] transition hover:-translate-y-0.5"
        >
          Create New Feature
        </button>
      </div>

      {status === "loading" ? (
        <AdminState title="Loading homepage features" description="Please wait while the CMS loads homepage feature data." />
      ) : null}

      {status === "error" ? (
        <AdminState title="Unable to load homepage features" description={message} tone="error" />
      ) : null}

      {status === "success" ? (
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.3fr]">
          <section className="rounded-[30px] border border-black/5 bg-white p-5 shadow-[0_22px_70px_rgba(0,0,0,0.08)] backdrop-blur md:p-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                  Feature List
                </p>
                <h2 className="mt-2 text-2xl font-black text-black">
                  Existing Features
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
                  onClick={() => selectFeature(item)}
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
                    <span>{item.type}</span>
                    <span>•</span>
                    <span>Order {item.sortOrder}</span>
                  </div>
                </button>
              ))}

              {items.length === 0 ? (
                <div className="rounded-2xl border border-black/5 bg-white5 p-5 text-sm font-bold text-black/45">
                  No homepage feature yet. Create the first homepage content block.
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
                  {selectedFeature ? "Edit Feature" : "Create Feature"}
                </p>
                <h2 className="mt-2 text-2xl font-black text-black">
                  Homepage Feature Content
                </h2>
              </div>

              <span className="w-fit rounded-full border border-black/5 bg-white5 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-black/50">
                {form.type}
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

              <label className="grid gap-2 md:col-span-2">
                <span className="text-sm font-black text-black">Description</span>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  className="resize-none rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-bold leading-7 text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black text-black">Feature Type</span>
                <select
                  value={form.type}
                  onChange={(event) => updateField("type", event.target.value)}
                  className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                >
                  {featureTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black text-black">Reference ID</span>
                <input
                  value={form.referenceId}
                  onChange={(event) => updateField("referenceId", event.target.value)}
                  placeholder="services / insight / proposal"
                  className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition placeholder:text-black/20 focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                />
              </label>

              <div className="grid gap-4 rounded-[26px] border border-black/5 bg-white5 p-4 md:col-span-2 md:grid-cols-[0.9fr_1.1fr] md:p-5">
                <div className="overflow-hidden rounded-[22px] border border-black/5 bg-black/30">
                  {form.imageUrl ? (
                    <div className="relative h-56 w-full">
                      <Image
                        src={getAssetUrl(form.imageUrl)}
                        alt="Homepage feature preview"
                        fill
                        sizes="(max-width: 768px) 100vw, 420px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="flex h-56 items-center justify-center px-6 text-center text-sm font-bold text-black/50">
                      Upload image to preview homepage feature.
                    </div>
                  )}
                </div>

                <label className="grid gap-2">
                  <span className="text-sm font-black text-black">Image</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) => {
                      void handleImageUpload(event.target.files?.[0] || null);
                      event.target.value = "";
                    }}
                    className="rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-bold text-black file:mr-4 file:rounded-full file:border-0 file:bg-[#039147] file:px-4 file:py-2 file:text-xs file:font-black file:text-black"
                  />

                  <input
                    value={form.imageUrl}
                    onChange={(event) => updateField("imageUrl", event.target.value)}
                    placeholder="/uploads/homepage-features/image.png"
                    className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition placeholder:text-black/20 focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                  />

                  <span className="text-xs font-semibold text-black/50">
                    {uploadingImage ? "Uploading image..." : "Upload image or paste image URL manually."}
                  </span>
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-black text-black">Button Label</span>
                <input
                  value={form.buttonLabel}
                  onChange={(event) => updateField("buttonLabel", event.target.value)}
                  placeholder="Explore Services"
                  className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition placeholder:text-black/20 focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black text-black">Button URL</span>
                <input
                  value={form.buttonUrl}
                  onChange={(event) => updateField("buttonUrl", event.target.value)}
                  placeholder="/services"
                  className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition placeholder:text-black/20 focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                />
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
                disabled={saving || uploadingImage}
                className="rounded-full bg-[#039147] px-8 py-4 text-sm font-black text-black shadow-[0_18px_50px_rgba(3,145,71,0.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving Feature..." : "Save Feature"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </AdminShell>
  );
}
