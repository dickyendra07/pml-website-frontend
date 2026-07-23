"use client";

import { useState } from "react";
import {
  InquiryStatus,
  markAdminProposalAsSpam,
  ProposalSubmission,
  updateAdminProposalNote,
  updateAdminProposalStatus,
} from "@/lib/admin-api";

type InquiryDetailDrawerProps = {
  item: ProposalSubmission | null;
  token: string | null;
  onClose: () => void;
  onUpdated: (item: ProposalSubmission) => void;
};

const statuses: InquiryStatus[] = ["NEW", "IN_REVIEW", "CONTACTED", "CLOSED", "SPAM"];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function InquiryDetailDrawer({
  item,
  token,
  onClose,
  onUpdated,
}: InquiryDetailDrawerProps) {
  const [selectedStatus, setSelectedStatus] = useState<InquiryStatus>(
    item?.status || "NEW"
  );
  const [internalNote, setInternalNote] = useState(item?.internalNote || "");
  const [saving, setSaving] = useState<"idle" | "status" | "note" | "spam">("idle");
  const [message, setMessage] = useState("");

  if (!item) return null;

  const saveStatus = async () => {
    if (!token) return;

    setSaving("status");
    setMessage("");

    try {
      const updated = await updateAdminProposalStatus(token, item.id, selectedStatus);
      onUpdated(updated);
      setMessage("Status updated successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to update status.");
    } finally {
      setSaving("idle");
    }
  };

  const saveNote = async () => {
    if (!token) return;

    setSaving("note");
    setMessage("");

    try {
      const updated = await updateAdminProposalNote(token, item.id, internalNote);
      onUpdated(updated);
      setMessage("Internal note saved successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save note.");
    } finally {
      setSaving("idle");
    }
  };

  const markSpam = async () => {
    if (!token) return;

    setSaving("spam");
    setMessage("");

    try {
      const updated = await markAdminProposalAsSpam(token, item.id);
      onUpdated(updated);
      setSelectedStatus("SPAM");
      setMessage("Inquiry marked as spam.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to mark as spam.");
    } finally {
      setSaving("idle");
    }
  };

  return (
    <div className="fixed inset-0 z-[90]">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Close inquiry detail"
      />

      <aside className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto border-l border-white/10 bg-[#07170f] p-5 text-white shadow-2xl md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#76d69f]">
              Inquiry Detail
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight">
              {item.name}
            </h2>
            <p className="mt-2 text-sm font-semibold text-white/45">
              Submitted {formatDate(item.createdAt)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white"
          >
            ✕
          </button>
        </div>

        <div className="mt-7 grid gap-4 rounded-[26px] border border-white/10 bg-white/[0.06] p-5">
          {[
            ["Company", item.company],
            ["Email", item.email],
            ["Phone", item.phone || "-"],
            ["Country", item.country || "-"],
            ["Service Type", item.serviceType],
            ["Source Page", item.sourcePage || "-"],
          ].map(([label, value]) => (
            <div key={label} className="grid gap-1 md:grid-cols-[150px_1fr]">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-white/35">
                {label}
              </p>
              <p className="text-sm font-bold text-white/78">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-[26px] border border-white/10 bg-white/[0.06] p-5">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-white/35">
            Project Needs / Message
          </p>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-white/72">
            {item.projectNeeds}
          </p>
        </div>

        <div className="mt-5 grid gap-5 rounded-[26px] border border-white/10 bg-white/[0.06] p-5">
          <div>
            <label className="text-xs font-black uppercase tracking-[0.14em] text-white/35">
              Status
            </label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <select
                value={selectedStatus}
                onChange={(event) => setSelectedStatus(event.target.value as InquiryStatus)}
                className="h-12 flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 text-sm font-bold text-white outline-none focus:border-[#039147]"
              >
                {statuses.map((status) => (
                  <option key={status} value={status} className="bg-[#07170f]">
                    {status.replace("_", " ")}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={saveStatus}
                disabled={saving !== "idle"}
                className="rounded-full bg-[#039147] px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 disabled:opacity-60"
              >
                {saving === "status" ? "Saving..." : "Update Status"}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-[0.14em] text-white/35">
              Internal Notes
            </label>
            <textarea
              value={internalNote}
              onChange={(event) => setInternalNote(event.target.value)}
              rows={5}
              className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-bold leading-7 text-white outline-none focus:border-[#039147]"
              placeholder="Add follow-up notes for internal admin team..."
            />
            <button
              type="button"
              onClick={saveNote}
              disabled={saving !== "idle"}
              className="mt-3 rounded-full border border-[#039147]/30 bg-[#039147]/15 px-6 py-3 text-sm font-black text-[#76d69f] transition hover:bg-[#039147] hover:text-white disabled:opacity-60"
            >
              {saving === "note" ? "Saving..." : "Save Note"}
            </button>
          </div>

          <button
            type="button"
            onClick={markSpam}
            disabled={saving !== "idle"}
            className="rounded-full border border-red-400/25 bg-red-500/10 px-6 py-3 text-sm font-black text-red-100 transition hover:bg-red-500 hover:text-white disabled:opacity-60"
          >
            {saving === "spam" ? "Marking..." : "Mark as Spam"}
          </button>

          {message ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-bold text-white/72">
              {message}
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
