"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import AdminState from "@/components/admin/AdminState";
import {
  getAdminPageSeoItems,
  getAdminSettings,
  getAdminToken,
  PageSeoItem,
  PageSeoStatus,
  seedAdminPageSeoDefaults,
  SiteSetting,
  updateAdminPageSeo,
  updateAdminSettings,
} from "@/lib/admin-api";

const groupLabels: Record<string, string> = {
  company: "Company",
  contact: "Contact",
  social: "Social Media",
  footer: "Footer",
  proposal: "Proposal",
  seo: "SEO Defaults",
  general: "General",
};

const statusOptions: PageSeoStatus[] = ["PUBLISHED", "DRAFT", "ARCHIVED"];

function stringifyValue(value: SiteSetting["value"]) {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return "";
  return JSON.stringify(value, null, 2);
}

function emptyToNull(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function countCharacters(value: string | null | undefined) {
  return value?.length || 0;
}

function getSeoScore(item: PageSeoItem) {
  let score = 0;

  if (item.title && item.title.length >= 25 && item.title.length <= 65) score += 25;
  if (item.description && item.description.length >= 120 && item.description.length <= 170) score += 25;
  if (item.ogTitle || item.title) score += 15;
  if (item.ogDescription || item.description) score += 15;
  if (item.status === "PUBLISHED") score += 20;

  return score;
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"settings" | "seo">("settings");

  const [items, setItems] = useState<SiteSetting[]>([]);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const [seoItems, setSeoItems] = useState<PageSeoItem[]>([]);
  const [seoFormValues, setSeoFormValues] = useState<Record<string, PageSeoItem>>({});
  const [savingSeoId, setSavingSeoId] = useState<string | null>(null);
  const [expandedSeoId, setExpandedSeoId] = useState<string | null>(null);

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = getAdminToken();

    if (!token) {
      Promise.resolve().then(() => {
        setStatus("error");
        setMessage("Admin token not found. Please login again.");
      });
      return;
    }

    Promise.all([getAdminSettings(token), getAdminPageSeoItems(token)])
      .then(([settingsData, seoData]) => {
        setItems(settingsData);
        setFormValues(
          settingsData.reduce<Record<string, string>>((result, item) => {
            result[item.key] = stringifyValue(item.value);
            return result;
          }, {})
        );

        setSeoItems(seoData);
        setSeoFormValues(
          seoData.reduce<Record<string, PageSeoItem>>((result, item) => {
            result[item.id] = item;
            return result;
          }, {})
        );
        setExpandedSeoId(seoData[0]?.id || null);

        setStatus("success");
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Failed to load settings.");
      });
  }, []);

  const groupedSettings = useMemo(() => {
    return items.reduce<Record<string, SiteSetting[]>>((result, item) => {
      if (!result[item.group]) result[item.group] = [];
      result[item.group].push(item);
      return result;
    }, {});
  }, [items]);

  const seoStats = useMemo(() => {
    const published = seoItems.filter((item) => item.status === "PUBLISHED").length;
    const draft = seoItems.filter((item) => item.status === "DRAFT").length;
    const archived = seoItems.filter((item) => item.status === "ARCHIVED").length;

    return { published, draft, archived, total: seoItems.length };
  }, [seoItems]);

  const updateField = (key: string, value: string) => {
    setFormValues((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const updateSeoField = (
    id: string,
    key: keyof Pick<
      PageSeoItem,
      "label" | "title" | "description" | "ogTitle" | "ogDescription" | "ogImage" | "canonicalUrl" | "status"
    >,
    value: string
  ) => {
    setSeoFormValues((current) => ({
      ...current,
      [id]: {
        ...current[id],
        [key]: value,
      },
    }));
  };

  const handleSettingsSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = getAdminToken();

    if (!token) {
      setMessage("Admin token not found. Please login again.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const payload = items.map((item) => ({
        key: item.key,
        value: formValues[item.key] || "",
      }));

      const updated = await updateAdminSettings(token, payload);

      setItems((current) =>
        current.map((item) => {
          const found = updated.find((setting) => setting.key === item.key);
          return found || item;
        })
      );

      setMessage("Website settings saved successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSeo = async (item: PageSeoItem) => {
    const token = getAdminToken();
    const formItem = seoFormValues[item.id];

    if (!token || !formItem) {
      setMessage("Admin token not found. Please login again.");
      return;
    }

    setSavingSeoId(item.id);
    setMessage("");

    try {
      const updated = await updateAdminPageSeo(token, item.id, {
        label: formItem.label,
        title: formItem.title,
        description: formItem.description,
        ogTitle: emptyToNull(formItem.ogTitle || ""),
        ogDescription: emptyToNull(formItem.ogDescription || ""),
        ogImage: emptyToNull(formItem.ogImage || ""),
        canonicalUrl: emptyToNull(formItem.canonicalUrl || ""),
        status: formItem.status,
      });

      setSeoItems((current) =>
        current.map((seoItem) => (seoItem.id === updated.id ? updated : seoItem))
      );

      setSeoFormValues((current) => ({
        ...current,
        [updated.id]: updated,
      }));

      setMessage(`SEO saved for ${updated.path}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save page SEO.");
    } finally {
      setSavingSeoId(null);
    }
  };

  const handleSeedSeoDefaults = async () => {
    const token = getAdminToken();

    if (!token) {
      setMessage("Admin token not found. Please login again.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const seeded = await seedAdminPageSeoDefaults(token);
      const refreshed = await getAdminPageSeoItems(token);

      setSeoItems(refreshed);
      setSeoFormValues(
        refreshed.reduce<Record<string, PageSeoItem>>((result, item) => {
          result[item.id] = item;
          return result;
        }, {})
      );

      setMessage(`SEO defaults checked. ${seeded.length} default items available.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to seed SEO defaults.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#039147]">
          CMS Configuration
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-black md:text-5xl">
          Website Settings
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-black/50">
          Manage global website information and page-level SEO metadata from one polished admin area.
        </p>
      </div>

      <div className="mb-7 flex flex-col gap-3 rounded-[28px] border border-black/5 bg-white p-3 backdrop-blur md:flex-row md:items-center md:justify-between">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`rounded-2xl px-5 py-3 text-sm font-black transition ${
              activeTab === "settings"
                ? "bg-[#039147] text-white shadow-[0_14px_35px_rgba(3,145,71,0.22)]"
                : "text-black/45 hover:bg-white/10 hover:text-black"
            }`}
          >
            Global Settings
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("seo")}
            className={`rounded-2xl px-5 py-3 text-sm font-black transition ${
              activeTab === "seo"
                ? "bg-[#039147] text-white shadow-[0_14px_35px_rgba(3,145,71,0.22)]"
                : "text-black/45 hover:bg-white/10 hover:text-black"
            }`}
          >
            Page SEO
          </button>
        </div>

        {activeTab === "seo" ? (
          <div className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.12em]">
            <span className="rounded-full border border-black/5 bg-white5 px-3 py-2 text-black/50">
              {seoStats.total} pages
            </span>
            <span className="rounded-full border border-[#039147]/25 bg-[#039147]/10 px-3 py-2 text-[#039147]">
              {seoStats.published} published
            </span>
            <span className="rounded-full border border-black/5 bg-white5 px-3 py-2 text-black/50">
              {seoStats.draft} draft
            </span>
            <span className="rounded-full border border-black/5 bg-white5 px-3 py-2 text-black/50">
              {seoStats.archived} archived
            </span>
          </div>
        ) : null}
      </div>

      {status === "loading" ? (
        <AdminState title="Loading settings" description="Please wait while the CMS loads website settings." />
      ) : null}

      {status === "error" ? (
        <AdminState title="Unable to load settings" description={message} tone="error" />
      ) : null}

      {status === "success" && activeTab === "settings" ? (
        <form onSubmit={handleSettingsSubmit} className="grid gap-6">
          {Object.entries(groupedSettings).map(([group, settings]) => (
            <section
              key={group}
              className="rounded-[30px] border border-black/5 bg-white p-5 shadow-[0_22px_70px_rgba(0,0,0,0.08)] backdrop-blur md:p-7"
            >
              <div className="mb-6 flex flex-col justify-between gap-2 md:flex-row md:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                    {groupLabels[group] || group}
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-black">
                    {groupLabels[group] || group} Settings
                  </h2>
                </div>

                <span className="w-fit rounded-full border border-black/5 bg-white5 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-black/50">
                  {settings.length} fields
                </span>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {settings.map((setting) => {
                  const isLong =
                    setting.key.includes("description") ||
                    setting.key.includes("address") ||
                    setting.key.includes("defaultDescription");

                  return (
                    <label
                      key={setting.key}
                      className={isLong ? "grid gap-2 md:col-span-2" : "grid gap-2"}
                    >
                      <span className="text-sm font-black text-black">{setting.label}</span>

                      <span className="text-xs font-semibold leading-5 text-black/50">
                        {setting.description || setting.key}
                      </span>

                      {isLong ? (
                        <textarea
                          rows={4}
                          value={formValues[setting.key] || ""}
                          onChange={(event) => updateField(setting.key, event.target.value)}
                          className="resize-none rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-bold leading-7 text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                        />
                      ) : (
                        <input
                          value={formValues[setting.key] || ""}
                          onChange={(event) => updateField(setting.key, event.target.value)}
                          className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                        />
                      )}

                      <span className="font-mono text-[11px] text-black/45">
                        {setting.key} {setting.isPublic ? "· public" : "· admin only"}
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>
          ))}

          {message ? (
            <div className="rounded-2xl border border-black/5 bg-white p-4 text-sm font-bold text-black/70">
              {message}
            </div>
          ) : null}

          <div className="sticky bottom-4 z-20 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[#039147] px-8 py-4 text-sm font-black text-black shadow-[0_18px_50px_rgba(3,145,71,0.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving Settings..." : "Save Website Settings"}
            </button>
          </div>
        </form>
      ) : null}

      {status === "success" && activeTab === "seo" ? (
        <div className="grid gap-6">
          <section className="rounded-[30px] border border-black/5 bg-white p-5 shadow-[0_22px_70px_rgba(0,0,0,0.08)] backdrop-blur md:p-7">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                  Page SEO Manager
                </p>
                <h2 className="mt-2 text-2xl font-black text-black">
                  Manage metadata for every public page
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-black/45">
                  Keep title around 25–65 characters and description around 120–170 characters for cleaner search snippets.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSeedSeoDefaults}
                disabled={saving}
                className="w-fit rounded-full border border-black/5 bg-white5 px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-black/60 transition hover:border-[#039147] hover:text-black disabled:opacity-50"
              >
                {saving ? "Checking..." : "Check Defaults"}
              </button>
            </div>
          </section>

          {seoItems.map((item) => {
            const formItem = seoFormValues[item.id] || item;
            const score = getSeoScore(formItem);

            return (
              <section
                key={item.id}
                className="overflow-hidden rounded-[30px] border border-black/5 bg-white shadow-[0_22px_70px_rgba(0,0,0,0.08)] backdrop-blur"
              >
                <div className="border-b border-black/5 bg-white5 p-5 md:p-6">
                  <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#eaf8f0] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-[#039147]">
                          {formItem.status}
                        </span>
                        <span className="rounded-full border border-black/5 px-3 py-1.5 font-mono text-[11px] font-bold text-black/50">
                          {formItem.path}
                        </span>
                      </div>

                      <h3 className="mt-3 text-2xl font-black text-black">{formItem.label}</h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-black/5 bg-white/[0.04] px-4 py-2 text-xs font-black text-black/45">
                        SEO Score {score}/100
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedSeoId((current) => (current === item.id ? null : item.id))
                        }
                        className="rounded-full border border-black/5 bg-white/[0.04] px-6 py-3 text-xs font-black uppercase tracking-[0.12em] text-black/70 transition hover:border-[#039147] hover:text-black"
                      >
                        {expandedSeoId === item.id ? "Close" : "Edit SEO"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveSeo(item)}
                        disabled={savingSeoId === item.id}
                        className="rounded-full bg-[#039147] px-6 py-3 text-xs font-black uppercase tracking-[0.12em] text-black shadow-[0_16px_40px_rgba(3,145,71,0.24)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {savingSeoId === item.id ? "Saving..." : "Save SEO"}
                      </button>
                    </div>
                  </div>
                </div>

                {expandedSeoId === item.id ? (
                  <div className="grid gap-5 p-5 md:grid-cols-2 md:p-6">
                  <label className="grid gap-2">
                    <span className="text-sm font-black text-black">Page Label</span>
                    <input
                      value={formItem.label}
                      onChange={(event) => updateSeoField(item.id, "label", event.target.value)}
                      className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-black text-black">Status</span>
                    <select
                      value={formItem.status}
                      onChange={(event) =>
                        updateSeoField(item.id, "status", event.target.value as PageSeoStatus)
                      }
                      className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2 md:col-span-2">
                    <span className="flex items-center justify-between gap-3 text-sm font-black text-black">
                      Meta Title
                      <span className="font-mono text-[11px] text-black/45">
                        {countCharacters(formItem.title)} chars
                      </span>
                    </span>
                    <input
                      value={formItem.title}
                      onChange={(event) => updateSeoField(item.id, "title", event.target.value)}
                      className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                    />
                  </label>

                  <label className="grid gap-2 md:col-span-2">
                    <span className="flex items-center justify-between gap-3 text-sm font-black text-black">
                      Meta Description
                      <span className="font-mono text-[11px] text-black/45">
                        {countCharacters(formItem.description)} chars
                      </span>
                    </span>
                    <textarea
                      rows={4}
                      value={formItem.description}
                      onChange={(event) => updateSeoField(item.id, "description", event.target.value)}
                      className="resize-none rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-bold leading-7 text-black outline-none transition focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-black text-black">OG Title</span>
                    <input
                      value={formItem.ogTitle || ""}
                      placeholder="Fallbacks to meta title"
                      onChange={(event) => updateSeoField(item.id, "ogTitle", event.target.value)}
                      className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition placeholder:text-black/20 focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-black text-black">OG Image</span>
                    <input
                      value={formItem.ogImage || ""}
                      placeholder="/images/pml/hero-lab-hexagon.png"
                      onChange={(event) => updateSeoField(item.id, "ogImage", event.target.value)}
                      className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition placeholder:text-black/20 focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                    />
                  </label>

                  <label className="grid gap-2 md:col-span-2">
                    <span className="flex items-center justify-between gap-3 text-sm font-black text-black">
                      OG Description
                      <span className="font-mono text-[11px] text-black/45">
                        {countCharacters(formItem.ogDescription)} chars
                      </span>
                    </span>
                    <textarea
                      rows={3}
                      value={formItem.ogDescription || ""}
                      placeholder="Fallbacks to meta description"
                      onChange={(event) =>
                        updateSeoField(item.id, "ogDescription", event.target.value)
                      }
                      className="resize-none rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-bold leading-7 text-black outline-none transition placeholder:text-black/20 focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                    />
                  </label>

                  <label className="grid gap-2 md:col-span-2">
                    <span className="text-sm font-black text-black">Canonical URL</span>
                    <input
                      value={formItem.canonicalUrl || ""}
                      placeholder="Leave empty to use default canonical URL"
                      onChange={(event) => updateSeoField(item.id, "canonicalUrl", event.target.value)}
                      className="h-13 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none transition placeholder:text-black/20 focus:border-[#039147] focus:ring-4 focus:ring-[#039147]/10"
                    />
                  </label>
                </div>
                ) : null}
              </section>
            );
          })}

          {message ? (
            <div className="sticky bottom-4 z-20 rounded-2xl border border-black/5 bg-[#111] p-4 text-sm font-bold text-black/70 shadow-2xl">
              {message}
            </div>
          ) : null}
        </div>
      ) : null}
    </AdminShell>
  );
}
