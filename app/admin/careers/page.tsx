"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import AdminState from "@/components/admin/AdminState";
import {
  AdminCareerItem,
  PageSeoStatus,
  archiveAdminCareer,
  createAdminCareer,
  getAdminCareers,
  getAdminToken,
  updateAdminCareer,
} from "@/lib/admin-api";

type CareerForm = {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  summary: string;
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  applyEmail: string;
  applyUrl: string;
  status: PageSeoStatus;
  sortOrder: string;
  publishedAt: string;
};

const emptyForm: CareerForm = {
  id: "",
  title: "",
  slug: "",
  department: "",
  location: "",
  employmentType: "Full-time",
  experienceLevel: "",
  summary: "",
  description: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
  applyEmail: "",
  applyUrl: "",
  status: "DRAFT",
  sortOrder: "0",
  publishedAt: "",
};

const employmentTypes = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];
const departments = ["Clinical", "Analytical", "Regulatory", "Project Management", "Operations", "Business Development", "General"];

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

function mapCareerToForm(item: AdminCareerItem): CareerForm {
  return {
    id: item.id,
    title: item.title || "",
    slug: item.slug || "",
    department: item.department || "",
    location: item.location || "",
    employmentType: item.employmentType || "Full-time",
    experienceLevel: item.experienceLevel || "",
    summary: item.summary || "",
    description: item.description || "",
    responsibilities: item.responsibilities || "",
    requirements: item.requirements || "",
    benefits: item.benefits || "",
    applyEmail: item.applyEmail || "",
    applyUrl: item.applyUrl || "",
    status: item.status,
    sortOrder: String(item.sortOrder ?? 0),
    publishedAt: toDateTimeLocal(item.publishedAt),
  };
}

export default function AdminCareersPage() {
  const [items, setItems] = useState<AdminCareerItem[]>([]);
  const [form, setForm] = useState<CareerForm>(emptyForm);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const selectedCareer = useMemo(() => {
    return items.find((item) => item.id === form.id) || null;
  }, [items, form.id]);

  const loadCareers = useCallback(async () => {
    const token = getAdminToken();

    if (!token) {
      setStatus("error");
      setMessage("Admin token not found. Please login again.");
      return;
    }

    try {
      const data = await getAdminCareers(token);
      setItems(data);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Failed to load careers.");
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadCareers();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadCareers]);

  const updateField = <K extends keyof CareerForm>(key: K, value: CareerForm[K]) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setMessage("");
    setIsEditing(true);
  };

  const selectCareer = (item: AdminCareerItem) => {
    setForm(mapCareerToForm(item));
    setMessage("");
    setIsEditing(true);
  };

  const handleArchive = async () => {
    if (!form.id) return;

    const token = getAdminToken();

    if (!token) {
      setMessage("Admin token not found. Please login again.");
      return;
    }

    setSaving(true);

    try {
      await archiveAdminCareer(token, form.id);
      setMessage("Career archived successfully.");
      setIsEditing(false);
      await loadCareers();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to archive career.");
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

    const payload = {
      title: form.title,
      slug: form.slug || undefined,
      department: form.department || null,
      location: form.location || null,
      employmentType: form.employmentType || null,
      experienceLevel: form.experienceLevel || null,
      summary: form.summary || null,
      description: form.description || null,
      responsibilities: form.responsibilities || null,
      requirements: form.requirements || null,
      benefits: form.benefits || null,
      applyEmail: form.applyEmail || null,
      applyUrl: form.applyUrl || null,
      status: form.status,
      sortOrder: Number(form.sortOrder) || 0,
      publishedAt: toIsoOrNull(form.publishedAt),
    };

    setSaving(true);
    setMessage("");

    try {
      if (form.id) {
        const updated = await updateAdminCareer(token, form.id, payload);
        setForm(mapCareerToForm(updated));
        setMessage("Career updated successfully.");
      } else {
        const created = await createAdminCareer(token, payload);
        setForm(mapCareerToForm(created));
        setMessage("Career created successfully.");
      }

      await loadCareers();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save career.");
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
            Careers & Job Openings
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-black/50">
            Manage job openings, departments, job requirements, application links, and publishing status.
          </p>
        </div>

        <button
          type="button"
          onClick={resetForm}
          className="w-fit rounded-full bg-[#039147] px-6 py-3 text-sm font-black text-white shadow-[0_18px_50px_rgba(3,145,71,0.22)] transition hover:-translate-y-0.5"
        >
          Create New Career
        </button>
      </div>

      {status === "loading" ? (
        <AdminState title="Loading careers" description="Please wait while the CMS loads career data." />
      ) : null}

      {status === "error" ? (
        <AdminState title="Unable to load careers" description={message} tone="error" />
      ) : null}

      {status === "success" && !isEditing ? (
        <section className="rounded-[30px] border border-black/5 bg-white p-5 shadow-[0_22px_70px_rgba(0,0,0,0.08)] backdrop-blur md:p-7">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                Career List
              </p>
              <h2 className="mt-2 text-2xl font-black text-black">
                Existing Job Openings
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
                onClick={() => selectCareer(item)}
                className="rounded-2xl border border-black/5 bg-white5 p-4 text-left transition hover:border-[#039147]/30 hover:bg-[#eaf8f0]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black text-black">{item.title}</h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-black/45">
                      {item.summary || item.department || "No summary"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-black ${
                      item.status === "PUBLISHED"
                        ? "bg-[#039147]/20 text-[#039147]"
                        : "bg-white text-black/45"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.1em] text-black/50">
                  <span>{item.department || "General"}</span>
                  <span>•</span>
                  <span>{item.location || "Location TBA"}</span>
                  <span>•</span>
                  <span>{item.employmentType || "Type TBA"}</span>
                </div>
              </button>
            ))}

            {items.length === 0 ? (
              <div className="rounded-2xl border border-black/5 bg-white5 p-5 text-sm font-bold text-black/45">
                No career opening yet. Create the first job opening.
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {status === "success" && isEditing ? (
        <form
          onSubmit={handleSubmit}
          className="rounded-[34px] border border-black/5 bg-white p-5 shadow-[0_22px_70px_rgba(0,0,0,0.08)] backdrop-blur md:p-8 xl:p-10"
        >
          <div className="mb-6 flex flex-col justify-between gap-2 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                {selectedCareer ? "Edit Career" : "Create Career"}
              </p>
              <h2 className="mt-2 text-2xl font-black text-black">
                Career Details
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="w-fit rounded-full border border-black/5 bg-white5 px-4 py-2 text-xs font-black text-black/55 transition hover:border-[#039147]/30 hover:bg-[#eaf8f0] hover:text-[#039147]"
            >
              Back to Career List
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="grid gap-2 md:col-span-2">
              <span className="text-sm font-black text-black">Job Title</span>
              <input
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                className="h-14 rounded-2xl border border-black/5 bg-white px-5 text-base font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                placeholder="Clinical Research Associate"
                required
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-black text-black">Slug</span>
              <input
                value={form.slug}
                onChange={(event) => updateField("slug", event.target.value)}
                className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                placeholder="clinical-research-associate"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-black text-black">Department</span>
              <select
                value={form.department}
                onChange={(event) => updateField("department", event.target.value)}
                className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
              >
                <option value="">Select department</option>
                {departments.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-black text-black">Location</span>
              <input
                value={form.location}
                onChange={(event) => updateField("location", event.target.value)}
                className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                placeholder="Jakarta / On-site / Hybrid"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-black text-black">Employment Type</span>
              <select
                value={form.employmentType}
                onChange={(event) => updateField("employmentType", event.target.value)}
                className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
              >
                {employmentTypes.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-black text-black">Experience Level</span>
              <input
                value={form.experienceLevel}
                onChange={(event) => updateField("experienceLevel", event.target.value)}
                className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                placeholder="Fresh Graduate / 2-3 years"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-black text-black">Sort Order</span>
              <input
                type="number"
                min="0"
                value={form.sortOrder}
                onChange={(event) => updateField("sortOrder", event.target.value)}
                className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
              />
            </label>

            <label className="grid gap-2 md:col-span-2">
              <span className="text-sm font-black text-black">Summary</span>
              <textarea
                rows={3}
                value={form.summary}
                onChange={(event) => updateField("summary", event.target.value)}
                className="resize-none rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-bold leading-7 text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                placeholder="Short summary shown on the public careers page."
              />
            </label>

            <label className="grid gap-2 md:col-span-2">
              <span className="text-sm font-black text-black">Job Description</span>
              <textarea
                rows={6}
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                className="resize-none rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-bold leading-7 text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-black text-black">Responsibilities</span>
              <textarea
                rows={6}
                value={form.responsibilities}
                onChange={(event) => updateField("responsibilities", event.target.value)}
                className="resize-none rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-bold leading-7 text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                placeholder="Use one responsibility per line."
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-black text-black">Requirements</span>
              <textarea
                rows={6}
                value={form.requirements}
                onChange={(event) => updateField("requirements", event.target.value)}
                className="resize-none rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-bold leading-7 text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                placeholder="Use one requirement per line."
              />
            </label>

            <label className="grid gap-2 md:col-span-2">
              <span className="text-sm font-black text-black">Benefits</span>
              <textarea
                rows={4}
                value={form.benefits}
                onChange={(event) => updateField("benefits", event.target.value)}
                className="resize-none rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-bold leading-7 text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                placeholder="Use one benefit per line."
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-black text-black">Apply Email</span>
              <input
                value={form.applyEmail}
                onChange={(event) => updateField("applyEmail", event.target.value)}
                className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                placeholder="hr@pharmametriclabs.com"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-black text-black">Apply URL</span>
              <input
                value={form.applyUrl}
                onChange={(event) => updateField("applyUrl", event.target.value)}
                className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                placeholder="https://..."
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-black text-black">Published At</span>
              <input
                type="datetime-local"
                value={form.publishedAt}
                onChange={(event) => updateField("publishedAt", event.target.value)}
                className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
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
                className="rounded-full border border-red-400/30 bg-red-500/10 px-8 py-4 text-sm font-black text-red-500 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Archive
              </button>
            ) : null}

            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[#039147] px-8 py-4 text-sm font-black text-white shadow-[0_18px_50px_rgba(3,145,71,0.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving Career..." : "Save Career"}
            </button>
          </div>
        </form>
      ) : null}
    </AdminShell>
  );
}
