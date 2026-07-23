"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import OtherServices from "@/components/OtherServices";
import { getLocaleFromPathname, localizeHref } from "@/i18n/client";

const heroSlides = [
  "/images/pml/services/clinical-trial-regulatory.png",
  "/images/pml/services/clinical-trial-cta.png",
  "/images/pml/services/contract-analysis-proof.png",
];

const scopeGroupsEn = [
  {
    title: "Product Registration",
    icon: "approval",
    items: [
      "New product registration support",
      "BPOM requirement review",
      "Registration pathway consultation",
      "Registration timeline and readiness discussion",
    ],
  },
  {
    title: "Post-approval Changes",
    icon: "strategy",
    items: [
      "Variations and post-approval change support",
      "Change impact discussion",
      "Supporting document review",
      "Regulatory follow-up planning",
    ],
  },
  {
    title: "Dossier & ACTD Support",
    icon: "document",
    items: [
      "Dossier gap analysis",
      "Preparation support for ACTD documents",
      "Technical document completeness review",
      "Clinical and non-clinical document review",
    ],
  },
  {
    title: "Regulatory Strategy Consultation",
    icon: "checklist",
    items: [
      "Regulatory strategy consultation",
      "Assessment of local study requirements",
      "Bridging consideration review",
      "Waiver opportunity discussion based on current BPOM regulations",
    ],
  },
  {
    title: "Compliance & Licensing Support",
    icon: "shield",
    items: [
      "Halal compliance support",
      "Importation and licensing support",
      "BPOM compliance requirement guidance",
      "Local agent or registration holder discussion",
    ],
  },
  {
    title: "Study-related Regulatory Review",
    icon: "network",
    items: [
      "BE study consultation",
      "Clinical trial consultation",
      "Review of existing clinical evidence",
      "Alignment of study data with registration needs",
    ],
  },
];

const clientsEn = [
  "Pharmaceutical companies",
  "Biologics and advanced therapy product companies",
  "Traditional and quasi-drug companies",
  "Medical device companies",
  "Overseas principals and manufacturers",
  "Companies preparing BPOM registration in Indonesia",
];

const benefitsEn = [
  {
    title: "One-stop regulatory support",
    text: "Support for regulatory management, documentation, and submission-related activities in one coordinated workflow.",
    icon: "strategy",
  },
  {
    title: "BPOM requirement understanding",
    text: "Guidance based on Indonesian regulatory requirements, submission processes, and product category considerations.",
    icon: "shield",
  },
  {
    title: "Stakeholder coordination",
    text: "Strong coordination with relevant stakeholders, local agents, and regulatory bodies to support registration communication.",
    icon: "network",
  },
  {
    title: "Current regulatory awareness",
    text: "Up-to-date knowledge of current regulations, regulatory trends, and practical considerations for registration planning.",
    icon: "document",
  },
];

const workflowEn = [
  "Initial consultation and product category review",
  "BPOM pathway, local agent, and registration requirement discussion",
  "Dossier gap analysis and ACTD documentation review",
  "Assessment of clinical, BE, non-clinical, or bridging data needs",
  "Regulatory strategy, compliance action plan, and submission readiness recommendations",
];

const requirementsEn = [
  "Product category and dosage form or device type",
  "Target registration objective in Indonesia",
  "Available dossier, ACTD, technical, clinical, or non-clinical documents",
  "Previous approvals from other regulatory authorities, if available",
  "Current product registration status and intended timeline",
  "Questions about BPOM pathway, local agent, BE study, clinical trial, or waiver needs",
];

const faqsEn = [
  {
    question: "Do you only support companies based in Indonesia?",
    answer:
      "No. PML also works with overseas principals and manufacturers to support product registration in Indonesia, including coordination with local agents and compliance with BPOM requirements.",
  },
  {
    question:
      "Do overseas companies need a local agent or local registration holder in Indonesia?",
    answer:
      "Yes. Foreign manufacturers are required to appoint a local company in Indonesia to act as the Marketing Authorization Holder or local agent for BPOM registration and communication.",
  },
  {
    question:
      "Can products already approved in other countries be directly registered in Indonesia?",
    answer:
      "Previous approvals from other regulatory authorities may support the registration process, especially approvals from SRA countries such as the UK, EU, US, Canada, Switzerland, Japan, and Australia. However, the product must still comply with BPOM requirements and local regulatory standards before it can be registered in Indonesia.",
  },
  {
    question: "Is a local clinical trial or BE study required in Indonesia?",
    answer:
      "The requirement for local clinical trials or Bioequivalence studies in Indonesia depends on several factors, including product category, regulatory pathway, existing clinical evidence, and country of origin. In some cases, BPOM may accept overseas clinical or BE data if the studies meet applicable regulatory standards and are considered representative for the Indonesian population. However, certain products may still require local studies or additional justification to support registration.",
  },
  {
    question: "Can PML help assess the best regulatory strategy?",
    answer:
      "Yes. PML can help evaluate the product and existing data package to determine an appropriate regulatory strategy, including assessment of local study requirements, bridging considerations, and potential waiver opportunities in line with current BPOM regulations.",
  },
];

const scopeGroupsId = [
  {
    title: "Registrasi Produk",
    icon: "approval",
    items: [
      "Dukungan registrasi produk baru",
      "Peninjauan persyaratan BPOM",
      "Konsultasi jalur registrasi",
      "Diskusi jadwal dan kesiapan registrasi",
    ],
  },
  {
    title: "Perubahan Pascapersetujuan",
    icon: "strategy",
    items: [
      "Dukungan variasi dan perubahan pascapersetujuan",
      "Diskusi dampak perubahan",
      "Peninjauan dokumen pendukung",
      "Perencanaan tindak lanjut regulasi",
    ],
  },
  {
    title: "Dukungan Dossier & ACTD",
    icon: "document",
    items: [
      "Analisis kesenjangan dossier",
      "Dukungan persiapan dokumen ACTD",
      "Peninjauan kelengkapan dokumen teknis",
      "Peninjauan dokumen klinis dan nonklinis",
    ],
  },
  {
    title: "Konsultasi Strategi Regulasi",
    icon: "checklist",
    items: [
      "Konsultasi strategi regulasi",
      "Penilaian kebutuhan studi lokal",
      "Peninjauan pertimbangan bridging",
      "Diskusi peluang waiver berdasarkan regulasi BPOM terkini",
    ],
  },
  {
    title: "Dukungan Kepatuhan & Perizinan",
    icon: "shield",
    items: [
      "Dukungan kepatuhan halal",
      "Dukungan impor dan perizinan",
      "Panduan persyaratan kepatuhan BPOM",
      "Diskusi local agent atau pemegang registrasi",
    ],
  },
  {
    title: "Peninjauan Regulasi Terkait Studi",
    icon: "network",
    items: [
      "Konsultasi studi BE",
      "Konsultasi uji klinis",
      "Peninjauan bukti klinis yang tersedia",
      "Penyelarasan data studi dengan kebutuhan registrasi",
    ],
  },
];

const clientsId = [
  "Perusahaan farmasi",
  "Perusahaan produk biologis dan advanced therapy",
  "Perusahaan obat tradisional dan kuasi",
  "Perusahaan alat kesehatan",
  "Prinsipal dan produsen luar negeri",
  "Perusahaan yang mempersiapkan registrasi BPOM di Indonesia",
];

const benefitsId = [
  {
    title: "Dukungan regulasi terpadu",
    text: "Dukungan untuk manajemen regulasi, dokumentasi, dan aktivitas terkait pengajuan dalam satu alur kerja yang terkoordinasi.",
    icon: "strategy",
  },
  {
    title: "Pemahaman persyaratan BPOM",
    text: "Panduan berdasarkan persyaratan regulasi Indonesia, proses pengajuan, dan pertimbangan kategori produk.",
    icon: "shield",
  },
  {
    title: "Koordinasi pemangku kepentingan",
    text: "Koordinasi dengan pemangku kepentingan, local agent, dan badan regulasi terkait untuk mendukung komunikasi registrasi.",
    icon: "network",
  },
  {
    title: "Pemahaman regulasi terkini",
    text: "Pengetahuan terkini mengenai regulasi, tren regulasi, dan pertimbangan praktis dalam perencanaan registrasi.",
    icon: "document",
  },
];

const workflowId = [
  "Konsultasi awal dan peninjauan kategori produk",
  "Diskusi jalur BPOM, local agent, dan persyaratan registrasi",
  "Analisis kesenjangan dossier dan peninjauan dokumentasi ACTD",
  "Penilaian kebutuhan data klinis, BE, nonklinis, atau bridging",
  "Rekomendasi strategi regulasi, rencana tindakan kepatuhan, dan kesiapan pengajuan",
];

const requirementsId = [
  "Kategori produk dan bentuk sediaan atau jenis alat",
  "Tujuan registrasi yang ditargetkan di Indonesia",
  "Dossier, ACTD, dokumen teknis, klinis, atau nonklinis yang tersedia",
  "Persetujuan dari otoritas regulasi lain apabila tersedia",
  "Status registrasi produk saat ini dan jadwal yang ditargetkan",
  "Pertanyaan mengenai jalur BPOM, local agent, studi BE, uji klinis, atau kebutuhan waiver",
];

const faqsId = [
  {
    question:
      "Apakah PML hanya mendukung perusahaan yang berbasis di Indonesia?",
    answer:
      "Tidak. PML juga bekerja sama dengan prinsipal dan produsen luar negeri untuk mendukung registrasi produk di Indonesia, termasuk koordinasi dengan local agent serta pemenuhan persyaratan BPOM.",
  },
  {
    question:
      "Apakah perusahaan luar negeri membutuhkan local agent atau pemegang registrasi lokal di Indonesia?",
    answer:
      "Ya. Produsen asing wajib menunjuk perusahaan lokal di Indonesia sebagai Marketing Authorization Holder atau local agent untuk proses registrasi dan komunikasi dengan BPOM.",
  },
  {
    question:
      "Apakah produk yang sudah disetujui di negara lain dapat langsung diregistrasikan di Indonesia?",
    answer:
      "Persetujuan dari otoritas regulasi lain dapat mendukung proses registrasi, terutama dari negara SRA seperti Inggris, Uni Eropa, Amerika Serikat, Kanada, Swiss, Jepang, dan Australia. Namun, produk tetap harus memenuhi persyaratan BPOM dan standar regulasi lokal sebelum dapat diregistrasikan di Indonesia.",
  },
  {
    question: "Apakah uji klinis lokal atau studi BE diwajibkan di Indonesia?",
    answer:
      "Kebutuhan uji klinis lokal atau studi bioekuivalensi di Indonesia bergantung pada beberapa faktor, termasuk kategori produk, jalur regulasi, bukti klinis yang tersedia, dan negara asal. Dalam kondisi tertentu, BPOM dapat menerima data klinis atau BE dari luar negeri apabila studi memenuhi standar regulasi yang berlaku dan dianggap representatif bagi populasi Indonesia. Namun, produk tertentu tetap dapat memerlukan studi lokal atau justifikasi tambahan untuk mendukung registrasi.",
  },
  {
    question:
      "Apakah PML dapat membantu menilai strategi regulasi yang paling tepat?",
    answer:
      "Ya. PML dapat membantu mengevaluasi produk dan paket data yang tersedia untuk menentukan strategi regulasi yang tepat, termasuk penilaian kebutuhan studi lokal, pertimbangan bridging, dan peluang waiver berdasarkan regulasi BPOM terkini.",
  },
];

function CheckIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12L10 17L20 7"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Icon({ name }: { name: string }) {
  if (name === "strategy") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 19L9 14L13 17L20 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 8H20V13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "document") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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

  if (name === "network") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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

  if (name === "shield") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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

  if (name === "approval") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
        <path
          d="M8.5 12L11 14.5L16 9.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M8 6H20M8 12H20M8 18H20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 6H4.01M4 12H4.01M4 18H4.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClientIcon({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M8 21V7L12 3L16 7V21"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M5 21H19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M10 10H14M10 14H14M10 18H14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
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

  if (index === 2) {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect
          x="5"
          y="4"
          width="14"
          height="16"
          rx="3"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M9 8H15M9 12H15M10 16H14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (index === 3) {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M6 20V10L12 6L18 10V20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M9 14H15M9 17H15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (index === 4) {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M7 4H17L19 9C19 12.9 15.9 16 12 16C8.1 16 5 12.9 5 9L7 4Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M9 20H15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M12 16V20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return <Icon name="document" />;
}

void ClientIcon;
export default function RegulatoryConsultationPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isIndonesian = locale === "id";

  const t = (english: string, indonesian: string) =>
    isIndonesian ? indonesian : english;

  const scopeGroups = isIndonesian ? scopeGroupsId : scopeGroupsEn;
  const clients = isIndonesian ? clientsId : clientsEn;
  const benefits = isIndonesian ? benefitsId : benefitsEn;
  const workflow = isIndonesian ? workflowId : workflowEn;
  const requirements = isIndonesian ? requirementsId : requirementsEn;
  const faqs = isIndonesian ? faqsId : faqsEn;

  const [activeSlide, setActiveSlide] = useState(0);

  const openProposal = () => {
    window.dispatchEvent(new CustomEvent("open-proposal-modal"));
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main>
      <section className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-black text-white">
        <div className="absolute inset-0">
          {heroSlides.map((slideImage, index) => (
            <Image
              key={slideImage}
              src={slideImage}
              alt=""
              fill
              priority={index === 0}
              className={`object-cover transition-opacity duration-1000 ${index === activeSlide ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-[#039147]/8" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/94 via-white/72 to-[#039147]/18" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/36 via-transparent to-white/8" />
        <div className="pml-hex-pattern absolute inset-0 opacity-[0.075]" />

        <div className="pml-container relative flex min-h-[calc(100vh-80px)] flex-col items-start justify-center py-16 md:py-24">
          <nav
            className="mb-10 flex flex-wrap items-center gap-2 text-sm font-bold text-black/58"
            aria-label="Breadcrumb"
          >
            <Link
              href={localizeHref("/", locale)}
              className="transition hover:text-[#039147]"
            >
              {t("Home", "Beranda")}
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href={localizeHref("/services", locale)}
              className="transition hover:text-[#039147]"
            >
              {t("Services", "Layanan")}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#039147]">
              {t("Regulatory Management", "Manajemen Regulasi")}
            </span>
          </nav>

          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#039147]/20 bg-white/95 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#039147] shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#039147]" />
              {t("Regulatory Management", "Manajemen Regulasi")}
            </p>

            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.04] tracking-tight text-black md:text-6xl lg:text-[68px]">
              {t(
                "Regulatory affairs support for BPOM registration and compliance",
                "Dukungan regulatory affairs untuk registrasi dan kepatuhan BPOM",
              )}
            </h1>

            <p className="mt-6 max-w-2xl text-[17px] leading-8 text-black/70 md:text-[19px] md:leading-9 md:text-lg">
              {t(
                "PML supports pharmaceutical, biologics, advanced therapy, traditional and quasi-drug, and medical device registration through practical regulatory strategy, documentation review, and BPOM-focused compliance guidance.",
                "PML mendukung registrasi produk farmasi, biologis, advanced therapy, obat tradisional dan kuasi, serta alat kesehatan melalui strategi regulasi yang praktis, peninjauan dokumentasi, dan panduan kepatuhan yang berfokus pada BPOM.",
              )}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={openProposal}
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-base font-extrabold text-[#039147] shadow-[0_18px_40px_rgba(0,0,0,0.22)]"
              >
                {t("Request a Proposal", "Ajukan Proposal")}
              </button>

              <a
                href="#regulatory-overview"
                className="inline-flex items-center justify-center rounded-full border border-[#039147]/25 bg-white/85 px-7 py-4 text-base font-extrabold text-[#039147] shadow-sm backdrop-blur transition hover:bg-[#039147] hover:text-white"
              >
                {t("Explore Service", "Jelajahi Layanan")}
              </a>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2">
            {heroSlides.map((slideImage, index) => (
              <button
                key={slideImage}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={`h-2.5 rounded-full transition-all ${index === activeSlide ? "w-8 bg-[#039147]" : "w-2.5 bg-black/25"}`}
                aria-label={`${t(
                  "Go to Regulatory Management hero slide",
                  "Buka slide hero Manajemen Regulasi",
                )} ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="regulatory-overview" className="bg-white py-20 md:py-28">
        <div className="pml-container">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
                {t("Service Overview", "Ringkasan Layanan")}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
                {t(
                  "Regulatory affairs expertise across multiple product categories",
                  "Keahlian regulatory affairs untuk berbagai kategori produk",
                )}
              </h2>
            </div>

            <div className="space-y-5 text-[17px] leading-8 text-black/68 md:text-[19px] md:leading-9">
              <p>
                {t(
                  "PML’s Regulatory Affairs team supports companies with experience across pharmaceutical products, biologics, advanced therapy products, traditional and quasi drugs, and medical device registration. The service helps companies navigate BPOM requirements through practical and strategic regulatory solutions aligned with business timelines.",
                  "Tim Regulatory Affairs PML mendukung perusahaan dengan pengalaman pada registrasi produk farmasi, biologis, advanced therapy, obat tradisional dan kuasi, serta alat kesehatan. Layanan ini membantu perusahaan menjalani persyaratan BPOM melalui solusi regulasi yang praktis dan strategis serta selaras dengan jadwal bisnis.",
                )}
              </p>

              <p>
                {t(
                  "Support includes new product registration, post-approval variations, dossier gap analysis, ACTD document preparation, regulatory strategy consultation, halal compliance, importation and licensing support, and review of clinical or non-clinical documents.",
                  "Dukungan mencakup registrasi produk baru, variasi pascapersetujuan, analisis kesenjangan dossier, persiapan dokumen ACTD, konsultasi strategi regulasi, kepatuhan halal, dukungan impor dan perizinan, serta peninjauan dokumen klinis maupun nonklinis.",
                )}
              </p>
            </div>
          </div>

          <div className="-mx-4 mt-10 flex snap-x gap-4 overflow-x-auto px-4 pb-5 md:mx-0 md:mt-12 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <article
                key={benefit.title}
                className="w-[78vw] max-w-[320px] shrink-0 snap-start rounded-[26px] border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl md:w-auto md:max-w-none md:rounded-[28px] md:p-6"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf8f0] text-[#039147]">
                  <Icon name={benefit.icon} />
                </div>
                <h3 className="text-xl font-black leading-tight text-black">
                  {benefit.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-black/60">
                  {benefit.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#eaf8f0] py-20 md:py-28">
        <div className="pml-container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
              {t("Scope of Service", "Ruang Lingkup Layanan")}
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
              {t(
                "Support for BPOM registration, ACTD documents, and regulatory strategy",
                "Dukungan registrasi BPOM, dokumen ACTD, dan strategi regulasi",
              )}
            </h2>

            <p className="mt-6 text-[17px] leading-8 text-black/68 md:text-[19px] md:leading-9 md:text-lg">
              {t(
                "PML helps clients review registration pathways, identify dossier gaps, prepare ACTD-related documentation, assess study requirements, and align compliance needs with BPOM expectations.",
                "PML membantu klien meninjau jalur registrasi, mengidentifikasi kesenjangan dossier, menyiapkan dokumentasi terkait ACTD, menilai kebutuhan studi, dan menyelaraskan kebutuhan kepatuhan dengan ekspektasi BPOM.",
              )}
            </p>
          </div>

          <div className="-mx-4 mt-10 flex snap-x gap-4 overflow-x-auto px-4 pb-5 md:mx-0 md:mt-12 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
            {scopeGroups.map((group) => (
              <article
                key={group.title}
                className="w-[78vw] max-w-[320px] shrink-0 snap-start rounded-[26px] border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl md:w-auto md:max-w-none md:rounded-[30px] md:p-7"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf8f0] text-[#039147]">
                  <Icon name={group.icon} />
                </div>

                <h3 className="text-xl font-black leading-tight text-black md:text-xl">
                  {group.title}
                </h3>

                <ul className="mt-4 space-y-2.5 md:mt-5 md:space-y-3">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2 text-base font-bold leading-7 text-black/65 md:gap-3 md:text-base md:leading-7"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#039147]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-20 md:py-28">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(3,145,71,0.08),transparent_30%),radial-gradient(circle_at_8%_88%,rgba(255,40,0,0.035),transparent_24%)]"
          aria-hidden="true"
        />

        <svg
          className="absolute right-[-120px] top-[-80px] h-[360px] w-[360px] text-[#039147]/8"
          viewBox="0 0 360 360"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M180 18L318 98V262L180 342L42 262V98L180 18Z"
            stroke="currentColor"
            strokeWidth="4"
          />
        </svg>

        <div className="pml-container relative">
          <div className="max-w-4xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
              {t("Target Client", "Target Klien")}
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
              {t(
                "Built for local and overseas companies preparing Indonesian registration",
                "Dirancang untuk perusahaan lokal dan luar negeri yang mempersiapkan registrasi di Indonesia",
              )}
            </h2>

            <p className="mt-6 max-w-3xl text-base leading-8 text-black/62">
              {t(
                "Regulatory Management supports local companies, overseas principals, manufacturers, and product teams that need clarity on BPOM requirements, local agent needs, registration pathways, documentation gaps, and compliance planning.",
                "Manajemen Regulasi mendukung perusahaan lokal, prinsipal luar negeri, produsen, dan tim produk yang membutuhkan kejelasan mengenai persyaratan BPOM, kebutuhan local agent, jalur registrasi, kesenjangan dokumentasi, dan perencanaan kepatuhan.",
              )}
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {clients.map((client) => (
              <article
                key={client}
                className="group relative overflow-hidden rounded-[30px] border border-black/5 bg-white/92 p-7 text-center shadow-[0_18px_55px_rgba(0,0,0,0.06)] backdrop-blur transition hover:-translate-y-1 hover:border-[#039147]/20 hover:shadow-[0_26px_70px_rgba(3,145,71,0.11)]"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#039147] via-[#039147]/35 to-[#FF2800]/55 opacity-0 transition group-hover:opacity-100" />

                <div className="mx-auto mb-6 flex h-13 w-13 items-center justify-center rounded-2xl border border-[#039147]/10 bg-[#eaf8f0] text-[#039147]">
                  <Icon name="document" />
                </div>

                <h3 className="text-base font-black leading-tight text-black">
                  {client}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#eaf8f0] py-20 md:py-28">
        <div className="pml-container">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
                {t("Process / Workflow", "Proses / Alur Kerja")}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
                {t(
                  "From regulatory question to submission readiness plan",
                  "Dari pertanyaan regulasi hingga rencana kesiapan pengajuan",
                )}
              </h2>

              <div className="mt-8 space-y-4">
                {workflow.map((step, index) => (
                  <div
                    key={step}
                    className="flex gap-4 rounded-[24px] border border-black/5 bg-white p-5 shadow-sm"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#039147] text-base font-black text-white">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="pt-2 text-base font-bold leading-7 text-black/70">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[34px] bg-white p-3 shadow-[0_24px_70px_rgba(0,0,0,0.10)]">
              <Image
                src="/images/pml/services/clinical-trial-regulatory.png"
                alt={t(
                  "Regulatory management documentation workflow",
                  "Alur dokumentasi manajemen regulasi",
                )}
                width={900}
                height={675}
                className="aspect-[4/3] w-full rounded-[26px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#f4fbf7] px-4 py-20 text-black md:py-28">
        <Image
          src="/images/pml/services/contract-analysis-proof.png"
          alt=""
          fill
          className="object-cover opacity-24"
        />
        <div className="absolute inset-0 bg-white/72" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/96 via-white/84 to-[#039147]/12" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_30%,rgba(3,145,71,0.13),transparent_34%),radial-gradient(circle_at_18%_72%,rgba(255,40,0,0.04),transparent_26%)]" />

        <svg
          className="absolute right-[-120px] top-[-90px] h-[400px] w-[400px] text-[#039147]/10"
          viewBox="0 0 400 400"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M200 20L356 110V290L200 380L44 290V110L200 20Z"
            stroke="currentColor"
            strokeWidth="4"
          />
        </svg>

        <div className="pml-container relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
              {t("Proof & Trust Signals", "Bukti & Indikator Kepercayaan")}
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
              {t(
                "Regulatory affairs support backed by BPOM-focused execution",
                "Dukungan regulatory affairs dengan pelaksanaan yang berfokus pada BPOM",
              )}
            </h2>

            <p className="mt-6 text-[17px] leading-8 text-black/70 md:text-[19px] md:leading-9">
              {t(
                "PML combines regulatory affairs experience, BPOM requirement understanding, documentation support, and coordination with scientific CRO services to help clients prepare stronger registration strategies.",
                "PML memadukan pengalaman regulatory affairs, pemahaman persyaratan BPOM, dukungan dokumentasi, dan koordinasi dengan layanan CRO ilmiah untuk membantu klien mempersiapkan strategi registrasi yang lebih kuat.",
              )}
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
            {[
              [
                t("Strategy", "Strategi"),
                t(
                  "Practical strategy for registration, bridging, BE, clinical trial, and waiver considerations.",
                  "Strategi praktis untuk registrasi, bridging, BE, uji klinis, dan pertimbangan waiver.",
                ),
              ],
              [
                t("Documents", "Dokumen"),
                t(
                  "Dossier gap analysis and ACTD-related document preparation support.",
                  "Analisis kesenjangan dossier dan dukungan persiapan dokumen terkait ACTD.",
                ),
              ],
              [
                t("Compliance", "Kepatuhan"),
                t(
                  "Guidance for BPOM requirements, halal compliance, importation, and licensing support.",
                  "Panduan persyaratan BPOM, kepatuhan halal, impor, dan dukungan perizinan.",
                ),
              ],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="rounded-[30px] border border-black/5 bg-white/92 p-7 shadow-[0_18px_55px_rgba(0,0,0,0.07)] backdrop-blur transition hover:-translate-y-1 hover:border-[#039147]/20 hover:shadow-[0_26px_70px_rgba(3,145,71,0.12)]"
              >
                <p className="text-3xl font-black text-black md:text-4xl">
                  {title}
                </p>
                <p className="mt-4 text-base font-bold leading-8 text-black/62">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#eaf8f0] py-20 md:py-28">
        <div className="pml-container">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
                {t("Required Information", "Informasi yang Dibutuhkan")}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
                {t(
                  "What we need to start BPOM registration discussion",
                  "Informasi yang diperlukan untuk memulai diskusi registrasi BPOM",
                )}
              </h2>

              <p className="mt-6 text-[17px] leading-8 text-black/68 md:text-[19px] md:leading-9 md:text-lg">
                {t(
                  "To provide relevant regulatory direction, clients can share product category, registration objective, available dossier or technical documents, previous approvals, and questions about BPOM pathway, local agent, or study requirements.",
                  "Untuk memberikan arahan regulasi yang relevan, klien dapat menyampaikan kategori produk, tujuan registrasi, dossier atau dokumen teknis yang tersedia, persetujuan sebelumnya, serta pertanyaan mengenai jalur BPOM, local agent, atau kebutuhan studi.",
                )}
              </p>

              <button
                type="button"
                onClick={openProposal}
                className="mt-8 inline-flex items-center justify-center rounded-full bg-[#039147] px-7 py-4 text-base font-extrabold text-white shadow-[0_18px_40px_rgba(3,145,71,0.22)]"
              >
                {t("Discuss This Service", "Diskusikan Layanan Ini")}
              </button>
            </div>

            <div className="grid gap-4">
              {requirements.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-[22px] border border-black/5 bg-white p-5 shadow-sm"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eaf8f0] text-[#039147]">
                    <CheckIcon />
                  </span>
                  <p className="text-base font-bold leading-7 text-black/70">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="regulatory-faq" className="bg-white py-20 md:py-28">
        <div className="pml-container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
              {t("Regulatory FAQ", "FAQ Regulasi")}
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
              {t(
                "Frequently asked questions",
                "Pertanyaan yang Sering Diajukan",
              )}
            </h2>
          </div>

          <div className="mx-auto mt-10 max-w-4xl space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-[24px] border border-black/5 bg-white p-6 shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-xl font-black text-black">
                  {faq.question}
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eaf8f0] text-[#039147] transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-base leading-8 text-black/60">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <OtherServices current="regulatory-consultation" variant="three" />

      <section className="bg-white pb-24 md:pb-32">
        <div className="pml-container">
          <div className="relative overflow-hidden rounded-[36px] bg-[#f4fbf7] px-8 py-16 text-center text-black shadow-[0_28px_90px_rgba(0,0,0,0.12)] md:px-14 md:py-20">
            <Image
              src="/images/pml/services/clinical-trial-cta.png"
              alt=""
              fill
              className="object-cover opacity-46"
            />

            <div className="absolute inset-0 bg-white/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/74 to-[#039147]/18" />
            <div className="pml-hex-pattern absolute inset-0 opacity-[0.06]" />

            <div className="relative mx-auto max-w-3xl">
              <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/25 bg-white/90 shadow-lg backdrop-blur">
                <Image
                  src="/images/LOGO-PML.png"
                  alt="PML"
                  width={64}
                  height={40}
                  className="h-8 w-auto"
                />
              </div>

              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
                {t("Start a Project", "Mulai Proyek")}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
                {t(
                  "Need BPOM regulatory management?",
                  "Membutuhkan dukungan manajemen regulasi BPOM?",
                )}
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-8 text-black/70 md:text-[19px] md:leading-9">
                {t(
                  "Share your product registration, documentation, local agent, or study requirement questions with our team and we will help identify the right regulatory next steps.",
                  "Sampaikan pertanyaan mengenai registrasi produk, dokumentasi, local agent, atau kebutuhan studi kepada tim kami. Kami akan membantu menentukan langkah regulasi berikutnya yang tepat.",
                )}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={openProposal}
                  className="inline-flex items-center justify-center rounded-full bg-[#039147] px-8 py-4 text-base font-extrabold text-white shadow-[0_18px_44px_rgba(3,145,71,0.22)] transition hover:-translate-y-0.5 hover:bg-[#027a3c]"
                >
                  {t("Request a Proposal", "Ajukan Proposal")}
                </button>

                <a
                  href="#regulatory-overview"
                  className="inline-flex items-center justify-center rounded-full border border-[#039147]/25 bg-white/85 px-8 py-4 text-base font-extrabold text-[#039147] shadow-sm backdrop-blur transition hover:bg-[#039147] hover:text-white"
                >
                  {t("Review Regulatory Service", "Tinjau Layanan Regulasi")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
