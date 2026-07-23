"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import AdminState from "@/components/admin/AdminState";
import InquiryTable from "@/components/admin/InquiryTable";
import { getAdminProposals, getAdminToken, ProposalSubmission } from "@/lib/admin-api";

const cmsModules = [
  {
    label: "Inquiries",
    href: "/admin/inquiries",
    desc: "Review proposal, contact, and catalogue request submissions.",
    icon: "I",
    tone: "from-[#eaf8f0] to-white",
  },
  {
    label: "Homepage",
    href: "/admin/homepage-features",
    desc: "Manage homepage highlights, CTA cards, and featured campaign content.",
    icon: "H",
    tone: "from-[#eaf8f0] to-white",
  },
  {
    label: "Catalogues",
    href: "/admin/catalogues",
    desc: "Manage catalogue items, PDF files, download mode, and requests.",
    icon: "C",
    tone: "from-[#fff4f3] to-white",
  },
  {
    label: "Insights",
    href: "/admin/insights",
    desc: "Create and manage articles, news, publications, and FAQ content.",
    icon: "N",
    tone: "from-[#eaf8f0] to-white",
  },
  {
    label: "Media",
    href: "/admin/media",
    desc: "Upload, organize, preview, and copy media asset URLs.",
    icon: "M",
    tone: "from-white to-[#eaf8f0]",
  },
  {
    label: "Popups",
    href: "/admin/popups",
    desc: "Manage homepage announcement popup, image, layout, and schedule.",
    icon: "P",
    tone: "from-[#eaf8f0] to-[#fff4f3]",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    desc: "Update website settings, public information, and configuration values.",
    icon: "S",
    tone: "from-white to-[#f6faf7]",
  },
  {
    label: "System Health",
    href: "/admin/health",
    desc: "Monitor API, PostgreSQL, Redis, environment, and backend uptime.",
    icon: "+",
    tone: "from-[#eaf8f0] to-white",
  },
];

export default function AdminDashboardPage() {
  const [items, setItems] = useState<ProposalSubmission[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = getAdminToken();

    if (!token) return;

    getAdminProposals(token)
      .then((data) => {
        setItems(data);
        setStatus("success");
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Failed to load dashboard data.");
      });
  }, []);

  const summary = useMemo(() => {
    const total = items.length;
    const newItems = items.filter((item) => item.status === "NEW").length;
    const inReview = items.filter((item) => item.status === "IN_REVIEW").length;
    const closed = items.filter((item) => item.status === "CLOSED").length;

    return [
      { label: "Total Inquiries", value: total, desc: "All website submissions" },
      { label: "New Requests", value: newItems, desc: "Need first review" },
      { label: "In Review", value: inReview, desc: "Currently being handled" },
      { label: "Closed", value: closed, desc: "Completed inquiries" },
    ];
  }, [items]);

  return (
    <AdminShell>
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#039147]">
            CMS Command Center
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-black md:text-5xl">
            PML CMS Dashboard
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-black/55">
            Manage website inquiries, homepage content, catalogues, insight resources, media assets, popup announcements, and site settings from one secure admin area.
          </p>
        </div>

        <Link
          href="/admin/media"
          className="w-fit rounded-full bg-[#039147] px-6 py-3 text-sm font-black text-white shadow-[0_18px_50px_rgba(3,145,71,0.22)] transition hover:-translate-y-0.5"
        >
          Upload Media
        </Link>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        {summary.map((item) => (
          <article
            key={item.label}
            className="rounded-[26px] border border-black/5 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.07)] backdrop-blur"
          >
            <p className="text-sm font-bold text-black/55">{item.label}</p>
            <p className="mt-3 text-4xl font-black text-black">{item.value}</p>
            <p className="mt-2 text-xs font-semibold text-black/50">{item.desc}</p>
          </article>
        ))}
      </div>

      <section className="mb-8 rounded-[30px] border border-black/5 bg-white p-5 shadow-[0_22px_70px_rgba(0,0,0,0.08)] backdrop-blur md:p-7">
        <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
              CMS Modules
            </p>
            <h2 className="mt-2 text-2xl font-black text-black">
              Manage Website Content
            </h2>
          </div>

          <span className="w-fit rounded-full border border-black/5 bg-[#f6faf7] px-4 py-2 text-xs font-black text-black/50">
            {cmsModules.length} modules active
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cmsModules.map((module) => (
            <Link
              key={module.href}
              href={module.href}
              className={`group relative overflow-hidden rounded-[26px] border border-black/5 bg-gradient-to-br ${module.tone} p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#039147]/25 hover:shadow-[0_22px_60px_rgba(3,145,71,0.12)]`}
            >
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#eaf8f0] transition group-hover:scale-125" />

              <div className="relative flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sm font-black text-[#039147] ring-1 ring-[#039147]/10 transition group-hover:bg-[#039147] group-hover:text-black">
                  {module.icon}
                </span>

                <span>
                  <span className="block text-lg font-black text-black">
                    {module.label}
                  </span>
                  <span className="mt-2 block text-sm font-semibold leading-6 text-black/55">
                    {module.desc}
                  </span>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#039147]">
                    Open Module
                    <span className="transition group-hover:translate-x-1">→</span>
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-[30px] border border-black/5 bg-white p-5 shadow-[0_22px_70px_rgba(0,0,0,0.08)] backdrop-blur md:p-7">
        <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
              Latest Activity
            </p>
            <h2 className="mt-2 text-2xl font-black text-black">
              Recent Website Inquiries
            </h2>
          </div>

          <Link
            href="/admin/inquiries"
            className="w-fit rounded-full border border-black/5 bg-[#f6faf7] px-5 py-3 text-xs font-black text-black/55 transition hover:bg-[#039147] hover:text-white"
          >
            View All Inquiries
          </Link>
        </div>

        {status === "loading" ? (
          <AdminState title="Loading inquiries" description="Please wait while the CMS loads the latest website requests." />
        ) : null}

        {status === "error" ? (
          <AdminState title="Unable to load dashboard" description={message} tone="error" />
        ) : null}

        {status === "success" && items.length === 0 ? (
          <AdminState title="No inquiries yet" description="Website inquiries will appear here after visitors submit the forms." />
        ) : null}

        {status === "success" && items.length > 0 ? (
          <InquiryTable items={items.slice(0, 8)} />
        ) : null}
      </section>
    </AdminShell>
  );
}
