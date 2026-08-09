"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

import AdminShell from "@/components/admin/AdminShell";
import AdminState from "@/components/admin/AdminState";
import MediaPicker from "@/components/admin/MediaPicker";
import {
  AdminCareerDocumentationItem,
  PageSeoStatus,
  createAdminCareerDocumentation,
  deleteAdminCareerDocumentation,
  getAdminCareerDocumentation,
  getAdminToken,
  updateAdminCareerDocumentation,
} from "@/lib/admin-api";
import {
  MediaReference,
  createMediaReference,
  resolveMediaUrl,
} from "@/lib/media";

type DocumentationForm = {
  id: string;
  titleEn: string;
  titleId: string;
  descriptionEn: string;
  descriptionId: string;
  category: string;
  documentationDate: string;
  displayOrder: string;
  status: PageSeoStatus;
  image: string;
  mediaReference: MediaReference | null;
};

const emptyForm: DocumentationForm = {
  id: "",
  titleEn: "",
  titleId: "",
  descriptionEn: "",
  descriptionId: "",
  category: "Interview Process",
  documentationDate: "",
  displayOrder: "0",
  status: "DRAFT",
  image: "",
  mediaReference: null,
};

const categories = [
  "Interview Process",
  "Assessment",
  "Recruitment Activity",
  "Career Event",
  "Onboarding",
  "Team / Culture",
  "Other",
];

function mapItem(item: AdminCareerDocumentationItem): DocumentationForm {
  return {
    id: item.id,
    titleEn: item.titleEn,
    titleId: item.titleId || "",
    descriptionEn: item.descriptionEn || "",
    descriptionId: item.descriptionId || "",
    category: item.category,
    documentationDate: item.documentationDate?.slice(0, 10) || "",
    displayOrder: String(item.displayOrder),
    status: item.status,
    image:
      item.mediaReference?.url || item.media?.url || "",
    mediaReference:
      item.mediaReference ||
      createMediaReference(item.media?.url, { mediaId: item.mediaId }),
  };
}

function formatDate(value: string | null) {
  if (!value) return "Date not set";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function AdminCareerDocumentationPage() {
  const [items, setItems] = useState<AdminCareerDocumentationItem[]>([]);
  const [form, setForm] = useState<DocumentationForm>(emptyForm);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [deleteArmed, setDeleteArmed] = useState(false);

  const selectedItem = useMemo(
    () => items.find((item) => item.id === form.id) || null,
    [form.id, items],
  );

  const loadItems = useCallback(async () => {
    const token = getAdminToken();

    if (!token) {
      setStatus("error");
      setMessage("Admin token not found. Please login again.");
      return;
    }

    try {
      const data = await getAdminCareerDocumentation(token);
      setItems(data);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to load career documentation.",
      );
    }
  }, []);

  useEffect(() => {
    const token = getAdminToken();

    if (!token) {
      queueMicrotask(() => {
        setStatus("error");
        setMessage("Admin token not found. Please login again.");
      });
      return;
    }

    void getAdminCareerDocumentation(token)
      .then((data) => {
        setItems(data);
        setStatus("success");
      })
      .catch((error: unknown) => {
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "Failed to load career documentation.",
        );
      });
  }, []);

  const updateField = <K extends keyof DocumentationForm>(
    key: K,
    value: DocumentationForm[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const startCreate = () => {
    setForm(emptyForm);
    setMessage("");
    setDeleteArmed(false);
  };

  const selectItem = (item: AdminCareerDocumentationItem) => {
    setForm(mapItem(item));
    setMessage("");
    setDeleteArmed(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = getAdminToken();

    if (!token) {
      setMessage("Admin token not found. Please login again.");
      return;
    }

    if (!form.mediaReference?.mediaId) {
      setMessage("Select an image from the Media Library before saving.");
      return;
    }

    const payload = {
      titleEn: form.titleEn,
      titleId: form.titleId || null,
      descriptionEn: form.descriptionEn || null,
      descriptionId: form.descriptionId || null,
      category: form.category,
      documentationDate: form.documentationDate
        ? new Date(`${form.documentationDate}T00:00:00`).toISOString()
        : null,
      displayOrder: Number(form.displayOrder) || 0,
      status: form.status,
      mediaId: form.mediaReference.mediaId,
      mediaReference: form.mediaReference,
    };

    setSaving(true);
    setMessage("");

    try {
      const saved = form.id
        ? await updateAdminCareerDocumentation(token, form.id, payload)
        : await createAdminCareerDocumentation(token, payload);

      setForm(mapItem(saved));
      setMessage(
        form.id
          ? "Documentation updated successfully."
          : "Documentation created successfully.",
      );
      await loadItems();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save career documentation.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!form.id) return;

    if (!deleteArmed) {
      setDeleteArmed(true);
      setMessage("Click Confirm Delete to permanently remove this item.");
      return;
    }

    const token = getAdminToken();
    if (!token) return;

    setSaving(true);

    try {
      await deleteAdminCareerDocumentation(token, form.id);
      setForm(emptyForm);
      setDeleteArmed(false);
      setMessage("Documentation deleted successfully.");
      await loadItems();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to delete documentation.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#039147]">
            Career CMS
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-black md:text-5xl">
            Career Documentation
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-black/50">
            Manage recruitment and career-related documentation displayed on
            the Careers page.
          </p>
        </div>

        <button
          type="button"
          onClick={startCreate}
          className="w-fit rounded-full bg-[#039147] px-6 py-3 text-sm font-black text-white shadow-[0_18px_50px_rgba(3,145,71,0.22)] transition hover:-translate-y-0.5"
        >
          Add Documentation
        </button>
      </div>

      {status === "loading" ? (
        <AdminState
          title="Loading career documentation"
          description="Please wait while the CMS loads documentation data."
        />
      ) : null}

      {status === "error" ? (
        <AdminState
          title="Unable to load career documentation"
          description={message}
          tone="error"
        />
      ) : null}

      {status === "success" ? (
        <div className="grid gap-6 xl:grid-cols-[0.82fr_1.3fr]">
          <section className="rounded-[30px] border border-black/5 bg-white p-5 shadow-[0_22px_70px_rgba(0,0,0,0.08)] md:p-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                  Documentation List
                </p>
                <h2 className="mt-2 text-2xl font-black text-black">
                  Career Moments
                </h2>
              </div>
              <span className="rounded-full bg-[#f6faf7] px-4 py-2 text-xs font-black text-black/50">
                {items.length} items
              </span>
            </div>

            <div className="grid gap-3">
              {items.map((item) => {
                const imageUrl = resolveMediaUrl(
                  item.mediaReference || item.media?.url,
                );

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectItem(item)}
                    className={`grid grid-cols-[88px_1fr] gap-4 rounded-2xl border p-3 text-left transition ${
                      item.id === form.id
                        ? "border-[#039147] bg-[#eaf8f0]"
                        : "border-black/5 bg-[#f8fbf9] hover:border-[#039147]/25"
                    }`}
                  >
                    <div className="relative h-20 overflow-hidden rounded-xl bg-white">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={item.media?.altText || item.titleEn}
                          fill
                          sizes="88px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-2 text-sm font-black text-black">
                          {item.titleEn}
                        </h3>
                        <span className="rounded-full bg-white px-2 py-1 text-[9px] font-black text-[#039147]">
                          {item.status}
                        </span>
                      </div>
                      <p className="mt-2 text-[11px] font-bold text-black/45">
                        {item.category} · Order {item.displayOrder}
                      </p>
                      <p className="mt-1 text-[11px] text-black/35">
                        {formatDate(item.documentationDate)}
                      </p>
                    </div>
                  </button>
                );
              })}

              {items.length === 0 ? (
                <AdminState
                  title="No documentation yet"
                  description="Add the first recruitment or career documentation item."
                />
              ) : null}
            </div>
          </section>

          <form
            onSubmit={handleSubmit}
            className="rounded-[30px] border border-black/5 bg-white p-5 shadow-[0_22px_70px_rgba(0,0,0,0.08)] md:p-7"
          >
            <div className="mb-6">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                {selectedItem ? "Edit Documentation" : "New Documentation"}
              </p>
              <h2 className="mt-2 text-2xl font-black text-black">
                Documentation Details
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {[
                ["titleEn", "Title EN"],
                ["titleId", "Title ID"],
              ].map(([key, label]) => (
                <label key={key} className="grid gap-2">
                  <span className="text-sm font-black text-black">{label}</span>
                  <input
                    value={form[key as "titleEn" | "titleId"]}
                    onChange={(event) =>
                      updateField(
                        key as "titleEn" | "titleId",
                        event.target.value,
                      )
                    }
                    required={key === "titleEn"}
                    className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold outline-none focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                  />
                </label>
              ))}

              {[
                ["descriptionEn", "Description EN"],
                ["descriptionId", "Description ID"],
              ].map(([key, label]) => (
                <label key={key} className="grid gap-2">
                  <span className="text-sm font-black text-black">{label}</span>
                  <textarea
                    rows={5}
                    value={
                      form[key as "descriptionEn" | "descriptionId"]
                    }
                    onChange={(event) =>
                      updateField(
                        key as "descriptionEn" | "descriptionId",
                        event.target.value,
                      )
                    }
                    className="resize-none rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-bold leading-7 outline-none focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                  />
                </label>
              ))}

              <label className="grid gap-2">
                <span className="text-sm font-black text-black">Category</span>
                <select
                  value={form.category}
                  onChange={(event) =>
                    updateField("category", event.target.value)
                  }
                  className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold outline-none focus:border-[#039147]"
                >
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black text-black">
                  Documentation Date
                </span>
                <input
                  type="date"
                  value={form.documentationDate}
                  onChange={(event) =>
                    updateField("documentationDate", event.target.value)
                  }
                  className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold outline-none focus:border-[#039147]"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black text-black">
                  Display Order
                </span>
                <input
                  type="number"
                  min="0"
                  value={form.displayOrder}
                  onChange={(event) =>
                    updateField("displayOrder", event.target.value)
                  }
                  className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold outline-none focus:border-[#039147]"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-black text-black">Status</span>
                <select
                  value={form.status}
                  onChange={(event) =>
                    updateField(
                      "status",
                      event.target.value as PageSeoStatus,
                    )
                  }
                  className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold outline-none focus:border-[#039147]"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </label>

              <div className="md:col-span-2">
                <MediaPicker
                  value={form.image}
                  onChange={(url) => updateField("image", url)}
                  onReferenceChange={(reference) =>
                    setForm((current) => ({
                      ...current,
                      image: reference?.url || "",
                      mediaReference: reference,
                    }))
                  }
                  folder="careers"
                  title="Documentation Image"
                  description="Select an image from the shared PML Media Library and review its title, alt text, caption, description, tags, filename, and folder metadata."
                  defaultVariant="card"
                />
              </div>
            </div>

            {message ? (
              <div className="mt-6 rounded-2xl border border-black/5 bg-[#f6faf7] p-4 text-sm font-bold text-black/70">
                {message}
              </div>
            ) : null}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
              {form.id ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={saving}
                  className="rounded-full border border-red-500/20 bg-red-50 px-7 py-3 text-sm font-black text-red-600"
                >
                  {deleteArmed ? "Confirm Delete" : "Delete"}
                </button>
              ) : null}

              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-[#039147] px-8 py-3 text-sm font-black text-white shadow-[0_18px_50px_rgba(3,145,71,0.24)] disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Documentation"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </AdminShell>
  );
}
