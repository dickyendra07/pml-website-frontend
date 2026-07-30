import Link from "next/link";

import InsightShare from "@/components/pages/InsightShare";

type InsightSidebarProps = {
  category: string;
  locale: "en" | "id";
};

export default function InsightSidebar({
  category,
  locale,
}: InsightSidebarProps) {
  return (
    <aside className="space-y-6">

      <InsightShare locale={locale} />


      <div className="rounded-[32px] bg-[#039147] p-8 text-white">

        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/70">
          Pharma Metric Labs
        </p>

        <h3 className="mt-5 text-2xl font-black leading-tight">
          {locale === "id"
            ? "Butuh dukungan proyek farmasi?"
            : "Need pharmaceutical project support?"}
        </h3>

        <p className="mt-4 text-sm leading-7 text-white/80">
          {locale === "id"
            ? "Diskusikan kebutuhan studi, analisis, atau layanan CRO bersama tim PML."
            : "Discuss your study requirements, analytical needs, or CRO services with the PML team."}
        </p>

        <button
          className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-black text-[#039147] transition hover:bg-black hover:text-white"
        >
          {locale === "id"
            ? "Ajukan Proposal"
            : "Request Proposal"}
        </button>

      </div>


      <div className="rounded-[32px] border border-black/5 bg-white p-7 shadow-sm">

        <p className="text-xs font-black uppercase tracking-[0.18em] text-black/40">
          Related Services
        </p>


        <div className="mt-5 space-y-3">

          {[
            "BA/BE Studies",
            "Clinical Trial Support",
            "Contract Analysis",
          ].map((service) => (
            <Link
              key={service}
              href={`/${locale}/services`}
              className="block rounded-2xl bg-[#f5faf7] px-5 py-4 text-sm font-black text-black transition hover:bg-[#039147] hover:text-white"
            >
              {service}
            </Link>
          ))}

        </div>

      </div>

    </aside>
  );
}
