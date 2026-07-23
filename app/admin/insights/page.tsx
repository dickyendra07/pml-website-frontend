"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import AdminState from "@/components/admin/AdminState";
import RichTextEditor from "@/components/admin/RichTextEditor";
import {
  AdminInsightItem,
  PageSeoStatus,
  archiveAdminInsight,
  createAdminInsight,
  getAdminInsights,
  getAdminToken,
  updateAdminInsight,
  uploadAdminInsightCover,
} from "@/lib/admin-api";

type InsightForm = {
  id: string;

  titleEn: string;
  slugEn: string;
  excerptEn: string;
  contentEn: string;
  tagsEn: string;
  seoTitleEn: string;
  metaDescriptionEn: string;

  titleId: string;
  slugId: string;
  excerptId: string;
  contentId: string;
  tagsId: string;
  seoTitleId: string;
  metaDescriptionId: string;

  category: string;
  coverImage: string;
  status: PageSeoStatus;
  isFeatured: boolean;
  publishedAt: string;
};

const emptyForm: InsightForm = {
  id: "",

  titleEn: "",
  slugEn: "",
  excerptEn: "",
  contentEn: "",
  tagsEn: "",
  seoTitleEn: "",
  metaDescriptionEn: "",

  titleId: "",
  slugId: "",
  excerptId: "",
  contentId: "",
  tagsId: "",
  seoTitleId: "",
  metaDescriptionId: "",

  category: "articles",
  coverImage: "",
  status: "DRAFT",
  isFeatured: false,
  publishedAt: "",
};

const insightCategories = [
  { label: "Articles", value: "articles" },
  { label: "News", value: "news" },
  { label: "Publications", value: "publications" },
  { label: "FAQ", value: "faq" },
];

function toDateTimeLocal(value: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 16);
}

function toIsoOrNull(value: string) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString();
}

function mapInsightToForm(item: AdminInsightItem): InsightForm {
  return {
    id: item.id,

    titleEn: item.titleEn || "",
    slugEn: item.slugEn || "",
    excerptEn: item.excerptEn || "",
    contentEn: item.contentEn || "",
    tagsEn: item.tagsEn?.join(", ") || "",
    seoTitleEn: item.seoTitleEn || "",
    metaDescriptionEn: item.metaDescriptionEn || "",

    titleId: item.titleId || "",
    slugId: item.slugId || "",
    excerptId: item.excerptId || "",
    contentId: item.contentId || "",
    tagsId: item.tagsId?.join(", ") || "",
    seoTitleId: item.seoTitleId || "",
    metaDescriptionId: item.metaDescriptionId || "",

    category: item.category || "articles",
    coverImage: item.coverImage || "",
    status: item.status,
    isFeatured: item.isFeatured,
    publishedAt: toDateTimeLocal(item.publishedAt),
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

function parseTags(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function AdminInsightsPage() {
  const [items, setItems] = useState<AdminInsightItem[]>([]);
  const [form, setForm] = useState<InsightForm>(emptyForm);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [message, setMessage] = useState("");
  const [isWritingMode, setIsWritingMode] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<"en" | "id">("en");

  const selectedInsight = useMemo(() => {
    return items.find((item) => item.id === form.id) || null;
  }, [items, form.id]);

  const loadInsights = useCallback(async () => {
    const token = getAdminToken();

    if (!token) {
      setStatus("error");
      setMessage("Admin token not found. Please login again.");
      return;
    }

    try {
      const data = await getAdminInsights(token);
      setItems(data);
      setStatus("success");

      setForm((current) => {
        if (data.length > 0 && !current.id) {
          return mapInsightToForm(data[0]);
        }

        return current;
      });
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Failed to load insights.",
      );
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadInsights();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadInsights]);

  const updateField = <K extends keyof InsightForm>(
    key: K,
    value: InsightForm[K],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setMessage("");
  };

  const selectInsight = (item: AdminInsightItem) => {
    setForm(mapInsightToForm(item));
    setActiveLanguage(item.titleEn ? "en" : "id");
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
      const result = await uploadAdminInsightCover(token, file);
      updateField("coverImage", result.url);
      setMessage("Cover image uploaded successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to upload cover image.",
      );
    } finally {
      setUploadingCover(false);
    }
  };

  const handleArchive = async () => {
    if (!form.id) {
      setMessage("Please select an insight first.");
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
      const archived = await archiveAdminInsight(token, form.id);
      setForm(mapInsightToForm(archived));
      await loadInsights();
      setMessage("Insight archived successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to archive insight.",
      );
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

    if (!form.titleEn.trim() && !form.titleId.trim()) {
      setSaving(false);
      setMessage(
        "Please provide at least one English or Indonesian article title.",
      );
      return;
    }

    const payload = {
      titleEn: form.titleEn || null,
      slugEn: form.slugEn || null,
      excerptEn: form.excerptEn || null,
      contentEn: form.contentEn || null,
      tagsEn: parseTags(form.tagsEn),
      seoTitleEn: form.seoTitleEn || null,
      metaDescriptionEn: form.metaDescriptionEn || null,

      titleId: form.titleId || null,
      slugId: form.slugId || null,
      excerptId: form.excerptId || null,
      contentId: form.contentId || null,
      tagsId: parseTags(form.tagsId),
      seoTitleId: form.seoTitleId || null,
      metaDescriptionId: form.metaDescriptionId || null,

      category: form.category,
      coverImage: form.coverImage || null,
      status: form.status,
      isFeatured: form.isFeatured,
      publishedAt: toIsoOrNull(form.publishedAt),
    };

    try {
      if (form.id) {
        const updated = await updateAdminInsight(token, form.id, payload);
        setForm(mapInsightToForm(updated));
        setMessage("Insight updated successfully.");
      } else {
        const created = await createAdminInsight(token, payload);
        setForm(mapInsightToForm(created));
        setMessage("Insight created successfully.");
      }

      await loadInsights();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to save insight.",
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
            Insight CMS
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-black md:text-5xl">
            Insights & Resources
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-black/50">
            Manage articles, news, publications, FAQ content, cover images,
            tags, featured status, and publishing workflow.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setActiveLanguage("en");
            setIsWritingMode(true);
          }}
          className="w-fit rounded-full bg-[#039147] px-6 py-3 text-sm font-black text-white shadow-[0_18px_50px_rgba(3,145,71,0.22)] transition hover:-translate-y-0.5"
        >
          Create New Insight
        </button>
      </div>

      {status === "loading" ? (
        <AdminState
          title="Loading insights"
          description="Please wait while the CMS loads insight data."
        />
      ) : null}

      {status === "error" ? (
        <AdminState
          title="Unable to load insights"
          description={message}
          tone="error"
        />
      ) : null}

      {status === "success" ? (
        <div className="grid gap-6">
          {!isWritingMode ? (
            <section className="rounded-[30px] border border-black/5 bg-white p-4 shadow-[0_22px_70px_rgba(0,0,0,0.08)] backdrop-blur md:p-5">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                    Insight List
                  </p>
                  <h2 className="mt-2 text-xl font-black text-black">
                    Existing Insights
                  </h2>
                </div>

                <span className="rounded-full border border-black/5 bg-white5 px-4 py-2 text-xs font-black text-black/50">
                  {items.length} items
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      selectInsight(item);
                      setIsWritingMode(true);
                    }}
                    className={`rounded-2xl border p-4 text-left transition ${
                      item.id === form.id
                        ? "border-[#039147] bg-[#eaf8f0]"
                        : "border-black/5 bg-white5 hover:border-white/20 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-black text-black">
                          {item.titleEn || item.titleId || "Untitled insight"}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-black/45">
                          {item.excerptEn || item.excerptId || "No excerpt"}
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

                    <div className="mt-3 flex flex-wrap gap-1.5 text-[9px] font-black uppercase tracking-[0.1em] text-black/50">
                      <span>{item.category}</span>
                      <span>•</span>
                      <span>{item.isFeatured ? "Featured" : "Standard"}</span>
                      <span>•</span>
                      <span>
                        {(item.tagsEn?.length || 0) +
                          (item.tagsId?.length || 0)}{" "}
                        tags
                      </span>
                    </div>
                  </button>
                ))}

                {items.length === 0 ? (
                  <div className="rounded-2xl border border-black/5 bg-white5 p-5 text-sm font-bold text-black/45">
                    No insight yet. Create the first article or FAQ.
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}

          {isWritingMode ? (
            <form
              onSubmit={handleSubmit}
              className="min-w-0 rounded-[34px] border border-black/5 bg-white p-5 shadow-[0_22px_70px_rgba(0,0,0,0.08)] backdrop-blur md:p-8 xl:p-10"
            >
              <div className="mb-6 flex flex-col justify-between gap-2 md:flex-row md:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                    {selectedInsight ? "Edit Insight" : "Create Insight"}
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-black">
                    Insight Content
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsWritingMode(false)}
                    className="rounded-full border border-black/5 bg-white5 px-4 py-2 text-xs font-black text-black/55 transition hover:border-[#039147]/30 hover:bg-[#eaf8f0] hover:text-[#039147]"
                  >
                    Back to Insight List
                  </button>

                  <span className="w-fit rounded-full border border-black/5 bg-white5 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-black/50">
                    {form.category}
                  </span>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <section className="rounded-[26px] border border-black/5 bg-[#f6faf7] p-5 md:col-span-2">
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-sm font-black text-black">
                        Category
                      </span>
                      <select
                        value={form.category}
                        onChange={(event) =>
                          updateField("category", event.target.value)
                        }
                        className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                      >
                        {insightCategories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="grid gap-2">
                      <span className="text-sm font-black text-black">
                        Content Availability
                      </span>
                      <div className="flex h-13 items-center gap-3 rounded-2xl border border-black/5 bg-white px-4">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            form.titleEn ? "bg-[#039147]" : "bg-black/15"
                          }`}
                        />
                        <span className="text-xs font-black text-black/55">
                          English {form.titleEn ? "available" : "not completed"}
                        </span>

                        <span className="mx-1 h-4 w-px bg-black/10" />

                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            form.titleId ? "bg-[#039147]" : "bg-black/15"
                          }`}
                        />
                        <span className="text-xs font-black text-black/55">
                          Indonesia{" "}
                          {form.titleId ? "available" : "not completed"}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="md:col-span-2">
                  <div className="inline-flex rounded-full border border-black/5 bg-[#f6faf7] p-1.5">
                    <button
                      type="button"
                      onClick={() => setActiveLanguage("en")}
                      className={`rounded-full px-6 py-3 text-xs font-black uppercase tracking-[0.12em] transition ${
                        activeLanguage === "en"
                          ? "bg-[#039147] text-white shadow-[0_12px_30px_rgba(3,145,71,0.22)]"
                          : "text-black/45 hover:text-[#039147]"
                      }`}
                    >
                      English Content
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveLanguage("id")}
                      className={`rounded-full px-6 py-3 text-xs font-black uppercase tracking-[0.12em] transition ${
                        activeLanguage === "id"
                          ? "bg-[#039147] text-white shadow-[0_12px_30px_rgba(3,145,71,0.22)]"
                          : "text-black/45 hover:text-[#039147]"
                      }`}
                    >
                      Konten Indonesia
                    </button>
                  </div>
                </div>

                {activeLanguage === "en" ? (
                  <>
                    <label className="grid gap-2 md:col-span-2">
                      <span className="text-sm font-black text-black">
                        English Article Title
                      </span>
                      <input
                        value={form.titleEn}
                        onChange={(event) =>
                          updateField("titleEn", event.target.value)
                        }
                        className="h-14 rounded-2xl border border-black/5 bg-white px-5 text-base font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                        placeholder="Enter the English article title"
                      />
                    </label>

                    <label className="grid gap-2 md:col-span-2">
                      <span className="text-sm font-black text-black">
                        English URL Slug
                      </span>
                      <input
                        value={form.slugEn}
                        onChange={(event) =>
                          updateField("slugEn", event.target.value)
                        }
                        className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                        placeholder="english-article-slug"
                      />
                      <span className="text-xs font-semibold text-black/40">
                        Leave blank to generate it from the English title.
                      </span>
                    </label>

                    <label className="grid gap-2 md:col-span-2">
                      <span className="text-sm font-black text-black">
                        English Excerpt
                      </span>
                      <textarea
                        rows={4}
                        value={form.excerptEn}
                        onChange={(event) =>
                          updateField("excerptEn", event.target.value)
                        }
                        className="resize-none rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-bold leading-7 text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                      />
                    </label>

                    <div className="grid gap-2 md:col-span-2">
                      <span className="text-sm font-black text-black">
                        English Article Body
                      </span>
                      <RichTextEditor
                        value={form.contentEn}
                        onChange={(value) => updateField("contentEn", value)}
                      />
                    </div>

                    <label className="grid gap-2 md:col-span-2">
                      <span className="text-sm font-black text-black">
                        English Keywords / Tags
                      </span>
                      <input
                        value={form.tagsEn}
                        onChange={(event) =>
                          updateField("tagsEn", event.target.value)
                        }
                        placeholder="BA/BE, CRO, Clinical Research"
                        className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                      />
                    </label>

                    <section className="grid gap-5 rounded-[26px] border border-[#039147]/10 bg-[#f4fbf7] p-5 md:col-span-2 md:grid-cols-2">
                      <label className="grid gap-2">
                        <span className="flex items-center justify-between gap-3 text-sm font-black text-black">
                          SEO Title
                          <span
                            className={
                              form.seoTitleEn.length > 60
                                ? "text-red-600"
                                : "text-black/35"
                            }
                          >
                            {form.seoTitleEn.length} / 60
                          </span>
                        </span>
                        <input
                          value={form.seoTitleEn}
                          onChange={(event) =>
                            updateField("seoTitleEn", event.target.value)
                          }
                          className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                          placeholder="Fallback: English article title"
                        />
                      </label>

                      <label className="grid gap-2">
                        <span className="flex items-center justify-between gap-3 text-sm font-black text-black">
                          Meta Description
                          <span
                            className={
                              form.metaDescriptionEn.length > 160
                                ? "text-red-600"
                                : "text-black/35"
                            }
                          >
                            {form.metaDescriptionEn.length} / 160
                          </span>
                        </span>
                        <textarea
                          rows={3}
                          value={form.metaDescriptionEn}
                          onChange={(event) =>
                            updateField("metaDescriptionEn", event.target.value)
                          }
                          className="resize-none rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-bold leading-6 text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                          placeholder="Fallback: English excerpt"
                        />
                      </label>

                      <div className="rounded-[22px] border border-black/5 bg-white p-5 md:col-span-2">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-black/35">
                          Google Search Preview
                        </p>
                        <p className="mt-4 text-xl font-semibold text-[#1a0dab]">
                          {form.seoTitleEn ||
                            form.titleEn ||
                            "English SEO title preview"}
                        </p>
                        <p className="mt-1 text-sm text-[#188038]">
                          pharmametriclabs.com/en/insight/{form.category}/
                          {form.slugEn || "article-slug"}
                        </p>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-black/60">
                          {form.metaDescriptionEn ||
                            form.excerptEn ||
                            "The English meta description preview will appear here."}
                        </p>
                      </div>
                    </section>
                  </>
                ) : (
                  <>
                    <label className="grid gap-2 md:col-span-2">
                      <span className="text-sm font-black text-black">
                        Judul Artikel Indonesia
                      </span>
                      <input
                        value={form.titleId}
                        onChange={(event) =>
                          updateField("titleId", event.target.value)
                        }
                        className="h-14 rounded-2xl border border-black/5 bg-white px-5 text-base font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                        placeholder="Masukkan judul artikel Bahasa Indonesia"
                      />
                    </label>

                    <label className="grid gap-2 md:col-span-2">
                      <span className="text-sm font-black text-black">
                        Slug URL Indonesia
                      </span>
                      <input
                        value={form.slugId}
                        onChange={(event) =>
                          updateField("slugId", event.target.value)
                        }
                        className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                        placeholder="slug-artikel-indonesia"
                      />
                      <span className="text-xs font-semibold text-black/40">
                        Kosongkan untuk membuat slug otomatis dari judul.
                      </span>
                    </label>

                    <label className="grid gap-2 md:col-span-2">
                      <span className="text-sm font-black text-black">
                        Ringkasan Artikel Indonesia
                      </span>
                      <textarea
                        rows={4}
                        value={form.excerptId}
                        onChange={(event) =>
                          updateField("excerptId", event.target.value)
                        }
                        className="resize-none rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-bold leading-7 text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                      />
                    </label>

                    <div className="grid gap-2 md:col-span-2">
                      <span className="text-sm font-black text-black">
                        Isi Artikel Indonesia
                      </span>
                      <RichTextEditor
                        value={form.contentId}
                        onChange={(value) => updateField("contentId", value)}
                      />
                    </div>

                    <label className="grid gap-2 md:col-span-2">
                      <span className="text-sm font-black text-black">
                        Keyword / Tag Indonesia
                      </span>
                      <input
                        value={form.tagsId}
                        onChange={(event) =>
                          updateField("tagsId", event.target.value)
                        }
                        placeholder="Uji Klinis, CRO, Riset Klinis"
                        className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                      />
                    </label>

                    <section className="grid gap-5 rounded-[26px] border border-[#039147]/10 bg-[#f4fbf7] p-5 md:col-span-2 md:grid-cols-2">
                      <label className="grid gap-2">
                        <span className="flex items-center justify-between gap-3 text-sm font-black text-black">
                          SEO Title Indonesia
                          <span
                            className={
                              form.seoTitleId.length > 60
                                ? "text-red-600"
                                : "text-black/35"
                            }
                          >
                            {form.seoTitleId.length} / 60
                          </span>
                        </span>
                        <input
                          value={form.seoTitleId}
                          onChange={(event) =>
                            updateField("seoTitleId", event.target.value)
                          }
                          className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                          placeholder="Fallback: judul artikel Indonesia"
                        />
                      </label>

                      <label className="grid gap-2">
                        <span className="flex items-center justify-between gap-3 text-sm font-black text-black">
                          Meta Description Indonesia
                          <span
                            className={
                              form.metaDescriptionId.length > 160
                                ? "text-red-600"
                                : "text-black/35"
                            }
                          >
                            {form.metaDescriptionId.length} / 160
                          </span>
                        </span>
                        <textarea
                          rows={3}
                          value={form.metaDescriptionId}
                          onChange={(event) =>
                            updateField("metaDescriptionId", event.target.value)
                          }
                          className="resize-none rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-bold leading-6 text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                          placeholder="Fallback: ringkasan artikel Indonesia"
                        />
                      </label>

                      <div className="rounded-[22px] border border-black/5 bg-white p-5 md:col-span-2">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-black/35">
                          Preview Hasil Pencarian Google
                        </p>
                        <p className="mt-4 text-xl font-semibold text-[#1a0dab]">
                          {form.seoTitleId ||
                            form.titleId ||
                            "Preview SEO Title Indonesia"}
                        </p>
                        <p className="mt-1 text-sm text-[#188038]">
                          pharmametriclabs.com/id/insight/{form.category}/
                          {form.slugId || "slug-artikel"}
                        </p>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-black/60">
                          {form.metaDescriptionId ||
                            form.excerptId ||
                            "Preview meta description Bahasa Indonesia akan tampil di sini."}
                        </p>
                      </div>
                    </section>
                  </>
                )}

                <div className="grid gap-4 rounded-[26px] border border-black/5 bg-white5 p-4 md:col-span-2 md:grid-cols-[0.9fr_1.1fr] md:p-5">
                  <div className="overflow-hidden rounded-[22px] border border-black/5 bg-black/30">
                    {form.coverImage ? (
                      <div className="relative h-56 w-full">
                        <Image
                          src={getAssetUrl(form.coverImage)}
                          alt="Insight cover preview"
                          fill
                          sizes="(max-width: 768px) 100vw, 420px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="flex h-56 items-center justify-center px-6 text-center text-sm font-bold text-black/50">
                        Upload cover image to preview insight card.
                      </div>
                    )}
                  </div>

                  <label className="grid gap-2">
                    <span className="text-sm font-black text-black">
                      Cover Image
                    </span>
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
                      onChange={(event) =>
                        updateField("coverImage", event.target.value)
                      }
                      placeholder="/uploads/insights/covers/image.png"
                      className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition placeholder:text-black/20 focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                    />

                    <span className="text-xs font-semibold text-black/50">
                      {uploadingCover
                        ? "Uploading cover..."
                        : "Upload image or paste cover URL manually."}
                    </span>
                  </label>
                </div>

                <label className="grid gap-2">
                  <span className="text-sm font-black text-black">
                    Published At
                  </span>
                  <input
                    type="datetime-local"
                    value={form.publishedAt}
                    onChange={(event) =>
                      updateField("publishedAt", event.target.value)
                    }
                    className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-black text-black">Status</span>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateField("status", event.target.value as PageSeoStatus)
                    }
                    className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white5 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(event) =>
                      updateField("isFeatured", event.target.checked)
                    }
                    className="h-5 w-5 accent-[#039147]"
                  />
                  <span className="text-sm font-black text-black">
                    Featured Insight
                  </span>
                </label>
              </div>

              {message ? (
                <div className="mt-6 rounded-2xl border border-black/5 bg-white5 p-4 text-sm font-bold text-black/70">
                  {message}
                </div>
              ) : null}

              <div className="mt-8 flex flex-col gap-3 rounded-[24px] border border-black/5 bg-white5 p-3 sm:flex-row sm:justify-end">
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
                  disabled={saving || uploadingCover}
                  className="rounded-full bg-[#039147] px-8 py-4 text-sm font-black text-black shadow-[0_18px_50px_rgba(3,145,71,0.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving Insight..." : "Save Insight"}
                </button>
              </div>
            </form>
          ) : null}
        </div>
      ) : null}
    </AdminShell>
  );
}
