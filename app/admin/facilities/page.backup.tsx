"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import AdminState from "@/components/admin/AdminState";
import {
  AdminFacilityItem,
  PageSeoStatus,
  archiveAdminFacility,
  createAdminFacility,
  getAdminFacilities,
  getAdminToken,
  updateAdminFacility,
} from "@/lib/admin-api";

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

  pointsEn: "",
  pointsId: "",

  category: "facilities",
  status: "DRAFT",
  sortOrder: "0",
};

function mapFacilityToForm(item: AdminFacilityItem): FacilityForm {
  return {
    id: item.id,
    key: item.key,

    titleEn: item.titleEn || "",
    titleId: item.titleId || "",

    eyebrowEn: item.eyebrowEn || "",
    eyebrowId: item.eyebrowId || "",

    summaryEn: item.summaryEn || "",
    summaryId: item.summaryId || "",

    contentEn: item.contentEn || "",
    contentId: item.contentId || "",

    image: item.image || "",

    pointsEn: item.pointsEn?.join("\n") || "",
    pointsId: item.pointsId?.join("\n") || "",

    category: item.category || "facilities",
    status: item.status,
    sortOrder: String(item.sortOrder ?? 0),
  };
}

function parseLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function AdminFacilitiesPage() {
  const [items, setItems] = useState<AdminFacilityItem[]>([]);
  const [form, setForm] = useState<FacilityForm>(emptyForm);

  const [status, setStatus] =
    useState<"loading" | "success" | "error">("loading");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadFacilities = useCallback(async () => {
    const token = getAdminToken();

    if (!token) {
      setStatus("error");
      return;
    }

    try {
      const data = await getAdminFacilities(token);
      setItems(data);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadFacilities();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadFacilities]);

  const updateField = <K extends keyof FacilityForm>(
    key: K,
    value: FacilityForm[K],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const selectFacility = (item: AdminFacilityItem) => {
    setForm(mapFacilityToForm(item));
    setMessage("");
  };

  const resetForm = () => {
    setForm(emptyForm);
    setMessage("");
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const token = getAdminToken();

    if (!token) return;

    setSaving(true);

    const payload = {
      key: form.key,

      titleEn: form.titleEn,
      titleId: form.titleId || undefined,

      eyebrowEn: form.eyebrowEn || undefined,
      eyebrowId: form.eyebrowId || undefined,

      summaryEn: form.summaryEn || undefined,
      summaryId: form.summaryId || undefined,

      contentEn: form.contentEn || undefined,
      contentId: form.contentId || undefined,

      image: form.image || undefined,

      pointsEn: parseLines(form.pointsEn),
      pointsId: parseLines(form.pointsId),

      category: form.category,
      status: form.status,
      sortOrder: Number(form.sortOrder) || 0,
    };

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

      await loadFacilities();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed saving facility.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async () => {
    if (!form.id) return;

    const token = getAdminToken();

    if (!token) return;

    setSaving(true);

    try {
      await archiveAdminFacility(token, form.id);
      setMessage("Facility archived successfully.");
      resetForm();
      await loadFacilities();
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#039147]">
            Facilities CMS
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            Manage Facilities
          </h1>

          <p className="mt-4 text-sm text-black/50">
            Manage facility content, images, descriptions, and publishing status.
          </p>
        </div>

        <button
          type="button"
          onClick={resetForm}
          className="rounded-full bg-[#039147] px-6 py-3 text-sm font-black text-white"
        >
          Create Facility
        </button>
      </div>

      {status === "error" ? (
        <AdminState
          title="Unable to load facilities"
          tone="error"
        />
      ) : null}

      {message ? (
        <div className="mb-6 rounded-2xl bg-[#eaf8f0] p-4 text-sm font-bold text-[#039147]">
          {message}
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <div className="rounded-3xl bg-white p-5 shadow">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectFacility(item)}
              className="mb-3 w-full rounded-2xl border p-4 text-left"
            >
              <p className="font-black">
                {item.titleEn}
              </p>

              <p className="mt-1 text-xs text-black/40">
                {item.status}
              </p>
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-3xl bg-white p-6 shadow"
        >
          {Object.entries(form)
            .filter(([key]) => key !== "id")
            .map(([key, value]) => (
              <div key={key}>
                <label className="mb-2 block text-sm font-bold">
                  {key}
                </label>

                <textarea
                  value={String(value)}
                  onChange={(event) =>
                    updateField(
                      key as keyof FacilityForm,
                      event.target.value as never,
                    )
                  }
                  className="min-h-24 w-full rounded-xl border p-3"
                />
              </div>
            ))}

          <div>
            <button
              disabled={saving}
              className="rounded-full bg-[#039147] px-8 py-3 font-black text-white"
            >
              {saving ? "Saving..." : "Save Facility"}
            </button>

            {form.id ? (
              <button
                type="button"
                onClick={handleArchive}
                className="ml-3 rounded-full bg-red-600 px-8 py-3 font-black text-white"
              >
                Archive
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
