"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getLocaleFromPathname, localizeHref } from "@/i18n/client";

type HeaderProps = {
  onOpenProposal: () => void;
};

type MegaItem = {
  label: string;
  href: string;
  desc: string;
  icon: IconType;
};

type IconType =
  | "team"
  | "company"
  | "network"
  | "catalogue"
  | "babe"
  | "clinical"
  | "analysis"
  | "regulatory"
  | "bed"
  | "lab"
  | "document"
  | "gallery"
  | "article"
  | "news"
  | "publication"
  | "faq"
  | "building"
  | "shield";

const aboutItems: MegaItem[] = [
  {
    label: "Experts & Team",
    href: "/about-us/experts-and-team",
    desc: "Multidisciplinary professionals across clinical, laboratory, regulatory, and project workflows.",
    icon: "team",
  },
  {
    label: "Company Profile",
    href: "/about-us/company-profile",
    desc: "Learn about PML’s capability, experience, quality standards, and CRO service focus.",
    icon: "company",
  },
  {
    label: "Clients & Network",
    href: "/about-us/clients",
    desc: "Serving local and international clients with hospital, investigator, and industry networks.",
    icon: "network",
  },
  {
    label: "Catalogue",
    href: "/about-us/catalogue",
    desc: "Access company materials, service information, and downloadable references.",
    icon: "catalogue",
  },
];

const serviceItems: MegaItem[] = [
  {
    label: "Contract Analysis",
    href: "/services/contract-analysis",
    desc: "Analytical testing support for product quality, safety, compliance, and documentation needs.",
    icon: "analysis",
  },
  {
    label: "BA/BE Study",
    href: "/services/babe-studies",
    desc: "End-to-end bioavailability and bioequivalence study support from clinical conduct and bioanalysis to regulatory-ready reporting.",
    icon: "babe",
  },
  {
    label: "Clinical Trial",
    href: "/services/clinical-trial",
    desc: "Clinical research support with local expertise, hospital partnerships, and reliable study coordination.",
    icon: "building",
  },
  {
    label: "Regulatory Management",
    href: "/services/regulatory-consultation",
    desc: "Regulatory management support for product registration, ACTD documents, compliance, and submission readiness.",
    icon: "shield",
  },
];

const facilityItems: MegaItem[] = [
  {
    label: "Clinical Facilities",
    href: "/facilities/clinical-facilities",
    desc: "70-bed clinical facility with ambulance support for controlled study activities.",
    icon: "bed",
  },
  {
    label: "Analytical Facilities",
    href: "/facilities/analytical-facilities",
    desc: "LC-MS/MS, GC-FID, GC-MS, ICP-OES, HPLC, and related instruments.",
    icon: "lab",
  },
  {
    label: "Supporting Facilities",
    href: "/facilities/supporting-facilities",
    desc: "Drug storage room, archive room, ambulance support, and study operations infrastructure.",
    icon: "document",
  },
  {
    label: "VR Gallery",
    href: "/facilities/vr-gallery",
    desc: "Explore facility visuals and approved gallery materials.",
    icon: "gallery",
  },
];

const insightItems: MegaItem[] = [
  {
    label: "Articles",
    href: "/insight/articles",
    desc: "Educational content about CRO, BA/BE, clinical trials, and pharma topics.",
    icon: "article",
  },
  {
    label: "News",
    href: "/insight/news",
    desc: "Updates from Pharma Metric Labs and service-related activities.",
    icon: "news",
  },
  {
    label: "Publications",
    href: "/insight/publications",
    desc: "Scientific, regulatory, and documentation-related references.",
    icon: "publication",
  },
  {
    label: "FAQ",
    href: "/insight/faq",
    desc: "Common questions about PML services and inquiry preparation.",
    icon: "faq",
  },
];

const indonesianMegaItemTranslations: Record<
  string,
  {
    label: string;
    desc: string;
  }
> = {
  "/about-us/experts-and-team": {
    label: "Pakar & Tim",
    desc: "Profesional multidisiplin di bidang klinis, laboratorium, regulasi, dan pengelolaan proyek.",
  },
  "/about-us/company-profile": {
    label: "Profil Perusahaan",
    desc: "Pelajari kapabilitas, pengalaman, standar mutu, dan fokus layanan CRO Pharma Metric Labs.",
  },
  "/about-us/clients": {
    label: "Klien & Jaringan",
    desc: "Melayani klien lokal dan internasional melalui jaringan rumah sakit, investigator, dan industri.",
  },
  "/about-us/catalogue": {
    label: "Katalog",
    desc: "Akses materi perusahaan, informasi layanan, dan referensi yang dapat diunduh.",
  },
  "/services/contract-analysis": {
    label: "Analisis Kontrak",
    desc: "Dukungan pengujian analitik untuk kualitas produk, keamanan, kepatuhan, dan dokumentasi.",
  },
  "/services/babe-studies": {
    label: "Studi BA/BE",
    desc: "Dukungan studi bioavailabilitas dan bioekuivalensi dari pelaksanaan klinis dan bioanalisis hingga laporan regulasi.",
  },
  "/services/clinical-trial": {
    label: "Uji Klinis",
    desc: "Dukungan riset klinis dengan keahlian lokal, kemitraan rumah sakit, dan koordinasi studi yang andal.",
  },
  "/services/regulatory-consultation": {
    label: "Manajemen Regulasi",
    desc: "Dukungan registrasi produk, dokumen ACTD, kepatuhan, dan kesiapan proses pengajuan.",
  },
  "/facilities/clinical-facilities": {
    label: "Fasilitas Klinis",
    desc: "Fasilitas klinis 70 tempat tidur dengan dukungan ambulans untuk pelaksanaan studi terkontrol.",
  },
  "/facilities/analytical-facilities": {
    label: "Fasilitas Analitik",
    desc: "Didukung LC-MS/MS, GC-FID, GC-MS, ICP-OES, HPLC, dan instrumen analitik lainnya.",
  },
  "/facilities/supporting-facilities": {
    label: "Fasilitas Pendukung",
    desc: "Ruang penyimpanan obat, ruang arsip, ambulans, dan infrastruktur operasional studi.",
  },
  "/facilities/vr-gallery": {
    label: "Galeri VR",
    desc: "Jelajahi visual fasilitas dan materi galeri Pharma Metric Labs.",
  },
  "/insight/articles": {
    label: "Artikel",
    desc: "Konten edukatif mengenai CRO, studi BA/BE, uji klinis, dan topik farmasi.",
  },
  "/insight/news": {
    label: "Berita",
    desc: "Informasi terbaru dari Pharma Metric Labs serta aktivitas terkait layanan.",
  },
  "/insight/publications": {
    label: "Publikasi",
    desc: "Referensi ilmiah, regulasi, penelitian, dan dokumentasi terkait.",
  },
  "/insight/faq": {
    label: "FAQ",
    desc: "Pertanyaan umum mengenai layanan PML dan persiapan kebutuhan proyek.",
  },
};

function getLocalizedMegaItems(
  items: MegaItem[],
  locale: "en" | "id",
): MegaItem[] {
  return items.map((item) => {
    const translation = indonesianMegaItemTranslations[item.href];

    return {
      ...item,
      href: localizeHref(item.href, locale),
      label: locale === "id" && translation ? translation.label : item.label,
      desc: locale === "id" && translation ? translation.desc : item.desc,
    };
  });
}

function Icon({ type }: { type: IconType }) {
  if (type === "team") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" />
        <path
          d="M4 19C4.8 16.5 6.6 15 9 15C11.4 15 13.2 16.5 14 19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M14.5 18.5C15.2 16.8 16.4 16 18 16C19.6 16 20.8 16.9 21.5 18.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "company" || type === "shield") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3L19 6V11C19 15.8 16 19.2 12 21C8 19.2 5 15.8 5 11V6L12 3Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M9 12L11 14L15.5 9.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "network") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="5" cy="6" r="2" stroke="currentColor" strokeWidth="2" />
        <circle cx="19" cy="6" r="2" stroke="currentColor" strokeWidth="2" />
        <circle cx="19" cy="18" r="2" stroke="currentColor" strokeWidth="2" />
        <circle cx="5" cy="18" r="2" stroke="currentColor" strokeWidth="2" />
        <path
          d="M7 7.5L9.5 10M16.5 10L18 7.5M16.5 14L18 16.5M7 16.5L9.5 14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "babe") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect
          x="4"
          y="13"
          width="10"
          height="6"
          rx="3"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M9 13V19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="17" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
        <circle cx="8" cy="7" r="2" stroke="currentColor" strokeWidth="2" />
        <path
          d="M10 8L14 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "clinical") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect
          x="7"
          y="4"
          width="10"
          height="16"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M10 9H14M10 13H13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M15 15L17 17L21 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "analysis" || type === "lab") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 3H15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M10 3V8L5.8 17.2C5.1 18.8 6.2 20.5 8 20.5H16C17.8 20.5 18.9 18.8 18.2 17.2L14 8V3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 16H16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "building") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 20H20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M6 20V7L12 4L18 7V20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M9 10H10.5M13.5 10H15M9 14H10.5M13.5 14H15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "bed") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 7V19M20 12V19M4 13H20M4 19H20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M6 10H10.5C12 10 13 11 13 12.5V13H6V10Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "gallery") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 6H20V18H4V6Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M9 10L12 12L9 14V10Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M15 9H17M15 12H17M15 15H17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (
    type === "article" ||
    type === "publication" ||
    type === "catalogue" ||
    type === "document" ||
    type === "regulatory"
  ) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M7 3H14L18 7V21H7V3Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M14 3V7H18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M10 12H15M10 16H14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "news") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 7H19M5 12H15M5 17H12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      <path
        d="M9.8 9.5C10.2 8.5 11 8 12.1 8C13.4 8 14.3 8.8 14.3 9.9C14.3 11.3 13.1 11.7 12.4 12.5C12.1 12.8 12 13.1 12 13.6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 16.5H12.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ServicesMegaPanel({
  items,
  locale,
}: {
  items: MegaItem[];
  locale: "en" | "id";
}) {
  const isIndonesian = locale === "id";

  return (
    <div className="w-[min(980px,calc(100vw-48px))]">
      <div className="absolute left-0 right-0 top-0 h-5" aria-hidden="true" />

      <div className="relative overflow-hidden rounded-[30px] border border-black/5 bg-white/97 p-6 shadow-[0_26px_80px_rgba(0,0,0,0.16)] ring-1 ring-black/[0.04] backdrop-blur-xl">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#039147]/35 to-transparent" />
        <div className="absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[#eaf8f0]/80 blur-3xl" />
        <div className="absolute -right-20 bottom-[-120px] h-64 w-64 rounded-full bg-[#039147]/8 blur-3xl" />

        <div className="relative">
          <div className="flex items-center justify-between gap-8">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#039147]/10 bg-[#eaf8f0]/80 px-4 py-2 text-[12px] font-black uppercase tracking-[0.17em] text-[#039147]">
                <span className="h-2 w-2 rounded-full bg-[#039147]" />
                {isIndonesian ? "Layanan CRO" : "CRO Services"}
              </p>

              <h3 className="mt-4 max-w-2xl text-[26px] font-black leading-[1.08] tracking-[-0.04em] text-black">
                {isIndonesian
                  ? "Layanan CRO terintegrasi untuk proyek kesehatan yang teregulasi"
                  : "Integrated CRO services for regulated healthcare projects"}
              </h3>
            </div>

            <Link
              href={localizeHref("/services", locale)}
              className="hidden shrink-0 rounded-full border border-[#039147]/20 bg-white px-5 py-3 text-[14px] font-black text-[#039147] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#039147] hover:text-white lg:inline-flex"
            >
              {isIndonesian ? "Lihat semua layanan" : "View all services"}
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            {items.map((item) => (
              <Link
                key={`service-feature-${item.label}`}
                href={item.href}
                className="group/item relative overflow-hidden rounded-[24px] border border-black/5 bg-white p-5 shadow-[0_14px_42px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#039147]/25 hover:bg-[#f6faf7] hover:shadow-[0_22px_64px_rgba(3,145,71,0.13)]"
              >
                <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-[#eaf8f0] transition duration-500 group-hover/item:scale-125 group-hover/item:bg-[#039147]/12" />
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#039147] transition-all duration-500 group-hover/item:w-full" />

                <div className="relative flex gap-4">
                  <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[18px] bg-[#eaf8f0] text-[#039147] ring-1 ring-[#039147]/10 transition duration-300 group-hover/item:bg-[#039147] group-hover/item:text-white group-hover/item:shadow-[0_16px_38px_rgba(3,145,71,0.20)]">
                    <Icon type={item.icon} />
                  </span>

                  <span className="block">
                    <span className="block text-[18px] font-black leading-tight tracking-[-0.025em] text-black">
                      {item.label}
                    </span>
                    <span className="mt-2.5 block line-clamp-3 text-[13.5px] font-semibold leading-6 text-black/58">
                      {item.desc}
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between rounded-[22px] border border-[#039147]/10 bg-[#f6faf7] px-5 py-4">
            <p className="text-[14px] font-semibold leading-6 text-black/62">
              One coordinated workflow across BA/BE study, clinical trial,
              contract analysis, and regulatory management.
            </p>

            <Link
              href={localizeHref("/contact", locale)}
              className="ml-6 hidden shrink-0 rounded-full bg-[#039147] px-5 py-3 text-[13px] font-black text-white shadow-[0_14px_34px_rgba(3,145,71,0.22)] transition hover:-translate-y-0.5 lg:inline-flex"
            >
              {isIndonesian ? "Diskusikan proyek" : "Discuss project"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function MegaPanel({
  label,
  width = "980",
  items,
  sideTitle,
  sideDesc,
  sideHref,
  sideCta,
  locale,
  sideIcon = "shield",
  grid = "grid-cols-2",
}: {
  label: string;
  width?: "920" | "980" | "1080" | "1180";
  items: MegaItem[];
  sideTitle: string;
  sideDesc: string;
  sideHref: string;
  sideCta: string;
  locale: "en" | "id";
  sideIcon?: IconType;
  grid?: string;
}) {
  void sideIcon;

  return (
    <div
      className={`w-[min(${width}px,calc(100vw-40px))] max-h-[calc(100dvh-112px)] overflow-y-auto overscroll-contain rounded-[30px]`}
    >
      <div className="relative overflow-hidden rounded-[30px] border border-black/5 bg-white p-5 shadow-[0_26px_80px_rgba(0,0,0,0.16)] ring-1 ring-black/[0.04] backdrop-blur-xl md:p-6">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#039147]/30 to-transparent" />
        <div className="absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[#eaf8f0]/80 blur-3xl" />
        <div className="absolute -right-20 bottom-[-120px] h-64 w-64 rounded-full bg-[#039147]/8 blur-3xl" />

        <div className="relative">
          <div className="flex items-center justify-between gap-8">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#039147]/10 bg-[#eaf8f0]/80 px-4 py-2 text-[12px] font-black uppercase tracking-[0.17em] text-[#039147]">
                <span className="h-2 w-2 rounded-full bg-[#039147]" />
                {label}
              </p>

              <h3 className="mt-4 max-w-2xl text-[25px] font-black leading-[1.08] tracking-[-0.04em] text-black">
                {sideTitle}
              </h3>

              <p className="mt-3 max-w-2xl text-[14px] font-semibold leading-6 text-black/58">
                {sideDesc}
              </p>
            </div>

            <Link
              href={localizeHref(sideHref, locale)}
              className="hidden shrink-0 rounded-full border border-[#039147]/20 bg-white px-5 py-3 text-[14px] font-black text-[#039147] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#039147] hover:text-white lg:inline-flex"
            >
              {sideCta}
            </Link>
          </div>

          <div className={`mt-6 grid ${grid} gap-4`}>
            {items.map((item) => (
              <Link
                key={`${label}-${item.label}`}
                href={item.href}
                className="group/item relative overflow-hidden rounded-[24px] border border-black/5 bg-white p-5 shadow-[0_14px_42px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#039147]/25 hover:bg-[#f6faf7] hover:shadow-[0_22px_64px_rgba(3,145,71,0.13)]"
              >
                <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-[#eaf8f0] transition duration-500 group-hover/item:scale-125 group-hover/item:bg-[#039147]/12" />
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#039147] transition-all duration-500 group-hover/item:w-full" />

                <div className="relative flex gap-4">
                  <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[18px] bg-[#eaf8f0] text-[#039147] ring-1 ring-[#039147]/10 transition duration-300 group-hover/item:bg-[#039147] group-hover/item:text-white group-hover/item:shadow-[0_16px_38px_rgba(3,145,71,0.20)]">
                    <Icon type={item.icon} />
                  </span>

                  <span className="block">
                    <span className="block text-[18px] font-black leading-tight tracking-[-0.025em] text-black">
                      {item.label}
                    </span>
                    <span className="mt-2.5 block line-clamp-3 text-[13.5px] font-semibold leading-6 text-black/58">
                      {item.desc}
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NavMega({
  children,
  href,
  panel,
  className,
}: {
  children: ReactNode;
  href: string;
  panel: ReactNode;
  className: string;
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }

    setOpen(true);
  };

  const closeMenu = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
    }

    closeTimer.current = setTimeout(() => {
      setOpen(false);
      closeTimer.current = null;
    }, 280);
  };

  return (
    <div
      className={`group/menu relative ${open ? "is-open" : ""}`}
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
      onFocus={openMenu}
      onBlur={closeMenu}
    >
      <Link href={href} className={className}>
        {children}
        <svg
          className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      <div
        className={`fixed left-1/2 top-[88px] z-[80] -translate-x-1/2 pt-3 transition duration-150 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
        onMouseEnter={openMenu}
        onMouseLeave={closeMenu}
      >
        <div
          className="absolute -top-4 left-0 right-0 h-5"
          aria-hidden="true"
        />
        {panel}
      </div>
    </div>
  );
}

function MobileAccordion({
  title,
  href,
  items,
  defaultOpen = false,
  onNavigate,
  isActiveHref,
}: {
  title: string;
  href: string;
  items: MegaItem[];
  defaultOpen?: boolean;
  onNavigate: () => void;
  isActiveHref: (href: string) => boolean;
}) {
  const isParentActive =
    isActiveHref(href) || items.some((item) => isActiveHref(item.href));
  const [open, setOpen] = useState(defaultOpen || isParentActive);

  return (
    <div
      className={`overflow-hidden rounded-2xl border transition ${
        isParentActive
          ? "border-[#039147]/25 bg-[#dff5e9] shadow-[0_10px_30px_rgba(3,145,71,0.10)]"
          : "border-transparent bg-[#eaf8f0]"
      }`}
    >
      <div className="flex items-center">
        <Link
          href={href}
          onClick={onNavigate}
          className={`flex-1 px-5 py-4 text-lg font-black ${
            isParentActive ? "text-[#039147]" : "text-black"
          }`}
        >
          {title}
        </Link>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#039147] shadow-sm transition"
          aria-label={`${open ? "Close" : "Open"} ${title} menu`}
          aria-expanded={open}
        >
          <span
            className={`text-xl font-black leading-none transition ${open ? "rotate-45" : ""}`}
          >
            +
          </span>
        </button>
      </div>

      {open ? (
        <div className="grid gap-3 px-4 pb-4">
          {items.map((item) => (
            <Link
              key={`${title}-${item.label}`}
              href={item.href}
              onClick={onNavigate}
              className={`flex gap-3 rounded-2xl p-4 text-left shadow-sm transition active:scale-[0.99] ${
                isActiveHref(item.href)
                  ? "bg-[#039147] text-white"
                  : "bg-white text-black"
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  isActiveHref(item.href)
                    ? "bg-white/15 text-white"
                    : "bg-[#eaf8f0] text-[#039147]"
                }`}
              >
                <Icon type={item.icon} />
              </span>

              <span>
                <span
                  className={`block text-sm font-black leading-tight ${
                    isActiveHref(item.href) ? "text-white" : "text-black"
                  }`}
                >
                  {item.label}
                </span>
                <span
                  className={`mt-1 block text-xs font-semibold leading-5 ${
                    isActiveHref(item.href) ? "text-white/70" : "text-black/50"
                  }`}
                >
                  {item.desc}
                </span>
              </span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function Header({ onOpenProposal }: HeaderProps) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isIndonesian = locale === "id";

  const localizedHref = (href: string) => localizeHref(href, locale);

  const localizedAboutItems = getLocalizedMegaItems(aboutItems, locale);
  const localizedServiceItems = getLocalizedMegaItems(serviceItems, locale);
  const localizedFacilityItems = getLocalizedMegaItems(facilityItems, locale);
  const localizedInsightItems = getLocalizedMegaItems(insightItems, locale);

  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  const normalizeHref = (href: string) => href.split("#")[0] || "/";

  const pathnameWithoutLocale =
    pathname?.replace(/^\/(en|id)(?=\/|$)/, "") || "/";

  const isActiveHref = (href: string) => {
    const cleanHref =
      normalizeHref(href).replace(/^\/(en|id)(?=\/|$)/, "") || "/";

    if (cleanHref === "/") {
      return pathnameWithoutLocale === "/";
    }

    if (cleanHref === "/services") {
      return (
        pathnameWithoutLocale === "/services" ||
        pathnameWithoutLocale.startsWith("/services/")
      );
    }

    return (
      pathnameWithoutLocale === cleanHref ||
      pathnameWithoutLocale.startsWith(`${cleanHref}/`)
    );
  };

  const navClass = (href: string) =>
    `header-link rounded-full px-4 py-3 transition ${
      isActiveHref(href)
        ? "bg-[#eaf8f0] text-[#039147]"
        : "hover:bg-black/5 hover:text-black"
    }`;

  const navMegaClass = (href: string, items: MegaItem[]) =>
    `header-link inline-flex items-center gap-2 rounded-full px-4 py-3 transition ${
      isActiveHref(href) || items.some((item) => isActiveHref(item.href))
        ? "bg-[#eaf8f0] text-[#039147]"
        : "hover:bg-black/5 hover:text-black"
    }`;

  const mobileLinkClass = (href: string) =>
    `rounded-2xl border px-5 py-4 transition ${
      isActiveHref(href)
        ? "border-[#039147]/25 bg-[#dff5e9] text-[#039147] shadow-[0_10px_30px_rgba(3,145,71,0.10)]"
        : "border-transparent bg-[#eaf8f0] text-black"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-xl">
      <div className="pml-container flex h-[72px] items-center justify-between md:h-20">
        <Link
          href={localizedHref("/")}
          aria-label="Pharma Metric Labs Home"
          className="flex items-center"
        >
          <Image
            src="/images/LOGO-PML.png"
            alt="Pharma Metric Labs"
            width={170}
            height={90}
            className="h-12 w-auto scale-[1.18] origin-left md:h-20 md:scale-[1.35]"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-bold text-black/70 xl:flex">
          <Link className={navClass("/")} href={localizedHref("/")}>
            {isIndonesian ? "Beranda" : "Home"}
          </Link>

          <NavMega
            href={localizedHref("/about-us")}
            className={navMegaClass("/about-us", localizedAboutItems)}
            panel={
              <MegaPanel
                locale={locale}
                label={isIndonesian ? "Tentang PML" : "About PML"}
                width="980"
                items={localizedAboutItems}
                sideTitle={
                  isIndonesian
                    ? "Dukungan CRO independen dengan integritas ilmiah"
                    : "Independent CRO support with scientific integrity"
                }
                sideDesc={
                  isIndonesian
                    ? "PML memadukan kualitas, kepatuhan, keahlian multidisiplin, dan dukungan proyek responsif untuk pelaksanaan studi yang andal."
                    : "PML combines quality, compliance, multidisciplinary expertise, and responsive project support for reliable study delivery."
                }
                sideHref="/about-us"
                sideCta={isIndonesian ? "Pelajari PML" : "Learn about PML"}
                sideIcon="building"
              />
            }
          >
            {isIndonesian ? "Tentang Kami" : "About Us"}
          </NavMega>

          <NavMega
            href={localizedHref("/services")}
            className={navMegaClass("/services", localizedServiceItems)}
            panel={
              <ServicesMegaPanel
                items={localizedServiceItems}
                locale={locale}
              />
            }
          >
            {isIndonesian ? "Layanan" : "Services"}
          </NavMega>

          <NavMega
            href={localizedHref("/facilities")}
            className={navMegaClass("/facilities", localizedFacilityItems)}
            panel={
              <MegaPanel
                locale={locale}
                label={
                  isIndonesian
                    ? "Fasilitas & Kapabilitas"
                    : "Facilities & Capability"
                }
                width="980"
                items={localizedFacilityItems}
                sideTitle={
                  isIndonesian
                    ? "Fasilitas untuk pelaksanaan studi yang andal"
                    : "Facilities for reliable study execution"
                }
                sideDesc={
                  isIndonesian
                    ? "PML mendukung kebutuhan klinis, analitik, dan operasional melalui fasilitas serta alur dokumentasi yang terintegrasi."
                    : "PML supports clinical, analytical, and operational needs through integrated facilities and documentation workflows."
                }
                sideHref="/facilities"
                sideCta={
                  isIndonesian ? "Jelajahi fasilitas" : "Explore facilities"
                }
                sideIcon="building"
              />
            }
          >
            {isIndonesian ? "Fasilitas" : "Facilities"}
          </NavMega>

          <Link
            className={navClass("/contact")}
            href={localizeHref("/contact", locale)}
          >
            {isIndonesian ? "Kontak" : "Contact"}
          </Link>

          <NavMega
            href={localizedHref("/insight")}
            className={navMegaClass("/insight", localizedInsightItems)}
            panel={
              <MegaPanel
                locale={locale}
                label={isIndonesian ? "Wawasan Terbaru" : "Latest Insight"}
                width="980"
                items={localizedInsightItems}
                sideTitle={
                  isIndonesian
                    ? "Sumber edukasi untuk kesiapan proyek yang lebih baik"
                    : "Educational resources for better project readiness"
                }
                sideDesc={
                  isIndonesian
                    ? "Jelajahi artikel, berita, publikasi, dan FAQ untuk memahami layanan PML dengan lebih baik."
                    : "Explore articles, news, publications, and FAQ content to better understand PML services."
                }
                sideHref="/insight"
                sideCta={isIndonesian ? "Lihat wawasan" : "View insight"}
                sideIcon="catalogue"
              />
            }
          >
            {isIndonesian ? "Wawasan" : "Insight"}
          </NavMega>

          <Link
            className={navClass("/careers")}
            href={localizedHref("/careers")}
          >
            {isIndonesian ? "Karier" : "Careers"}
          </Link>
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <LanguageSwitcher />

          <button
            type="button"
            onClick={onOpenProposal}
            className="inline-flex h-12 items-center justify-center rounded-full border border-[#039147] px-7 text-sm font-black text-[#039147] transition hover:bg-[#039147] hover:text-white"
          >
            {isIndonesian ? "Ajukan Proposal" : "Request Proposal"}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="relative z-[70] inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-sm xl:hidden"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
        >
          <span className="relative h-3.5 w-5">
            <span className="absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current" />
            <span className="absolute left-0 bottom-0 h-0.5 w-5 rounded-full bg-current" />
          </span>
        </button>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[999] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={closeMobile}
            aria-label="Close menu overlay"
          />

          <aside className="absolute right-0 top-0 h-[100dvh] w-[min(92vw,430px)] overflow-y-auto border-l border-black/5 bg-white p-5 shadow-2xl sm:p-6">
            <div className="flex items-center justify-between">
              <Image
                src="/images/LOGO-PML.png"
                alt="Pharma Metric Labs"
                width={150}
                height={80}
                className="h-13 w-auto scale-[1.12] origin-left sm:h-16 sm:scale-[1.2]"
              />

              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-[#f6faf7] text-black shadow-sm"
                onClick={closeMobile}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <div className="mt-7">
              <LanguageSwitcher mobile onNavigate={closeMobile} />
            </div>

            <div className="mt-5 grid gap-2.5 text-base font-black text-black sm:mt-7 sm:gap-3 sm:text-lg">
              <Link
                onClick={closeMobile}
                className={mobileLinkClass("/")}
                href={localizedHref("/")}
              >
                {isIndonesian ? "Beranda" : "Home"}
              </Link>

              <MobileAccordion
                title="About Us"
                href={localizedHref("/about-us")}
                items={localizedAboutItems}
                onNavigate={closeMobile}
                isActiveHref={isActiveHref}
              />

              <MobileAccordion
                title="Services"
                href={localizedHref("/services")}
                items={localizedServiceItems}
                onNavigate={closeMobile}
                isActiveHref={isActiveHref}
              />

              <MobileAccordion
                title="Facilities"
                href={localizedHref("/facilities")}
                items={localizedFacilityItems}
                onNavigate={closeMobile}
                isActiveHref={isActiveHref}
              />

              <Link
                onClick={closeMobile}
                className={mobileLinkClass("/contact")}
                href={localizedHref("/contact")}
              >
                {isIndonesian ? "Kontak" : "Contact"}
              </Link>

              <MobileAccordion
                title="Insight"
                href={localizedHref("/insight")}
                items={localizedInsightItems}
                onNavigate={closeMobile}
                isActiveHref={isActiveHref}
              />
            </div>

            <button
              type="button"
              onClick={() => {
                closeMobile();
                onOpenProposal();
              }}
              className="sticky bottom-4 mt-8 inline-flex w-full items-center justify-center rounded-full bg-[#039147] px-6 py-4 text-sm font-extrabold text-white shadow-[0_18px_40px_rgba(3,145,71,0.28)] transition active:scale-[0.99]"
            >
              {isIndonesian ? "Ajukan Proposal" : "Request a Proposal"}
            </button>
          </aside>
        </div>
      ) : null}
    </header>
  );
}
