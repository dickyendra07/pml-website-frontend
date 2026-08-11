"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import AdminState from "@/components/admin/AdminState";
import MediaPicker from "@/components/admin/MediaPicker";
import FacilityGalleryManager, {
  FacilityGalleryItem,
} from "@/components/admin/FacilityGalleryManager";
import {
  AdminFacilityItem,
  PageSeoStatus,
  archiveAdminFacility,
  createAdminFacility,
  getAdminFacilities,
  getAdminToken,
  updateAdminFacility,
} from "@/lib/admin-api";
import { resolveMediaUrl } from "@/lib/media";

type FacilityForm = {
  id: string;
  key: string;
  titleEn: string;
  titleId: string;
  eyebrowEn: string;
  eyebrowId: string;
  summaryEn: string;
  summaryId: string;
  contentEn: string;
  contentId: string;
  image: string;
  gallery: FacilityGalleryItem[];
  pointsEn: string;
  pointsId: string;
  category: string;
  status: PageSeoStatus;
  sortOrder: string;
};

const emptyForm: FacilityForm = {
  id: "",
  key: "",
  titleEn: "",
  titleId: "",
  eyebrowEn: "",
  eyebrowId: "",
  summaryEn: "",
  summaryId: "",
  contentEn: "",
  contentId: "",
  image: "",
  gallery: [],
  pointsEn: "",
  pointsId: "",
  category: "clinical",
  status: "DRAFT",
  sortOrder: "0",
};

const categoryOptions = [
  {
    value: "clinical",
    label: "Clinical Facilities",
  },
  {
    value: "analytical",
    label: "Analytical Facilities",
  },
  {
    value: "supporting",
    label: "Supporting Facilities",
  },
  {
    value: "vr-gallery",
    label: "VR Gallery",
  },
];

function mapFacilityToForm(item: AdminFacilityItem): FacilityForm {
  return {
    id: item.id,
    key: item.key || "",
    titleEn: item.titleEn || "",
    titleId: item.titleId || "",
    eyebrowEn: item.eyebrowEn || "",
    eyebrowId: item.eyebrowId || "",
    summaryEn: item.summaryEn || "",
    summaryId: item.summaryId || "",
    contentEn: item.contentEn || "",
    contentId: item.contentId || "",
    image: item.image || "",
    gallery: Array.isArray(item.gallery)
      ? item.gallery
      : [],
    pointsEn: item.pointsEn?.join("\n") || "",
    pointsId: item.pointsId?.join("\n") || "",
    category: item.category || "clinical",
    status: item.status || "DRAFT",
    sortOrder: String(item.sortOrder ?? 0),
  };
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getCategoryLabel(value: string) {
  return (
    categoryOptions.find((item) => item.value === value)?.label ||
    value ||
    "Uncategorised"
  );
}

export default function AdminFacilitiesPage() {
  const [items, setItems] = useState<AdminFacilityItem[]>([]);
  const [form, setForm] = useState<FacilityForm>(emptyForm);
  const [activeLanguage, setActiveLanguage] =
    useState<"en" | "id">("en");
  const [status, setStatus] =
    useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] =
    useState<"success" | "error">("success");
  const [saving, setSaving] = useState(false);

  const selectedFacility = useMemo(() => {
    return items.find((item) => item.id === form.id) || null;
  }, [items, form.id]);

  const loadFacilities = useCallback(async () => {
    const token = getAdminToken();

    if (!token) {
      setStatus("error");
      setMessageTone("error");
      setMessage("Admin token not found. Please login again.");
      return;
    }

    try {
      const data = await getAdminFacilities(token);

      setItems(data);
      setStatus("success");

      setForm((current) => {
        if (data.length > 0 && !current.id) {
          return mapFacilityToForm(data[0]);
        }

        if (current.id) {
          const refreshed = data.find(
            (item) => item.id === current.id,
          );

          if (refreshed) {
            return mapFacilityToForm(refreshed);
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
          : "Failed to load facilities.",
      );
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadFacilities();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadFacilities]);

  const updateField = (
    key: keyof FacilityForm,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const selectFacility = (item: AdminFacilityItem) => {
    setForm(mapFacilityToForm(item));
    setActiveLanguage("en");
    setMessage("");
  };

  const resetForm = () => {
    setForm(emptyForm);
    setActiveLanguage("en");
    setMessage("");
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!form.key.trim()) {
      setMessageTone("error");
      setMessage("Facility key is required.");
      return;
    }

    if (!form.titleEn.trim()) {
      setMessageTone("error");
      setMessage("English title is required.");
      setActiveLanguage("en");
      return;
    }

    const token = getAdminToken();

    if (!token) {
      setMessageTone("error");
      setMessage("Admin token not found. Please login again.");
      return;
    }

    const payload = {
      key: form.key.trim(),
      titleEn: form.titleEn.trim(),
      titleId: form.titleId.trim() || undefined,
      eyebrowEn: form.eyebrowEn.trim() || undefined,
      eyebrowId: form.eyebrowId.trim() || undefined,
      summaryEn: form.summaryEn.trim() || undefined,
      summaryId: form.summaryId.trim() || undefined,
      contentEn: form.contentEn.trim() || undefined,
      contentId: form.contentId.trim() || undefined,
      image: form.image || undefined,
      gallery: form.gallery,
      pointsEn: splitLines(form.pointsEn),
      pointsId: splitLines(form.pointsId),
      category: form.category,
      status: form.status,
      sortOrder: Number(form.sortOrder) || 0,
    };

    setSaving(true);
    setMessage("");

    try {
      if (form.id) {
        const updated = await updateAdminFacility(
          token,
          form.id,
          payload,
        );

        setForm(mapFacilityToForm(updated));
        setMessage("Facility updated successfully.");
      } else {
        const created = await createAdminFacility(
          token,
          payload,
        );

        setForm(mapFacilityToForm(created));
        setMessage("Facility created successfully.");
      }

      setMessageTone("success");
      await loadFacilities();
    } catch (error) {
      setMessageTone("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save facility.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async () => {
    if (!form.id) {
      setMessageTone("error");
      setMessage("Please select a facility first.");
      return;
    }

    const confirmed = window.confirm(
      "Archive this facility? It will no longer be treated as published content.",
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
      const archived = await archiveAdminFacility(
        token,
        form.id,
      );

      setForm(mapFacilityToForm(archived));
      setMessageTone("success");
      setMessage("Facility archived successfully.");

      await loadFacilities();
    } catch (error) {
      setMessageTone("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to archive facility.",
      );
    } finally {
      setSaving(false);
    }
  };

  const activeTitle =
    activeLanguage === "en" ? form.titleEn : form.titleId;

  const activeEyebrow =
    activeLanguage === "en"
      ? form.eyebrowEn
      : form.eyebrowId;

  const activeSummary =
    activeLanguage === "en"
      ? form.summaryEn
      : form.summaryId;

  const activeContent =
    activeLanguage === "en"
      ? form.contentEn
      : form.contentId;

  const activePoints =
    activeLanguage === "en"
      ? form.pointsEn
      : form.pointsId;

  return (
    <AdminShell>
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#039147]">
            Facilities CMS
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-black md:text-5xl">
            Facilities Content
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-black/50">
            Manage bilingual facility information, featured
            images, key points, categories, publishing status,
            and display order.
          </p>
        </div>

        <button
          type="button"
          onClick={resetForm}
          className="w-fit rounded-full bg-[#039147] px-6 py-3 text-sm font-black text-white shadow-[0_18px_50px_rgba(3,145,71,0.22)] transition hover:-translate-y-0.5"
        >
          Create New Facility
        </button>
      </div>

      {status === "loading" ? (
        <AdminState
          title="Loading facilities"
          description="Please wait while the CMS loads facility content."
        />
      ) : null}

      {status === "error" ? (
        <AdminState
          title="Unable to load facilities"
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

          <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
            <aside className="h-fit rounded-[30px] border border-black/5 bg-white p-5 shadow-[0_22px_70px_rgba(0,0,0,0.08)] xl:sticky xl:top-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                    Facility List
                  </p>

                  <h2 className="mt-2 text-xl font-black text-black">
                    Existing Facilities
                  </h2>
                </div>

                <span className="rounded-full bg-[#f6faf7] px-3 py-2 text-xs font-black text-black/45">
                  {items.length}
                </span>
              </div>

              <div className="grid max-h-[70vh] gap-3 overflow-y-auto pr-1">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectFacility(item)}
                    className={`rounded-[22px] border p-4 text-left transition ${
                      form.id === item.id
                        ? "border-[#039147] bg-[#eaf8f0]"
                        : "border-black/5 bg-white hover:border-[#039147]/30 hover:bg-[#f6faf7]"
                    }`}
                  >
                    <div className="relative mb-4 h-36 overflow-hidden rounded-[18px] bg-[#f6faf7]">
                      {item.image ? (
                        <Image
                          src={resolveMediaUrl(item.image)}
                          alt={item.titleEn || item.key}
                          fill
                          sizes="320px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-36 items-center justify-center text-xs font-black uppercase tracking-[0.12em] text-black/25">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-black text-black">
                          {item.titleEn || item.key}
                        </p>

                        <p className="mt-2 line-clamp-1 text-xs font-semibold text-black/40">
                          {item.titleId || "Indonesian title not added"}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-[0.08em] ${
                          item.status === "PUBLISHED"
                            ? "bg-[#039147]/15 text-[#039147]"
                            : item.status === "ARCHIVED"
                              ? "bg-red-50 text-red-600"
                              : "bg-black/5 text-black/45"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.08em] text-black/40">
                      <span>{getCategoryLabel(item.category)}</span>
                      <span>•</span>
                      <span>Order {item.sortOrder ?? 0}</span>
                    </div>
                  </button>
                ))}

                {items.length === 0 ? (
                  <div className="rounded-[22px] border border-dashed border-black/10 bg-[#f6faf7] p-5 text-sm font-bold leading-6 text-black/40">
                    No facilities found. Create the first facility
                    content.
                  </div>
                ) : null}
              </div>
            </aside>

            <form
              onSubmit={handleSubmit}
              className="grid gap-6"
            >
              <section className="rounded-[30px] border border-black/5 bg-white p-5 shadow-[0_22px_70px_rgba(0,0,0,0.08)] md:p-7">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                      {selectedFacility
                        ? "Edit Facility"
                        : "Create Facility"}
                    </p>

                    <h2 className="mt-2 text-2xl font-black text-black">
                      Basic Information
                    </h2>
                  </div>

                  <span className="w-fit rounded-full bg-[#f6faf7] px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-black/45">
                    {form.status}
                  </span>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-sm font-black text-black">
                      Facility Key
                    </span>

                    <input
                      value={form.key}
                      onChange={(event) =>
                        updateField(
                          "key",
                          event.target.value
                            .toLowerCase()
                            .replace(/\s+/g, "-")
                            .replace(/[^a-z0-9-]/g, ""),
                        )
                      }
                      placeholder="clinical-research-unit"
                      required
                      className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm font-bold text-black outline-none transition placeholder:text-black/25 focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                    />

                    <span className="text-xs leading-5 text-black/40">
                      Stable identifier used by the backend. Use
                      lowercase letters and hyphens.
                    </span>
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-black text-black">
                      Category
                    </span>

                    <select
                      value={form.category}
                      onChange={(event) =>
                        updateField("category", event.target.value)
                      }
                      className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                    >
                      {categoryOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-black text-black">
                      Publishing Status
                    </span>

                    <select
                      value={form.status}
                      onChange={(event) =>
                        updateField(
                          "status",
                          event.target.value as PageSeoStatus,
                        )
                      }
                      className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-black text-black">
                      Sort Order
                    </span>

                    <input
                      type="number"
                      value={form.sortOrder}
                      onChange={(event) =>
                        updateField(
                          "sortOrder",
                          event.target.value,
                        )
                      }
                      className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                    />
                  </label>
                </div>
              </section>

              <section className="rounded-[30px] border border-black/5 bg-white p-5 shadow-[0_22px_70px_rgba(0,0,0,0.08)] md:p-7">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                      Bilingual Content
                    </p>

                    <h2 className="mt-2 text-2xl font-black text-black">
                      Facility Copy
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-black/45">
                      Complete the English and Indonesian versions
                      separately.
                    </p>
                  </div>

                  <div className="flex w-fit rounded-full bg-[#f6faf7] p-1">
                    <button
                      type="button"
                      onClick={() => setActiveLanguage("en")}
                      className={`rounded-full px-5 py-2.5 text-sm font-black transition ${
                        activeLanguage === "en"
                          ? "bg-[#039147] text-white shadow-sm"
                          : "text-black/45 hover:text-black"
                      }`}
                    >
                      English
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveLanguage("id")}
                      className={`rounded-full px-5 py-2.5 text-sm font-black transition ${
                        activeLanguage === "id"
                          ? "bg-[#039147] text-white shadow-sm"
                          : "text-black/45 hover:text-black"
                      }`}
                    >
                      Indonesia
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid gap-5">
                  <label className="grid gap-2">
                    <span className="text-sm font-black text-black">
                      Title {activeLanguage === "en" ? "(EN)" : "(ID)"}
                    </span>

                    <input
                      value={activeTitle}
                      onChange={(event) =>
                        updateField(
                          activeLanguage === "en"
                            ? "titleEn"
                            : "titleId",
                          event.target.value,
                        )
                      }
                      placeholder={
                        activeLanguage === "en"
                          ? "Clinical Research Facility"
                          : "Fasilitas Riset Klinis"
                      }
                      required={activeLanguage === "en"}
                      className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm font-bold text-black outline-none transition placeholder:text-black/25 focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-black text-black">
                      Eyebrow {activeLanguage === "en" ? "(EN)" : "(ID)"}
                    </span>

                    <input
                      value={activeEyebrow}
                      onChange={(event) =>
                        updateField(
                          activeLanguage === "en"
                            ? "eyebrowEn"
                            : "eyebrowId",
                          event.target.value,
                        )
                      }
                      placeholder="Facility category or short label"
                      className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm font-bold text-black outline-none transition placeholder:text-black/25 focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-black text-black">
                      Summary {activeLanguage === "en" ? "(EN)" : "(ID)"}
                    </span>

                    <textarea
                      rows={4}
                      value={activeSummary}
                      onChange={(event) =>
                        updateField(
                          activeLanguage === "en"
                            ? "summaryEn"
                            : "summaryId",
                          event.target.value,
                        )
                      }
                      placeholder="Brief introduction displayed on the facility page."
                      className="resize-y rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold leading-7 text-black outline-none transition placeholder:text-black/25 focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-black text-black">
                      Main Content {activeLanguage === "en" ? "(EN)" : "(ID)"}
                    </span>

                    <textarea
                      rows={8}
                      value={activeContent}
                      onChange={(event) =>
                        updateField(
                          activeLanguage === "en"
                            ? "contentEn"
                            : "contentId",
                          event.target.value,
                        )
                      }
                      placeholder="Write the complete facility description."
                      className="resize-y rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold leading-7 text-black outline-none transition placeholder:text-black/25 focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-black text-black">
                      Key Points {activeLanguage === "en" ? "(EN)" : "(ID)"}
                    </span>

                    <textarea
                      rows={6}
                      value={activePoints}
                      onChange={(event) =>
                        updateField(
                          activeLanguage === "en"
                            ? "pointsEn"
                            : "pointsId",
                          event.target.value,
                        )
                      }
                      placeholder={
                        "Dedicated clinical research rooms\nControlled participant flow\nProfessional monitoring support"
                      }
                      className="resize-y rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold leading-7 text-black outline-none transition placeholder:text-black/25 focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                    />

                    <span className="text-xs leading-5 text-black/40">
                      Write one point per line. Each line becomes a
                      separate list item.
                    </span>
                  </label>
                </div>
              </section>

              <MediaPicker
                value={form.image}
                onChange={(url) => updateField("image", url)}
                folder="facilities"
                title="Facility Featured Image"
                description="Choose a reusable image from the PML Media Library or upload a new facility image."
              />

              <FacilityGalleryManager
                value={form.gallery}
                onChange={(gallery) =>
                  setForm((current) => ({
                    ...current,
                    gallery,
                  }))
                }
              />

              <section className="rounded-[30px] border border-black/5 bg-white p-5 shadow-[0_22px_70px_rgba(0,0,0,0.08)] md:p-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  {form.id ? (
                    <button
                      type="button"
                      onClick={handleArchive}
                      disabled={saving}
                      className="rounded-full border border-red-200 bg-red-50 px-7 py-3.5 text-sm font-black text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Archive Facility
                    </button>
                  ) : null}

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-full bg-[#039147] px-8 py-3.5 text-sm font-black text-white shadow-[0_18px_50px_rgba(3,145,71,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving
                      ? "Saving Facility..."
                      : form.id
                        ? "Save Facility Changes"
                        : "Create Facility"}
                  </button>
                </div>
              </section>
            </form>
          </div>
        </>
      ) : null}
    </AdminShell>
  );
}
