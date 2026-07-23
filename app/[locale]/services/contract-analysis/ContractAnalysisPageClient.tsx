"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import OtherServices from "@/components/OtherServices";
import { getLocaleFromPathname, localizeHref } from "@/i18n/client";

const heroSlides = [
  "/images/pml/services/contract-analysis-hero.png",
  "/images/pml/services/contract-analysis-lab.png",
  "/images/pml/services/contract-analysis-sample.png",
];

const scopeGroupsEn = [
  {
    title: "Analytical Development Center",
    icon: "lab",
    featured: true,
    items: [
      "Method Development: Trial, Verification and Validation",
      "Pharmacopoeial and In-House Method Development & Implementation",
      "Comparative Dissolution Testing",
      "Stability Sample Storage in Qualified Stability Chambers",
      "Analytical Method Transfer Support",
    ],
  },
  {
    title: "Microbiology Support",
    icon: "microbiology",
    items: [
      "Microbiological testing support",
      "Product safety-related laboratory testing",
      "Environmental or sample-related microbiology checks when applicable",
      "Documentation support for microbiology results",
    ],
  },
  {
    title: "Multi-industry Product Testing",
    icon: "industry",
    items: [
      "Pharmaceutical product testing",
      "Biotechnology product support",
      "Food and beverage product analysis",
      "Cosmetic product testing support",
      "Testing support for selected UMKM products",
    ],
  },
  {
    title: "Sample Handling",
    icon: "sample",
    items: [
      "Sample receiving and registration",
      "Sample requirement review",
      "Selected sample pick-up coordination",
      "Sample preparation and laboratory workflow coordination",
    ],
  },
  {
    title: "Compliance Documentation",
    icon: "document",
    items: [
      "Laboratory result documentation",
      "Testing report preparation",
      "Traceable analysis workflow",
      "Documentation support for quality and regulatory needs",
    ],
  },
  {
    title: "Urgent Analysis Support",
    icon: "clock",
    items: [
      "Urgent analysis review for selected parameters",
      "Timeline discussion based on lab capacity",
      "Project-specific availability confirmation",
      "Fast-track coordination when eligible",
    ],
  },
];

const clientsEn = [
  "Pharmaceutical companies",
  "Biotechnology companies",
  "Food and beverage companies, including selected UMKM products",
  "Cosmetic companies",
];

const benefitsEn = [
  {
    title: "Reliable product quality support",
    text: "Analytical testing services help sponsors evaluate product quality, safety, and compliance needs.",
    icon: "shield",
  },
  {
    title: "Multi-industry testing capability",
    text: "PML supports testing needs across pharmaceutical, biotechnology, food and beverage, and cosmetic products.",
    icon: "industry",
  },
  {
    title: "Clear laboratory documentation",
    text: "Testing activities are supported by structured documentation and laboratory result reporting.",
    icon: "document",
  },
  {
    title: "Flexible project coordination",
    text: "Selected projects may be supported with sample pick-up and urgent analysis coordination based on eligibility.",
    icon: "network",
  },
];

const workflowEn = [
  "Initial inquiry and testing requirement review",
  "Sample type, parameter, method, and timeline confirmation",
  "Quotation, sample submission, and laboratory scheduling",
  "Sample receiving, preparation, and analytical testing",
  "Result review, documentation, and report delivery",
];

const requirementsEn = [
  "Product or sample type",
  "Testing parameter or analysis objective",
  "Sample quantity and sample condition",
  "Preferred timeline or urgency level",
  "Required method, standard, or regulatory context, if available",
  "Pick-up location if sample collection support is requested",
];

const faqsEn = [
  {
    question: "Does PML provide sample pick-up services?",
    answer:
      "Yes. PML provides sample pick-up services, and selected locations may be eligible for complimentary pick-up. Please contact the team to check eligibility and arrange the collection schedule.",
  },
  {
    question: "Is urgent analysis service available?",
    answer:
      "Yes. PML provides urgent analysis services for selected testing parameters and projects, depending on laboratory capacity and sample requirements. Please contact the team for further discussion regarding timeline and availability.",
  },
  {
    question: "Who can use Contract Analysis services?",
    answer:
      "Contract Analysis services are relevant for pharmaceutical companies, biotechnology companies, food and beverage companies including selected UMKM products, and cosmetic companies that need product quality, safety, or compliance-related testing support.",
  },
  {
    question: "What information should be prepared before requesting analysis?",
    answer:
      "Clients should prepare the product or sample type, testing parameters, sample quantity, expected timeline, required method or standard if available, and any specific documentation requirements.",
  },
];

const scopeGroupsId = [
  {
    title: "Pusat Pengembangan Analitik",
    icon: "lab",
    featured: true,
    items: [
      "Pengembangan Metode: Uji Coba, Verifikasi, dan Validasi",
      "Pengembangan dan Implementasi Metode Farmakope serta In-House",
      "Uji Disolusi Terbanding",
      "Penyimpanan Sampel Stabilitas di Stability Chamber Terkualifikasi",
      "Dukungan Transfer Metode Analitik",
    ],
  },
  {
    title: "Dukungan Mikrobiologi",
    icon: "microbiology",
    items: [
      "Dukungan pengujian mikrobiologi",
      "Pengujian laboratorium terkait keamanan produk",
      "Pemeriksaan mikrobiologi lingkungan atau sampel bila diperlukan",
      "Dukungan dokumentasi hasil mikrobiologi",
    ],
  },
  {
    title: "Pengujian Produk Multiindustri",
    icon: "industry",
    items: [
      "Pengujian produk farmasi",
      "Dukungan produk bioteknologi",
      "Analisis produk makanan dan minuman",
      "Dukungan pengujian produk kosmetik",
      "Dukungan pengujian untuk produk UMKM terpilih",
    ],
  },
  {
    title: "Penanganan Sampel",
    icon: "sample",
    items: [
      "Penerimaan dan registrasi sampel",
      "Peninjauan kebutuhan sampel",
      "Koordinasi pengambilan sampel terpilih",
      "Persiapan sampel dan koordinasi alur kerja laboratorium",
    ],
  },
  {
    title: "Dokumentasi Kepatuhan",
    icon: "document",
    items: [
      "Dokumentasi hasil laboratorium",
      "Persiapan laporan pengujian",
      "Alur analisis yang dapat ditelusuri",
      "Dukungan dokumentasi untuk kebutuhan mutu dan regulasi",
    ],
  },
  {
    title: "Dukungan Analisis Mendesak",
    icon: "clock",
    items: [
      "Peninjauan analisis mendesak untuk parameter terpilih",
      "Diskusi jadwal berdasarkan kapasitas laboratorium",
      "Konfirmasi ketersediaan sesuai kebutuhan proyek",
      "Koordinasi jalur cepat apabila memenuhi persyaratan",
    ],
  },
];

const clientsId = [
  "Perusahaan farmasi",
  "Perusahaan bioteknologi",
  "Perusahaan makanan dan minuman, termasuk produk UMKM terpilih",
  "Perusahaan kosmetik",
];

const benefitsId = [
  {
    title: "Dukungan mutu produk yang andal",
    text: "Layanan pengujian analitik membantu sponsor mengevaluasi kebutuhan mutu, keamanan, dan kepatuhan produk.",
    icon: "shield",
  },
  {
    title: "Kapabilitas pengujian multiindustri",
    text: "PML mendukung kebutuhan pengujian produk farmasi, bioteknologi, makanan dan minuman, serta kosmetik.",
    icon: "industry",
  },
  {
    title: "Dokumentasi laboratorium yang jelas",
    text: "Aktivitas pengujian didukung oleh dokumentasi terstruktur dan pelaporan hasil laboratorium.",
    icon: "document",
  },
  {
    title: "Koordinasi proyek yang fleksibel",
    text: "Proyek terpilih dapat didukung dengan pengambilan sampel dan koordinasi analisis mendesak berdasarkan kelayakan.",
    icon: "network",
  },
];

const workflowId = [
  "Permintaan awal dan peninjauan kebutuhan pengujian",
  "Konfirmasi jenis sampel, parameter, metode, dan jadwal",
  "Penawaran, penyerahan sampel, dan penjadwalan laboratorium",
  "Penerimaan, persiapan, dan pengujian analitik sampel",
  "Peninjauan hasil, dokumentasi, dan penyerahan laporan",
];

const requirementsId = [
  "Jenis produk atau sampel",
  "Parameter pengujian atau tujuan analisis",
  "Jumlah dan kondisi sampel",
  "Jadwal yang diharapkan atau tingkat urgensi",
  "Metode, standar, atau konteks regulasi yang dibutuhkan apabila tersedia",
  "Lokasi pengambilan apabila dukungan pengambilan sampel diperlukan",
];

const faqsId = [
  {
    question: "Apakah PML menyediakan layanan pengambilan sampel?",
    answer:
      "Ya. PML menyediakan layanan pengambilan sampel, dan lokasi terpilih dapat memenuhi syarat untuk pengambilan gratis. Silakan hubungi tim kami untuk memeriksa kelayakan dan mengatur jadwal pengambilan.",
  },
  {
    question: "Apakah layanan analisis mendesak tersedia?",
    answer:
      "Ya. PML menyediakan layanan analisis mendesak untuk parameter pengujian dan proyek terpilih, bergantung pada kapasitas laboratorium dan kebutuhan sampel. Silakan hubungi tim kami untuk mendiskusikan jadwal dan ketersediaannya.",
  },
  {
    question: "Siapa yang dapat menggunakan layanan Analisis Kontrak?",
    answer:
      "Layanan Analisis Kontrak relevan bagi perusahaan farmasi, bioteknologi, makanan dan minuman termasuk produk UMKM terpilih, serta perusahaan kosmetik yang membutuhkan dukungan pengujian terkait mutu, keamanan, atau kepatuhan produk.",
  },
  {
    question: "Informasi apa yang perlu disiapkan sebelum meminta analisis?",
    answer:
      "Klien perlu menyiapkan jenis produk atau sampel, parameter pengujian, jumlah sampel, jadwal yang diharapkan, metode atau standar apabila tersedia, dan kebutuhan dokumentasi khusus.",
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
  if (name === "lab") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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

  if (name === "microbiology") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="8" cy="9" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="16" cy="15" r="3" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 12L14 14M6 15L5 19M18 5L19 9M5 5L7 7M17 17L20 20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "industry") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 20V9L9 12V9L14 12V7H20V20H4Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M8 16H9.5M12 16H13.5M16 16H17.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "food") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M7 4V11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M5 4V8C5 9.7 6.3 11 8 11C9.7 11 11 9.7 11 8V4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M8 11V20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M16 4V20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M16 4C18 5.2 19 7.2 19 10V12H16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "cosmetic") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 10H15V20H9V10Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M10 10V7.5L12 4L14 7.5V10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 14H15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M17.5 5.5L18.5 7.5L20.5 8.5L18.5 9.5L17.5 11.5L16.5 9.5L14.5 8.5L16.5 7.5L17.5 5.5Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "sample") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect
          x="7"
          y="4"
          width="10"
          height="16"
          rx="3"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M10 9H14M10 13H14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "clock") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 8V12L15 14"
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
    return <Icon name="lab" />;
  }

  if (index === 2) {
    return <Icon name="food" />;
  }

  return <Icon name="cosmetic" />;
}

export default function ContractAnalysisPage() {
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

        <div className="absolute inset-0 bg-[#039147]/22" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/62 to-[#039147]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
        <div className="pml-hex-pattern absolute inset-0 opacity-[0.075]" />

        <div className="pml-container relative flex min-h-[calc(100vh-80px)] flex-col justify-center py-16 md:py-24">
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
              {t("Contract Analysis", "Analisis Kontrak")}
            </span>
          </nav>

          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#039147]/20 bg-white/95 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#039147] shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#039147]" />
              {t("Contract Analysis", "Analisis Kontrak")}
            </p>

            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.04] tracking-tight text-black md:text-6xl lg:text-[68px]">
              {t(
                "Reliable analytical testing for product quality and compliance",
                "Pengujian analitik yang andal untuk mutu dan kepatuhan produk",
              )}
            </h1>

            <p className="mt-6 max-w-2xl text-[17px] leading-8 text-black/70 md:text-[19px] md:leading-9 md:text-lg">
              {t(
                "PML supports pharmaceutical, biotechnology, food and beverage, and cosmetic companies with contract analysis services for product quality, safety, and regulatory compliance needs.",
                "PML mendukung perusahaan farmasi, bioteknologi, makanan dan minuman, serta kosmetik melalui layanan analisis kontrak untuk kebutuhan mutu, keamanan, dan kepatuhan regulasi produk.",
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
                href="#contract-overview"
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
                  "Go to Contract Analysis hero slide",
                  "Buka slide hero Analisis Kontrak",
                )} ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="contract-overview" className="bg-white py-20 md:py-28">
        <div className="pml-container">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
                {t("Service Overview", "Ringkasan Layanan")}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
                {t(
                  "Laboratory analysis support for multiple product categories",
                  "Dukungan analisis laboratorium untuk berbagai kategori produk",
                )}
              </h2>
            </div>

            <div className="space-y-5 text-[17px] leading-8 text-black/68 md:text-[19px] md:leading-9">
              <p>
                {t(
                  "PML provides contract analysis services for companies that need reliable laboratory testing support for product quality, safety, and compliance needs. The service is designed for pharmaceutical, biotechnology, food and beverage, and cosmetic product requirements.",
                  "PML menyediakan layanan analisis kontrak bagi perusahaan yang membutuhkan dukungan pengujian laboratorium yang andal untuk kebutuhan mutu, keamanan, dan kepatuhan produk. Layanan ini dirancang untuk kebutuhan produk farmasi, bioteknologi, makanan dan minuman, serta kosmetik.",
                )}
              </p>

              <p>
                {t(
                  "From sample receiving and testing requirement review to analytical execution and report documentation, PML helps clients move from testing inquiry to clear laboratory results with structured project coordination.",
                  "Mulai dari penerimaan sampel dan peninjauan kebutuhan pengujian hingga pelaksanaan analitik dan dokumentasi laporan, PML membantu klien bergerak dari permintaan pengujian menuju hasil laboratorium yang jelas melalui koordinasi proyek yang terstruktur.",
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
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#039147]/10 bg-[#eaf8f0] text-[#039147] transition group-hover:scale-105">
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
                "Contract analysis services for quality, safety, and documentation",
                "Layanan analisis kontrak untuk mutu, keamanan, dan dokumentasi",
              )}
            </h2>

            <p className="mt-6 text-[17px] leading-8 text-black/68 md:text-[19px] md:leading-9 md:text-lg">
              {t(
                "PML supports selected analytical, microbiology, sample handling, documentation, and urgent analysis needs through a structured laboratory workflow.",
                "PML mendukung kebutuhan analitik, mikrobiologi, penanganan sampel, dokumentasi, dan analisis mendesak terpilih melalui alur kerja laboratorium yang terstruktur.",
              )}
            </p>
          </div>

          <div className="-mx-4 mt-10 flex snap-x gap-4 overflow-x-auto px-4 pb-5 md:mx-0 md:mt-12 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
            {scopeGroups.map((group) => (
              <article
                key={group.title}
                className={`group relative w-[78vw] max-w-[340px] shrink-0 snap-start overflow-hidden rounded-[30px] border p-6 shadow-sm transition duration-300 hover:-translate-y-1 md:w-auto md:max-w-none md:rounded-[34px] md:p-8 ${
                  group.featured
                    ? "border-[#039147]/22 bg-white shadow-[0_34px_110px_rgba(3,145,71,0.18)] lg:col-span-3"
                    : "border-black/5 bg-white/96 hover:border-[#039147]/18 hover:shadow-[0_24px_70px_rgba(3,145,71,0.12)]"
                }`}
              >
                <div className="absolute -right-14 -top-14 h-32 w-32 rounded-full bg-[#eaf8f0] transition duration-500 group-hover:scale-125" />

                <div
                  className={`relative ${group.featured ? "grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center" : ""}`}
                >
                  <div>
                    <div
                      className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#039147]/10 transition group-hover:scale-105 ${
                        group.featured
                          ? "bg-[#039147] text-white shadow-[0_18px_42px_rgba(3,145,71,0.26)]"
                          : "bg-[#eaf8f0] text-[#039147]"
                      }`}
                    >
                      <Icon name={group.icon} />
                    </div>

                    {group.featured && (
                      <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-[#039147]">
                        {t(
                          "Analytical Development Services",
                          "Layanan Pengembangan Analitik",
                        )}
                      </p>
                    )}

                    <h3
                      className={`text-xl font-black leading-tight text-black ${
                        group.featured ? "md:text-4xl" : "md:text-2xl"
                      }`}
                    >
                      {group.title}
                    </h3>

                    {group.featured && (
                      <p className="mt-4 max-w-xl text-base font-semibold leading-8 text-black/58">
                        {t(
                          "Dedicated analytical development support for method readiness, verification, validation, dissolution comparison, stability storage, and method transfer.",
                          "Dukungan pengembangan analitik khusus untuk kesiapan metode, verifikasi, validasi, uji disolusi terbanding, penyimpanan stabilitas, dan transfer metode.",
                        )}
                      </p>
                    )}
                  </div>

                  <ul
                    className={`space-y-3 ${
                      group.featured
                        ? "rounded-[28px] border border-[#039147]/10 bg-[#f4fbf7] p-5 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-3 md:space-y-0 md:p-6"
                        : "mt-5 md:mt-6"
                    }`}
                  >
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-base font-bold leading-7 text-black/65"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#039147]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="pml-container">
          <div className="max-w-4xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
              {t("Target Client", "Target Klien")}
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
              {t(
                "Built for companies that need reliable product testing support",
                "Dirancang bagi perusahaan yang membutuhkan dukungan pengujian produk yang andal",
              )}
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-[17px] leading-8 text-black/68 md:text-[19px] md:leading-9 md:text-lg">
              {t(
                "Contract Analysis services are relevant for companies that need product quality, safety, compliance, or laboratory testing support across multiple product categories.",
                "Layanan Analisis Kontrak relevan bagi perusahaan yang membutuhkan dukungan mutu, keamanan, kepatuhan, atau pengujian laboratorium untuk berbagai kategori produk.",
              )}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 md:mt-12 md:grid-cols-2 md:gap-5 lg:grid-cols-4">
            {clients.map((client, index) => (
              <article
                key={client}
                className="group rounded-[22px] border border-black/5 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl md:rounded-[28px] md:p-7"
              >
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eaf8f0] text-[#039147] transition group-hover:bg-[#eaf8f0] group-hover:text-[#039147] md:mb-5 md:h-14 md:w-14">
                  <ClientIcon index={index} />
                </div>
                <h3 className="text-sm font-black leading-tight text-black md:text-lg">
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
                  "From sample inquiry to laboratory report",
                  "Dari permintaan sampel hingga laporan laboratorium",
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
                src="/images/pml/services/contract-analysis-sample.png"
                alt={t(
                  "Contract analysis sample handling",
                  "Penanganan sampel analisis kontrak",
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
                "Analytical support backed by laboratory capability and structured reporting",
                "Dukungan analitik yang didukung kapabilitas laboratorium dan pelaporan terstruktur",
              )}
            </h2>

            <p className="mt-6 text-[17px] leading-8 text-black/70 md:text-[19px] md:leading-9">
              {t(
                "PML supports clients with analytical testing workflows designed to help evaluate product quality, safety, documentation, and compliance-related requirements.",
                "PML mendukung klien melalui alur pengujian analitik yang dirancang untuk membantu mengevaluasi mutu, keamanan, dokumentasi, dan kebutuhan terkait kepatuhan produk.",
              )}
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
            {[
              [
                t("Multi-industry", "Multiindustri"),
                t(
                  "Support for pharmaceutical, biotech, food and beverage, and cosmetic products.",
                  "Dukungan untuk produk farmasi, bioteknologi, makanan dan minuman, serta kosmetik.",
                ),
              ],
              [
                t("Sample support", "Dukungan sampel"),
                t(
                  "Selected locations may be eligible for sample pick-up coordination.",
                  "Lokasi terpilih dapat memenuhi syarat untuk koordinasi pengambilan sampel.",
                ),
              ],
              [
                t("Urgent option", "Opsi mendesak"),
                t(
                  "Urgent analysis may be available for selected parameters and projects.",
                  "Analisis mendesak dapat tersedia untuk parameter dan proyek terpilih.",
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
                  "What we need to start analysis discussion",
                  "Informasi yang kami perlukan untuk memulai diskusi analisis",
                )}
              </h2>

              <p className="mt-6 text-[17px] leading-8 text-black/68 md:text-[19px] md:leading-9 md:text-lg">
                {t(
                  "To prepare accurate testing support, clients can share sample, parameter, timeline, and method-related information before requesting a proposal.",
                  "Untuk mempersiapkan dukungan pengujian yang akurat, klien dapat menyampaikan informasi terkait sampel, parameter, jadwal, dan metode sebelum mengajukan proposal.",
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

      <section id="contract-faq" className="bg-white py-20 md:py-28">
        <div className="pml-container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
              {t("Contract Analysis FAQ", "FAQ Analisis Kontrak")}
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

      <OtherServices current="contract-analysis" variant="three" />

      <section className="bg-white pb-24 md:pb-32">
        <div className="pml-container">
          <div className="relative overflow-hidden rounded-[36px] bg-[#f4fbf7] px-8 py-16 text-center text-black shadow-[0_28px_90px_rgba(0,0,0,0.12)] md:px-14 md:py-20">
            <Image
              src="/images/pml/services/contract-analysis-cta.png"
              alt=""
              fill
              className="object-cover opacity-46"
            />

            <div className="absolute inset-0 bg-white/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/74 to-[#039147]/18" />
            <div className="pml-hex-pattern absolute inset-0 opacity-[0.06]" />

            <div className="relative mx-auto max-w-3xl">
              <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#039147]/10 bg-white/90 shadow-lg backdrop-blur">
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
                  "Need contract analysis support?",
                  "Membutuhkan dukungan analisis kontrak?",
                )}
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-8 text-black/70 md:text-[19px] md:leading-9">
                {t(
                  "Share your sample and testing requirements with our team and we will help identify the right service scope, required information, and next steps.",
                  "Sampaikan kebutuhan sampel dan pengujian Anda kepada tim kami. Kami akan membantu menentukan ruang lingkup layanan, informasi yang diperlukan, dan langkah berikutnya.",
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
                  href="#contract-overview"
                  className="inline-flex items-center justify-center rounded-full border border-[#039147]/25 bg-white/85 px-8 py-4 text-base font-extrabold text-[#039147] shadow-sm backdrop-blur transition hover:bg-[#039147] hover:text-white"
                >
                  {t("Review Contract Analysis", "Tinjau Analisis Kontrak")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
