"use client";

import { useEffect, useMemo, useState } from "react";

import AdminShell from "@/components/admin/AdminShell";
import AdminState from "@/components/admin/AdminState";
import {
  AdminCatalogueRequest,
  CatalogueRequestStatus,
  getAdminCatalogueRequests,
  getAdminToken,
  updateAdminCatalogueRequest,
} from "@/lib/admin-api";

const statusOptions: Array<"ALL" | CatalogueRequestStatus> = [
  "ALL",
  "NEW",
  "IN_REVIEW",
  "CONTACTED",
  "FOLLOW_UP",
  "COMPLETED",
  "CLOSED",
  "SPAM",
];

function formatDate(value: string | null) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function statusClass(status: CatalogueRequestStatus) {
  if (status === "NEW") return "bg-[#eaf8f0] text-[#039147]";
  if (status === "CONTACTED") return "bg-blue-50 text-blue-700";
  if (status === "FOLLOW_UP") return "bg-amber-50 text-amber-700";
  if (status === "COMPLETED") return "bg-emerald-100 text-emerald-800";
  if (status === "SPAM") return "bg-red-50 text-red-600";
  return "bg-black/5 text-black/55";
}

function catalogueTitle(item: AdminCatalogueRequest) {
  return (
    item.catalogue?.title ||
    item.catalogueTitleSnapshot ||
    "Catalogue unavailable"
  );
}

export default function AdminCatalogueRequestsPage() {
  const [items, setItems] = useState<AdminCatalogueRequest[]>([]);
  const [selected, setSelected] = useState<AdminCatalogueRequest | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | CatalogueRequestStatus
  >("ALL");
  const [catalogueFilter, setCatalogueFilter] = useState("ALL");
  const [selectedStatus, setSelectedStatus] =
    useState<CatalogueRequestStatus>("NEW");
  const [internalNotes, setInternalNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = getAdminToken();

    if (!token) {
      queueMicrotask(() => {
        setStatus("error");
        setMessage("Admin token not found. Please login again.");
      });
      return;
    }

    void getAdminCatalogueRequests(token)
      .then((data) => {
        setItems(data);
        setStatus("success");
      })
      .catch((error: unknown) => {
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "Failed to load catalogue requests.",
        );
      });
  }, []);

  const catalogueOptions = useMemo(
    () => [
      "ALL",
      ...Array.from(new Set(items.map(catalogueTitle))).sort((a, b) =>
        a.localeCompare(b),
      ),
    ],
    [items],
  );

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !keyword ||
        [
          item.name,
          item.company,
          item.email,
          item.phone,
          catalogueTitle(item),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(keyword);
      const matchesStatus =
        statusFilter === "ALL" || item.status === statusFilter;
      const matchesCatalogue =
        catalogueFilter === "ALL" ||
        catalogueTitle(item) === catalogueFilter;

      return matchesSearch && matchesStatus && matchesCatalogue;
    });
  }, [catalogueFilter, items, query, statusFilter]);

  const openRequest = (item: AdminCatalogueRequest) => {
    setSelected(item);
    setSelectedStatus(item.status);
    setInternalNotes(item.internalNotes || "");
    setMessage("");
  };

  const saveFollowUp = async () => {
    if (!selected) return;
    const token = getAdminToken();
    if (!token) return;

    setSaving(true);
    setMessage("");

    try {
      const updated = await updateAdminCatalogueRequest(token, selected.id, {
        status: selectedStatus,
        internalNotes,
      });

      setItems((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      setSelected(updated);
      setMessage("Follow-up details saved successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save follow-up details.",
      );
    } finally {
      setSaving(false);
    }
  };

  const copyValue = async (label: string, value: string | null) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setMessage(`${label} copied.`);
    } catch {
      setMessage(`Unable to copy ${label.toLowerCase()}.`);
    }
  };

  return (
    <AdminShell>
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#039147]">
          Catalogue Operations
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-black md:text-5xl">
          Catalogue Requests
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-black/50">
          Manage catalogue requests submitted from the public PML website and
          track follow-up progress.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          ["Total Requests", items.length],
          ["New", items.filter((item) => item.status === "NEW").length],
          [
            "Follow-up",
            items.filter((item) => item.status === "FOLLOW_UP").length,
          ],
        ].map(([label, value]) => (
          <article
            key={label}
            className="rounded-[24px] border border-black/5 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-black uppercase tracking-[0.14em] text-black/45">
              {label}
            </p>
            <p className="mt-2 text-3xl font-black text-black">{value}</p>
          </article>
        ))}
      </div>

      <div className="mb-6 grid gap-3 rounded-[28px] border border-black/5 bg-white p-4 lg:grid-cols-[1fr_210px_260px]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search requester, company, email, phone, or catalogue..."
          className="h-12 min-w-0 w-full rounded-2xl border border-black/5 bg-[#f8fbf9] px-4 text-sm font-bold outline-none focus:border-[#039147]"
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as "ALL" | CatalogueRequestStatus,
            )
          }
          className="h-12 min-w-0 w-full rounded-2xl border border-black/5 bg-[#f8fbf9] px-4 text-sm font-bold outline-none focus:border-[#039147]"
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option === "ALL" ? "All Status" : option.replace("_", " ")}
            </option>
          ))}
        </select>

        <select
          value={catalogueFilter}
          onChange={(event) => setCatalogueFilter(event.target.value)}
          className="h-12 min-w-0 w-full rounded-2xl border border-black/5 bg-[#f8fbf9] px-4 text-sm font-bold outline-none focus:border-[#039147]"
        >
          {catalogueOptions.map((option) => (
            <option key={option} value={option}>
              {option === "ALL" ? "All Catalogues" : option}
            </option>
          ))}
        </select>
      </div>

      {status === "loading" ? (
        <AdminState
          title="Loading catalogue requests"
          description="Please wait while the CMS loads incoming requests."
        />
      ) : null}

      {status === "error" ? (
        <AdminState
          title="Unable to load catalogue requests"
          description={message}
          tone="error"
        />
      ) : null}

      {status === "success" && items.length === 0 ? (
        <AdminState
          title="No catalogue requests yet"
          description="New public catalogue requests will appear here."
        />
      ) : null}

      {status === "success" && items.length > 0 ? (
        <div className="overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-[0_22px_70px_rgba(0,0,0,0.08)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1160px] text-left text-sm">
              <thead className="bg-[#f6faf7] text-xs font-black uppercase tracking-[0.12em] text-black/45">
                <tr>
                  <th className="px-5 py-4">Requester</th>
                  <th className="px-5 py-4">Company</th>
                  <th className="px-5 py-4">Catalogue</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Phone</th>
                  <th className="px-5 py-4">Submitted</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="transition hover:bg-[#f8fbf9]">
                    <td className="px-5 py-4 font-black text-black">
                      {item.name}
                    </td>
                    <td className="px-5 py-4 text-black/65">
                      {item.company || "-"}
                    </td>
                    <td className="px-5 py-4 font-bold text-black/75">
                      {catalogueTitle(item)}
                    </td>
                    <td className="px-5 py-4 text-black/65">{item.email}</td>
                    <td className="px-5 py-4 text-black/65">
                      {item.phone || "-"}
                    </td>
                    <td className="px-5 py-4 text-black/45">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-[10px] font-black ${statusClass(item.status)}`}
                      >
                        {item.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => openRequest(item)}
                        className="rounded-full border border-[#039147]/20 bg-white px-4 py-2 text-xs font-black text-[#039147] transition hover:bg-[#039147] hover:text-white"
                      >
                        View Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredItems.length === 0 ? (
            <div className="p-8">
              <AdminState
                title="No matching requests"
                description="Try changing the search keyword or filters."
              />
            </div>
          ) : null}
        </div>
      ) : null}

      {selected ? (
        <div className="fixed inset-0 z-[100]">
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            aria-label="Close catalogue request detail"
          />

          <aside className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto bg-white p-5 shadow-2xl md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                  Request Detail
                </p>
                <h2 className="mt-3 text-3xl font-black text-black">
                  {selected.name}
                </h2>
                <p className="mt-2 text-sm font-semibold text-black/45">
                  Submitted {formatDate(selected.createdAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-black"
              >
                ✕
              </button>
            </div>

            <section className="mt-7 rounded-[26px] border border-black/5 bg-[#f6faf7] p-5">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#039147]">
                Request Information
              </p>
              <div className="mt-4 grid gap-3">
                {[
                  ["Selected Catalogue", catalogueTitle(selected)],
                  ["Full Name", selected.name],
                  ["Company", selected.company || "-"],
                  ["Email", selected.email],
                  ["Phone Number", selected.phone || "-"],
                  ["Locale", selected.locale?.toUpperCase() || "-"],
                  ["Source Page", selected.sourcePage || "-"],
                  ["Submitted", formatDate(selected.createdAt)],
                ].map(([label, value]) => (
                  <div key={label} className="grid gap-1 sm:grid-cols-[170px_1fr]">
                    <p className="text-xs font-black uppercase tracking-[0.1em] text-black/35">
                      {label}
                    </p>
                    <p className="break-words text-sm font-bold text-black/75">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {selected.message ? (
                <p className="mt-5 whitespace-pre-line rounded-2xl bg-white p-4 text-sm leading-7 text-black/65">
                  {selected.message}
                </p>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={`mailto:${selected.email}`}
                  className="rounded-full bg-[#039147] px-5 py-2.5 text-xs font-black text-white"
                >
                  Email Requester
                </a>
                <button
                  type="button"
                  onClick={() => void copyValue("Email", selected.email)}
                  className="rounded-full border border-black/10 px-5 py-2.5 text-xs font-black"
                >
                  Copy Email
                </button>
                <button
                  type="button"
                  disabled={!selected.phone}
                  onClick={() => void copyValue("Phone", selected.phone)}
                  className="rounded-full border border-black/10 px-5 py-2.5 text-xs font-black disabled:opacity-40"
                >
                  Copy Phone
                </button>
              </div>
            </section>

            <section className="mt-5 rounded-[26px] border border-black/5 bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#039147]">
                Follow-up
              </p>

              <label className="mt-4 grid gap-2">
                <span className="text-sm font-black text-black">Status</span>
                <select
                  value={selectedStatus}
                  onChange={(event) =>
                    setSelectedStatus(
                      event.target.value as CatalogueRequestStatus,
                    )
                  }
                  className="h-12 rounded-2xl border border-black/10 px-4 text-sm font-bold outline-none focus:border-[#039147]"
                >
                  {statusOptions.slice(1).map((option) => (
                    <option key={option} value={option}>
                      {option.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mt-4 grid gap-2">
                <span className="text-sm font-black text-black">
                  Internal Notes
                </span>
                <textarea
                  rows={6}
                  value={internalNotes}
                  onChange={(event) => setInternalNotes(event.target.value)}
                  placeholder="Add follow-up notes for the PML admin team..."
                  className="resize-none rounded-2xl border border-black/10 px-4 py-3 text-sm font-bold leading-7 outline-none focus:border-[#039147]"
                />
              </label>

              <div className="mt-4 grid gap-2 text-xs text-black/45 sm:grid-cols-2">
                <p>Last follow-up: {formatDate(selected.lastFollowUpAt)}</p>
                <p>Updated: {formatDate(selected.updatedAt)}</p>
              </div>

              {message ? (
                <div className="mt-4 rounded-2xl bg-[#f6faf7] p-4 text-sm font-bold text-black/70">
                  {message}
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => void saveFollowUp()}
                disabled={saving}
                className="mt-5 w-full rounded-full bg-[#039147] px-6 py-3 text-sm font-black text-white shadow-[0_18px_50px_rgba(3,145,71,0.20)] disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Follow-up"}
              </button>
            </section>
          </aside>
        </div>
      ) : null}
    </AdminShell>
  );
}
