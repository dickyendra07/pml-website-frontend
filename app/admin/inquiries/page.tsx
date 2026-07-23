"use client";

import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import AdminState from "@/components/admin/AdminState";
import InquiryDetailDrawer from "@/components/admin/InquiryDetailDrawer";
import InquiryTable from "@/components/admin/InquiryTable";
import {
  getAdminProposals,
  getAdminToken,
  InquiryStatus,
  ProposalSubmission,
} from "@/lib/admin-api";

const statusOptions: Array<"ALL" | InquiryStatus> = [
  "ALL",
  "NEW",
  "IN_REVIEW",
  "CONTACTED",
  "CLOSED",
  "SPAM",
];

function exportCsv(items: ProposalSubmission[]) {
  const headers = [
    "Name",
    "Company",
    "Email",
    "Phone",
    "Country",
    "Service Type",
    "Status",
    "Source Page",
    "Project Needs",
    "Internal Note",
    "Created At",
  ];

  const rows = items.map((item) => [
    item.name,
    item.company,
    item.email,
    item.phone || "",
    item.country || "",
    item.serviceType,
    item.status,
    item.sourcePage || "",
    item.projectNeeds,
    item.internalNote || "",
    item.createdAt,
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `pml-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();

  URL.revokeObjectURL(url);
}

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<ProposalSubmission[]>([]);
  const [selectedItem, setSelectedItem] = useState<ProposalSubmission | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | InquiryStatus>("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  useEffect(() => {
    const adminToken = getAdminToken();

    if (!adminToken) return;

    getAdminProposals(adminToken)
      .then((data) => {
        setItems(data);
        setStatus("success");
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Failed to load inquiries.");
      });
  }, []);

  const serviceTypes = useMemo(() => {
    return ["ALL", ...Array.from(new Set(items.map((item) => item.serviceType))).sort()];
  }, [items]);

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchKeyword =
        !keyword ||
        [item.name, item.company, item.email, item.serviceType, item.projectNeeds]
          .join(" ")
          .toLowerCase()
          .includes(keyword);

      const matchStatus = statusFilter === "ALL" || item.status === statusFilter;
      const matchType = typeFilter === "ALL" || item.serviceType === typeFilter;

      return matchKeyword && matchStatus && matchType;
    });
  }, [items, query, statusFilter, typeFilter]);

  const counts = useMemo(() => {
    return {
      total: items.length,
      filtered: filteredItems.length,
      newItems: items.filter((item) => item.status === "NEW").length,
      spam: items.filter((item) => item.status === "SPAM").length,
    };
  }, [items, filteredItems.length]);

  const handleUpdated = (updated: ProposalSubmission) => {
    setItems((current) =>
      current.map((item) => (item.id === updated.id ? updated : item))
    );
    setSelectedItem(updated);
  };

  return (
    <AdminShell>
      <div className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#039147]">
            Inquiry Management
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-black md:text-5xl">
            Website Inquiries
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-black/50">
            Search, filter, review, update status, add internal notes, mark spam, and export website inquiries.
          </p>
        </div>

        <button
          type="button"
          onClick={() => exportCsv(filteredItems)}
          disabled={filteredItems.length === 0}
          className="w-fit rounded-full border border-[#039147]/20 bg-[#eaf8f0] px-6 py-3 text-sm font-black text-[#039147] transition hover:bg-[#039147] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Export CSV
        </button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        {[
          ["Total", counts.total],
          ["Filtered", counts.filtered],
          ["New", counts.newItems],
          ["Spam", counts.spam],
        ].map(([label, value]) => (
          <article key={label} className="rounded-[24px] border border-black/5 bg-white p-5">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-black/50">{label}</p>
            <p className="mt-2 text-3xl font-black text-black">{value}</p>
          </article>
        ))}
      </div>

      <div className="mb-6 grid gap-3 rounded-[28px] border border-black/5 bg-white p-4 md:grid-cols-[1fr_220px_220px]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="h-12 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none placeholder:text-black/45 focus:border-[#039147]"
          placeholder="Search name, company, email, service, or message..."
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as "ALL" | InquiryStatus)}
          className="h-12 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none focus:border-[#039147]"
        >
          {statusOptions.map((option) => (
            <option key={option} value={option} className="bg-[#07170f]">
              {option === "ALL" ? "All Status" : option.replace("_", " ")}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
          className="h-12 rounded-2xl border border-black/5 bg-white px-4 text-sm font-bold text-black outline-none focus:border-[#039147]"
        >
          {serviceTypes.map((option) => (
            <option key={option} value={option} className="bg-[#07170f]">
              {option === "ALL" ? "All Types" : option}
            </option>
          ))}
        </select>
      </div>

      {status === "loading" ? (
        <AdminState title="Loading inquiries" description="Please wait while the CMS loads website submissions." />
      ) : null}

      {status === "error" ? (
        <AdminState title="Unable to load inquiries" description={message} tone="error" />
      ) : null}

      {status === "success" && items.length === 0 ? (
        <AdminState title="No inquiries found" description="There are no website inquiries yet." />
      ) : null}

      {status === "success" && items.length > 0 && filteredItems.length === 0 ? (
        <AdminState title="No matching inquiries" description="Try changing your search keyword, status filter, or service type filter." />
      ) : null}

      {status === "success" && filteredItems.length > 0 ? (
        <InquiryTable items={filteredItems} onSelect={setSelectedItem} />
      ) : null}

      <InquiryDetailDrawer
        key={selectedItem?.id || "empty"}
        item={selectedItem}
        token={getAdminToken()}
        onClose={() => setSelectedItem(null)}
        onUpdated={handleUpdated}
      />
    </AdminShell>
  );
}
