"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import AdminState from "@/components/admin/AdminState";
import {
  createAdminPopup,
  getAdminPopups,
  getAdminToken,
  PageSeoStatus,
  PopupFrequency,
  PopupItem,
  PopupLayout,
  updateAdminPopup,
  uploadAdminPopupImage,
} from "@/lib/admin-api";

type PopupForm = {
  id: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonUrl: string;
  imageUrl: string;
  type: "ANNOUNCEMENT" | "PROMOTION" | "ALERT" | "INFORMATION";
  status: PageSeoStatus;
  placementPages: string;
  frequency: PopupFrequency;
  layout: PopupLayout;
  startsAt: string;
  endsAt: string;
  priority: string;
};

const emptyForm: PopupForm = {
  id: "",
  title: "",
  description: "",
  buttonLabel: "Request a Proposal",
  buttonUrl: "/contact",
  imageUrl: "/images/pml/hero-lab-hexagon.png",
  type: "ANNOUNCEMENT",
  status: "DRAFT",
  placementPages: "/",
  frequency: "ONCE_PER_SESSION",
  layout: "IMAGE_LEFT",
  startsAt: "",
  endsAt: "",
  priority: "0",
};

const layoutOptions: Array<{
  value: PopupLayout;
  title: string;
  description: string;
}> = [
  {
    value: "IMAGE_LEFT",
    title: "Image Left",
    description: "Gambar di kiri, konten dan CTA di kanan.",
  },
  {
    value: "IMAGE_RIGHT",
    title: "Image Right",
    description: "Konten di kiri, gambar di kanan.",
  },
  {
    value: "IMAGE_TOP",
    title: "Image Top",
    description: "Gambar di atas, konten di bawah.",
  },
  {
    value: "TEXT_ONLY",
    title: "Text Only",
    description: "Tanpa gambar, fokus ke headline dan CTA.",
  },
];

function toDateTimeLocal(value: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 16);
}

function mapPopupToForm(item: PopupItem): PopupForm {
  return {
    id: item.id,
    title: item.title || "",
    description: item.description || "",
    buttonLabel: item.buttonLabel || "",
    buttonUrl: item.buttonUrl || "",
    imageUrl: item.imageUrl || "",
    type: item.type,
    status: item.status,
    placementPages: item.placementPages?.join("\n") || "/",
    frequency: item.frequency || "ONCE_PER_SESSION",
    layout: item.layout || "IMAGE_LEFT",
    startsAt: toDateTimeLocal(item.startsAt),
    endsAt: toDateTimeLocal(item.endsAt),
    priority: String(item.priority || 0),
  };
}

function toIsoOrNull(value: string) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString();
}

function getAssetUrl(value: string) {
  if (!value) return "";

  if (value.startsWith("http")) {
    return value;
  }

  if (value.startsWith("/uploads")) {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
      (process.env.NODE_ENV === "development" ? "http://localhost:4000" : "");

    return `${apiBaseUrl}${value}`;
  }

  return value;
}

export default function AdminPopupsPage() {
  const [items, setItems] = useState<PopupItem[]>([]);
  const [form, setForm] = useState<PopupForm>(emptyForm);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const selectedPopup = useMemo(() => {
    return items.find((item) => item.id === form.id) || null;
  }, [items, form.id]);

  const loadPopups = useCallback(async () => {
    const token = getAdminToken();

    if (!token) {
      setStatus("error");
      setMessage("Admin token not found. Please login again.");
      return;
    }

    try {
      const data = await getAdminPopups(token);
      setItems(data);
      setStatus("success");

      setForm((current) => {
        if (data.length > 0 && !current.id) {
          return mapPopupToForm(data[0]);
        }

        return current;
      });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Failed to load popups.");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadPopups();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadPopups]);

  const updateField = (key: keyof PopupForm, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setMessage("");
  };

  const selectPopup = (item: PopupItem) => {
    setForm(mapPopupToForm(item));
    setMessage("");
  };

  const handleImageUpload = async (file: File | null) => {
    if (!file) {
      return;
    }

    const token = getAdminToken();

    if (!token) {
      setMessage("Admin token not found. Please login again.");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const result = await uploadAdminPopupImage(token, file);
      updateField("imageUrl", result.url);
      setMessage("Popup image uploaded successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to upload popup image.");
    } finally {
      setUploading(false);
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
      buttonLabel: form.buttonLabel || null,
      buttonUrl: form.buttonUrl || null,
      imageUrl: form.imageUrl || null,
      type: form.type,
      status: form.status,
      placementPages: form.placementPages
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      frequency: form.frequency || "ONCE_PER_SESSION",
      layout: form.layout || "IMAGE_LEFT",
      startsAt: toIsoOrNull(form.startsAt),
      endsAt: toIsoOrNull(form.endsAt),
      priority: Number(form.priority || 0),
    };

    try {
      if (form.id) {
        await updateAdminPopup(token, form.id, payload);
        setMessage("Popup updated successfully.");
      } else {
        const created = await createAdminPopup(token, payload);
        setForm(mapPopupToForm(created));
        setMessage("Popup created successfully.");
      }

      await loadPopups();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save popup.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#039147]">
            Popup / Announcement CMS
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-black md:text-5xl">
            Popup Announcements
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-black/50">
            Manage homepage popup content, CTA button, schedule, active status, and once-per-session frequency.
          </p>
        </div>

        <button
          type="button"
          onClick={resetForm}
          className="w-fit rounded-full bg-[#039147] px-6 py-3 text-sm font-black text-white shadow-[0_18px_50px_rgba(3,145,71,0.22)] transition hover:-translate-y-0.5"
        >
          Create New Popup
        </button>
      </div>

      {status === "loading" ? (
        <AdminState title="Loading popups" description="Please wait while the CMS loads popup data." />
      ) : null}

      {status === "error" ? (
        <AdminState title="Unable to load popups" description={message} tone="error" />
      ) : null}

      {status === "success" ? (
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.3fr]">
          <section className="rounded-[30px] border border-black/5 bg-white p-5 shadow-[0_22px_70px_rgba(0,0,0,0.08)] backdrop-blur md:p-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                  Popup List
                </p>
                <h2 className="mt-2 text-2xl font-black text-black">
                  Existing Popups
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
                  onClick={() => selectPopup(item)}
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
                    <span>{item.frequency}</span>
                    <span>•</span>
                    <span>Priority {item.priority}</span>
                  </div>
                </button>
              ))}

              {items.length === 0 ? (
                <div className="rounded-2xl border border-black/5 bg-white5 p-5 text-sm font-bold text-black/45">
                  No popup yet. Create the first homepage announcement.
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
                  {selectedPopup ? "Edit Popup" : "Create Popup"}
                </p>
                <h2 className="mt-2 text-2xl font-black text-black">
                  Popup Content
                </h2>
              </div>

              <span className="w-fit rounded-full border border-black/5 bg-white5 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-black/50">
                Homepage only
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
                  rows={5}
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  className="resize-none rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-bold leading-7 text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black text-black">Button Label</span>
                <input
                  value={form.buttonLabel}
                  onChange={(event) => updateField("buttonLabel", event.target.value)}
                  className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black text-black">Button URL</span>
                <input
                  value={form.buttonUrl}
                  onChange={(event) => updateField("buttonUrl", event.target.value)}
                  className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                />
              </label>

              <div className="grid gap-4 rounded-[26px] border border-black/5 bg-white5 p-4 md:col-span-2 md:grid-cols-[0.9fr_1.1fr] md:p-5">
                <div className="overflow-hidden rounded-[22px] border border-black/5 bg-black/30">
                  {form.imageUrl && form.layout !== "TEXT_ONLY" ? (
                    <div className="relative h-56 w-full">
                      <Image
                        src={getAssetUrl(form.imageUrl)}
                        alt="Popup preview"
                        fill
                        sizes="(max-width: 768px) 100vw, 420px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="flex h-56 items-center justify-center px-6 text-center text-sm font-bold text-black/50">
                      {form.layout === "TEXT_ONLY"
                        ? "Text only layout tidak memakai gambar."
                        : "Upload atau isi Image URL untuk preview popup."}
                    </div>
                  )}
                </div>

                <div className="grid gap-4">
                  <label className="grid gap-2">
                    <span className="text-sm font-black text-black">Popup Image</span>
                    <span className="text-xs font-semibold leading-5 text-black/50">
                      Upload gambar JPG, PNG, atau WEBP. Idealnya landscape agar rapi di desktop dan mobile.
                    </span>

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
                      placeholder="/uploads/popups/image.png"
                      className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition placeholder:text-black/20 focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                    />

                    <span className="text-xs font-semibold text-black/50">
                      {uploading ? "Uploading image..." : "Bisa upload dari CMS atau paste URL manual."}
                    </span>
                  </label>
                </div>
              </div>

              <div className="grid gap-3 md:col-span-2">
                <div>
                  <span className="text-sm font-black text-black">Popup Layout</span>
                  <p className="mt-1 text-xs font-semibold leading-5 text-black/50">
                    Pilih komposisi popup. Di mobile layout akan otomatis dibuat stack agar tetap aman.
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-4">
                  {layoutOptions.map((layout) => (
                    <button
                      key={layout.value}
                      type="button"
                      onClick={() => updateField("layout", layout.value)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        form.layout === layout.value
                          ? "border-[#039147] bg-[#eaf8f0] text-black"
                          : "border-black/5 bg-white5 text-black/50 hover:border-white/20 hover:bg-white hover:text-black"
                      }`}
                    >
                      <span className="text-sm font-black">{layout.title}</span>
                      <span className="mt-2 block text-xs font-semibold leading-5 opacity-70">
                        {layout.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-black text-black">Type</span>
                <select
                  value={form.type}
                  onChange={(event) => updateField("type", event.target.value)}
                  className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                >
                  <option value="ANNOUNCEMENT">Announcement</option>
                  <option value="PROMOTION">Promotion</option>
                  <option value="ALERT">Alert</option>
                  <option value="INFORMATION">Information</option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black text-black">Status</span>
                <select
                  value={form.status}
                  onChange={(event) => updateField("status", event.target.value)}
                  className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black text-black">Starts At</span>
                <input
                  type="datetime-local"
                  value={form.startsAt}
                  onChange={(event) => updateField("startsAt", event.target.value)}
                  className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black text-black">Ends At</span>
                <input
                  type="datetime-local"
                  value={form.endsAt}
                  onChange={(event) => updateField("endsAt", event.target.value)}
                  className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black text-black">Priority</span>
                <input
                  type="number"
                  value={form.priority}
                  onChange={(event) => updateField("priority", event.target.value)}
                  className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black text-black">Frequency</span>
                <select
                  value={form.frequency}
                  onChange={(event) =>
                    updateField("frequency", event.target.value as PopupForm["frequency"])
                  }
                  className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                >
                  <option value="ONCE_PER_SESSION">Once per session</option>
                  <option value="ONCE_PER_DAY">Once per day</option>
                  <option value="ALWAYS">Always show</option>
                </select>
              </label>

              <label className="grid gap-2 md:col-span-2">
                <span className="text-sm font-black text-black">Placement Pages</span>
                <textarea
                  rows={3}
                  value={form.placementPages}
                  onChange={(event) => updateField("placementPages", event.target.value)}
                  className="resize-none rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-bold leading-7 text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                />
                <span className="text-xs font-semibold text-black/50">
                  Untuk Batch J8 ini isi <span className="font-mono text-[#039147]">/</span> saja supaya tampil hanya di homepage.
                </span>
              </label>
            </div>

            {message ? (
              <div className="mt-6 rounded-2xl border border-black/5 bg-white5 p-4 text-sm font-bold text-black/70">
                {message}
              </div>
            ) : null}

            <div className="mt-7 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-[#039147] px-8 py-4 text-sm font-black text-black shadow-[0_18px_50px_rgba(3,145,71,0.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving Popup..." : "Save Popup"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </AdminShell>
  );
}
