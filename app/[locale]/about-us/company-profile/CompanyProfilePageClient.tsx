"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { getLocaleFromPathname, localizeHref } from "@/i18n/client";

const corporateStatsEn = [
  {
    value: "20+",
    label: "Years Experience",
    desc: "Long-term CRO experience for local and international sponsors.",
  },
  {
    value: "6000+",
    label: "Completed Projects",
    desc: "Completed projects across clinical, analytical, and regulatory service areas.",
  },
  {
    value: "150+",
    label: "Ongoing Projects",
    desc: "Current project pipeline supported by PML teams.",
  },
  {
    value: "300+",
    label: "Sponsors",
    desc: "Trusted by local and international sponsors across regulated industries.",
  },
];

const industryCardsEn = [
  {
    title: "Pharmaceuticals",
    desc: "Drug development, BA/BE studies, analytical testing, and regulatory-ready documentation.",
    icon: "pharma",
  },
  {
    title: "Biotechnology",
    desc: "Scientific support for biologics, advanced therapy products, and technical development needs.",
    icon: "bio",
  },
  {
    title: "Medical Devices",
    desc: "Clinical, regulatory, and documentation support for device-related product pathways.",
    icon: "device",
  },
  {
    title: "Food & Beverage",
    desc: "Laboratory and quality support for selected food, beverage, and UMKM product categories.",
    icon: "food",
  },
  {
    title: "Cosmetics",
    desc: "Testing and compliance support for cosmetic product quality and safety requirements.",
    icon: "cosmetic",
  },
  {
    title: "Traditional Medicines",
    desc: "Regulatory and analytical support for herbal, traditional, and quasi-drug product needs.",
    icon: "traditional",
  },
];

const countries = [
  "United States of America",
  "South Korea",
  "Cambodia",
  "Hong Kong",
  "Indonesia",
  "Malaysia",
  "Maldives",
  "Mauritius",
  "Mongolia",
  "Myanmar",
  "Nigeria",
  "Philippines",
  "Singapore",
  "Sri Lanka",
  "Vietnam",
];

const landmarkByCountry: Record<string, { landmark: string; image: string }> = {
  Cambodia: {
    landmark: "",
    image:
      "https://images.unsplash.com/photo-1600431117492-7e5e1c7263c0?auto=format&fit=crop&w=1200&q=80",
  },
  "Hong Kong": {
    landmark: "",
    image:
      "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&w=1200&q=80",
  },
  Indonesia: {
    landmark: "",
    image:
      "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=1200&q=80",
  },
  Malaysia: {
    landmark: "",
    image:
      "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80",
  },
  Maldives: {
    landmark: "",
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
  },
  Mauritius: {
    landmark: "",
    image:
      "https://images.unsplash.com/photo-1589308454676-22fbe0b9f9cb?auto=format&fit=crop&w=1200&q=80",
  },
  Mongolia: {
    landmark: "",
    image:
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80",
  },
  Myanmar: {
    landmark: "",
    image:
      "https://images.unsplash.com/photo-1583499871880-de841d1ace2a?auto=format&fit=crop&w=1200&q=80",
  },
  Nigeria: {
    landmark: "",
    image:
      "https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&w=1200&q=80",
  },
  Philippines: {
    landmark: "",
    image:
      "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80",
  },
  Singapore: {
    landmark: "",
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
  },
  "Sri Lanka": {
    landmark: "",
    image:
      "https://images.unsplash.com/photo-1588255255721-5b7f8a1f1c8b?auto=format&fit=crop&w=1200&q=80",
  },
  Vietnam: {
    landmark: "",
    image:
      "https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?auto=format&fit=crop&w=1200&q=80",
  },
};

const countryDetails = countries.map((country) => {
  const landmark = landmarkByCountry[country] ?? {
    landmark: "",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  };

  return {
    name: country,
    landmark: landmark.landmark,
    title: `${country} regulatory acceptance`,
    desc: `PML’s study report acceptance experience in ${country} supports sponsor confidence for regulatory submission readiness across regional and international markets.`,
    image: landmark.image,
  };
});

const serviceEcosystemEn = [
  {
    title: "Contract Analysis",
    desc: "Analytical Development Center PML provides laboratory analysis support for product quality, safety, compliance, analytical method development, validation, and documentation needs.",
    href: "/services/contract-analysis",
  },
  {
    title: "BA/BE Study",
    desc: "Bioavailability and bioequivalence study support from clinical conduct and bioanalysis to regulatory-ready reporting.",
    href: "/services/babe-studies",
  },
  {
    title: "Clinical and Preclinical Trial",
    desc: "Clinical research support including study preparation, site coordination, monitoring, documentation, and project execution.",
    href: "/services/clinical-trial",
  },
  {
    title: "Regulatory Management",
    desc: "Regulatory strategy, submission preparation, product review, and post-market compliance support.",
    href: "/services/regulatory-consultation",
  },
];

const accreditationsEn = [
  {
    title: "Malaysian NPRA",
    desc: "PML is listed under the Bioequivalence Centre Compliance Programme of the National Pharmaceutical Regulatory Agency (NPRA), Ministry of Health Malaysia.",
  },
  {
    title: "Kemenkes (Ministry of Health of Republic of Indonesia)",
    desc: "Recommended by Kemenkes to conduct medical device studies.",
  },
  {
    title: "Plenary Accreditation",
    desc: "The highest level of certification awarded to primary clinics by Kemenkes. It proves that our clinic consistently complies with strict national health regulations.",
  },
  {
    title: "Testing Laboratory – SNI ISO/IEC 17025:2017",
    desc: "Demonstrates our commitment to technical competence, quality, and reliable testing results.",
  },
];

const contactItemsEn = [
  {
    title: "Office Address",
    value:
      "Gedung Indra Sentral Unit R-U, Jl. Let. Jend. Suprapto No. 60, Cempaka Putih, Jakarta Pusat 10520, Indonesia",
  },
  {
    title: "Phone",
    value: "(021) 4265310",
  },
  {
    title: "Email",
    value: "info@pharmametriclabs.com",
  },
  {
    title: "Website",
    value: "www.pharmametriclabs.com",
  },
];

const corporateStatsId = [
  {
    value: "20+",
    label: "Tahun Pengalaman",
    desc: "Pengalaman CRO jangka panjang untuk sponsor lokal dan internasional.",
  },
  {
    value: "6000+",
    label: "Proyek Selesai",
    desc: "Proyek yang telah diselesaikan dalam layanan klinis, analitik, dan regulasi.",
  },
  {
    value: "150+",
    label: "Proyek Berjalan",
    desc: "Portofolio proyek aktif yang didukung oleh tim PML.",
  },
  {
    value: "300+",
    label: "Sponsor",
    desc: "Dipercaya oleh sponsor lokal dan internasional di berbagai industri teregulasi.",
  },
];

const industryCardsId = [
  {
    title: "Farmasi",
    desc: "Pengembangan obat, studi BA/BE, pengujian analitik, dan dokumentasi yang siap untuk kebutuhan regulasi.",
    icon: "pharma",
  },
  {
    title: "Bioteknologi",
    desc: "Dukungan ilmiah untuk produk biologis, produk terapi lanjutan, dan kebutuhan pengembangan teknis.",
    icon: "bio",
  },
  {
    title: "Alat Kesehatan",
    desc: "Dukungan klinis, regulasi, dan dokumentasi untuk jalur pengembangan produk alat kesehatan.",
    icon: "device",
  },
  {
    title: "Makanan & Minuman",
    desc: "Dukungan laboratorium dan mutu untuk kategori produk makanan, minuman, dan UMKM tertentu.",
    icon: "food",
  },
  {
    title: "Kosmetik",
    desc: "Dukungan pengujian dan kepatuhan untuk persyaratan mutu serta keamanan produk kosmetik.",
    icon: "cosmetic",
  },
  {
    title: "Obat Tradisional",
    desc: "Dukungan regulasi dan analitik untuk produk herbal, obat tradisional, dan produk kuasi.",
    icon: "traditional",
  },
];

const serviceEcosystemId = [
  {
    title: "Analisis Kontrak",
    desc: "Analytical Development Center PML menyediakan dukungan analisis laboratorium untuk mutu produk, keamanan, kepatuhan, pengembangan metode analitik, validasi, dan dokumentasi.",
    href: "/services/contract-analysis",
  },
  {
    title: "Studi BA/BE",
    desc: "Dukungan studi bioavailabilitas dan bioekuivalensi dari pelaksanaan klinis dan bioanalisis hingga pelaporan yang siap untuk kebutuhan regulasi.",
    href: "/services/babe-studies",
  },
  {
    title: "Uji Klinis dan Praklinis",
    desc: "Dukungan penelitian klinis termasuk persiapan studi, koordinasi lokasi, monitoring, dokumentasi, dan pelaksanaan proyek.",
    href: "/services/clinical-trial",
  },
  {
    title: "Manajemen Regulasi",
    desc: "Strategi regulasi, persiapan pengajuan, peninjauan produk, dan dukungan kepatuhan pascapemasaran.",
    href: "/services/regulatory-consultation",
  },
];

const accreditationsId = [
  {
    title: "NPRA Malaysia",
    desc: "PML terdaftar dalam Bioequivalence Centre Compliance Programme dari National Pharmaceutical Regulatory Agency (NPRA), Kementerian Kesehatan Malaysia.",
  },
  {
    title: "Kementerian Kesehatan Republik Indonesia",
    desc: "Direkomendasikan oleh Kementerian Kesehatan untuk melaksanakan studi alat kesehatan.",
  },
  {
    title: "Akreditasi Paripurna",
    desc: "Tingkat sertifikasi tertinggi yang diberikan kepada klinik primer oleh Kementerian Kesehatan. Pengakuan ini membuktikan bahwa klinik kami konsisten mematuhi regulasi kesehatan nasional.",
  },
  {
    title: "Laboratorium Pengujian – SNI ISO/IEC 17025:2017",
    desc: "Menunjukkan komitmen kami terhadap kompetensi teknis, mutu, dan hasil pengujian yang andal.",
  },
];

const contactItemsId = [
  {
    title: "Alamat Kantor",
    value:
      "Gedung Indra Sentral Unit R-U, Jl. Let. Jend. Suprapto No. 60, Cempaka Putih, Jakarta Pusat 10520, Indonesia",
  },
  {
    title: "Telepon",
    value: "(021) 4265310",
  },
  {
    title: "Email",
    value: "info@pharmametriclabs.com",
  },
  {
    title: "Situs Web",
    value: "www.pharmametriclabs.com",
  },
];

const countryNamesId: Record<string, string> = {
  "United States of America": "Amerika Serikat",
  "South Korea": "Korea Selatan",
  Cambodia: "Kamboja",
  "Hong Kong": "Hong Kong",
  Indonesia: "Indonesia",
  Malaysia: "Malaysia",
  Maldives: "Maladewa",
  Mauritius: "Mauritius",
  Mongolia: "Mongolia",
  Myanmar: "Myanmar",
  Nigeria: "Nigeria",
  Philippines: "Filipina",
  Singapore: "Singapura",
  "Sri Lanka": "Sri Lanka",
  Vietnam: "Vietnam",
};

function IndustryIcon({ name }: { name: string }) {
  const common = "h-6 w-6";

  if (name === "pharma") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M8.5 14.5 14.5 8.5a3.2 3.2 0 0 1 4.5 4.5l-6 6a3.2 3.2 0 0 1-4.5-4.5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="m11.5 11.5 5 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M4 7.5h6M4 11h4M4 14.5h3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "bio") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M8 4c4 2 8 2 8 8s-4 6-8 8M16 4c-4 2-8 2-8 8s4 6 8 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M8.5 7h7M7.5 12h9M8.5 17h7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "device") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M14 4 20 10M13 5l-7.5 7.5a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L19 11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 19 3 21M9 9l6 6M16 3l5 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "food") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M7 3v8M11 3v8M7 7h4M9 11v10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M17 3v18M17 3c2 2 3 5 3 8 0 2-1 4-3 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "cosmetic") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M9 10h6l1 10H8l1-10Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M10 10V6a2 2 0 0 1 4 0v4M9 16h6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "traditional") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M5 12h14l-1.2 5.2A4 4 0 0 1 13.9 20H10a4 4 0 0 1-3.9-2.8L5 12Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M8 12c-.5-3 1.2-5.2 4-6M16 12c2.5-1.7 3.2-4 2.2-7M12 6c2.5.2 4.2 1.7 4.8 4.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M11.5 6.2c-1.8-2-4.2-2.4-6.2-.8 1.2 2.3 3.4 3.1 6.2.8ZM16.8 5c1.8-1.4 3.6-1.5 5.2-.2-.8 2-2.5 2.8-5.2.2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M8 20h8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12h16M12 4v16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AccreditationIcon({ name }: { name: string }) {
  const common = "h-6 w-6";

  if (name === "shield") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 3 19 6v5c0 4.6-2.9 8.2-7 10-4.1-1.8-7-5.4-7-10V6l7-3Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="m8.8 12 2.1 2.1 4.5-4.8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "lab") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M9 3h6M10 3v6l-5 8a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 17l-5-8V3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 15h8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "document") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M7 3h7l4 4v14H7V3Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M14 3v5h5M9 12h6M9 16h6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12h16M12 4v16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function CompanyProfilePage() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isIndonesian = locale === "id";

  const corporateStats = isIndonesian ? corporateStatsId : corporateStatsEn;
  const industryCards = isIndonesian ? industryCardsId : industryCardsEn;
  const serviceEcosystem = isIndonesian
    ? serviceEcosystemId
    : serviceEcosystemEn;
  const accreditations = isIndonesian ? accreditationsId : accreditationsEn;
  const contactItems = isIndonesian ? contactItemsId : contactItemsEn;

  const t = (english: string, indonesian: string) =>
    isIndonesian ? indonesian : english;

  const [activeCountry, setActiveCountry] = useState(countryDetails[0]);

  const openProposal = () => {
    window.dispatchEvent(new CustomEvent("open-proposal-modal"));
  };

  return (
    <main>
      <section className="relative overflow-hidden bg-black text-white">
        <Image
          src="/images/pml/services/contract-analysis-cta.png"
          alt=""
          fill
          priority
          className="object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-[#039147]/22" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/62 to-[#039147]/20" />
        <div className="pml-hex-pattern absolute inset-0 opacity-[0.075]" />

        <div className="pml-container relative py-20 md:py-32">
          <nav className="mb-10 flex flex-wrap items-center gap-2 text-sm font-bold text-black/58">
            <Link
              href={localizeHref("/", locale)}
              className="transition hover:text-[#039147]"
            >
              {t("Home", "Beranda")}
            </Link>
            <span>/</span>
            <Link
              href={localizeHref("/about-us", locale)}
              className="transition hover:text-[#039147]"
            >
              {t("About Us", "Tentang Kami")}
            </Link>
            <span>/</span>
            <span className="text-[#039147]">
              {t("Company Profile", "Profil Perusahaan")}
            </span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#039147]/20 bg-white/95 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#039147] shadow-sm backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[#039147]" />
                {t("Company Profile", "Profil Perusahaan")}
              </p>

              <h1 className="mt-6 max-w-5xl text-4xl font-black leading-[1.04] tracking-tight text-black md:text-6xl lg:text-[68px]">
                {t(
                  "Accelerating research with Pharma Metric Labs",
                  "Mempercepat penelitian bersama Pharma Metric Labs",
                )}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-black/68 md:text-lg">
                {t(
                  "Pharma Metric Labs is an Indonesia-based Contract Research Organization supporting pharmaceutical and healthcare development through BA/BE study, clinical research, contract analysis, and regulatory affairs consultation.",
                  "Pharma Metric Labs adalah Contract Research Organization berbasis di Indonesia yang mendukung pengembangan farmasi dan layanan kesehatan melalui studi BA/BE, penelitian klinis, analisis kontrak, dan konsultasi regulasi.",
                )}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#corporate-snapshot"
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-extrabold text-[#039147] shadow-xl"
                >
                  {t("View Profile", "Lihat Profil")}
                </a>

                <button
                  type="button"
                  onClick={openProposal}
                  className="inline-flex items-center justify-center rounded-full border border-[#039147]/25 bg-white/85 px-7 py-4 text-sm font-extrabold text-[#039147] shadow-sm backdrop-blur transition hover:bg-[#039147] hover:text-white"
                >
                  {t("Request a Proposal", "Ajukan Proposal")}
                </button>
              </div>
            </div>

            <div className="rounded-[30px] border border-[#039147]/15 bg-white/92 p-5 shadow-[0_24px_70px_rgba(3,145,71,0.10)] backdrop-blur-xl md:rounded-[34px] md:p-6">
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-black/58">
                {t("Corporate Snapshot", "Ringkasan Perusahaan")}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {corporateStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[22px] border border-[#039147]/10 bg-white p-4 shadow-sm"
                  >
                    <p className="text-3xl font-black text-[#039147]">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.12em] text-black/52">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="corporate-snapshot" className="bg-white py-16 md:py-28">
        <div className="pml-container">
          <div className="grid gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#039147] md:text-sm">
                {t("About PML", "Tentang PML")}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
                {t(
                  "High-quality research solutions aligned with international standards",
                  "Solusi penelitian berkualitas tinggi yang selaras dengan standar internasional",
                )}
              </h2>

              <div className="mt-5 space-y-4 text-base leading-8 text-black/65 md:mt-6 md:space-y-5 md:text-base md:leading-8">
                <p>
                  {t(
                    "Since its establishment in 2005, PML has delivered research services that support pharmaceutical and healthcare development. The company combines scientific discipline, quality-focused workflows, and integrated service capability for local and international clients.",
                    "Sejak didirikan pada tahun 2005, PML telah memberikan layanan penelitian yang mendukung pengembangan farmasi dan layanan kesehatan. Perusahaan memadukan disiplin ilmiah, alur kerja berorientasi mutu, dan kapabilitas layanan terintegrasi untuk klien lokal maupun internasional.",
                  )}
                </p>

                <p>
                  {t(
                    "PML has completed more than 6,000 projects and continues to manage an active project pipeline with sponsors worldwide. Its expertise spans pharmaceuticals, biotechnology, medical devices, food and beverage, cosmetics, and traditional medicines.",
                    "PML telah menyelesaikan lebih dari 6.000 proyek dan terus mengelola portofolio proyek aktif bersama sponsor dari berbagai negara. Keahliannya mencakup farmasi, bioteknologi, alat kesehatan, makanan dan minuman, kosmetik, serta obat tradisional.",
                  )}
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] bg-white p-2 shadow-[0_24px_70px_rgba(0,0,0,0.10)] md:rounded-[34px] md:p-3">
              <Image
                src="/images/pml/hero-lab-hexagon.png"
                alt="Pharma Metric Labs facility"
                width={900}
                height={675}
                className="aspect-[4/3] w-full rounded-[24px] object-cover md:rounded-[26px]"
              />
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 md:mt-14 md:grid-cols-4 md:gap-5">
            {corporateStats.map((item) => (
              <div
                key={item.label}
                className="rounded-[22px] border border-black/5 bg-[#f6faf7] p-4 shadow-sm md:rounded-[28px] md:p-7"
              >
                <p className="text-3xl font-black text-[#039147] md:text-5xl">
                  {item.value}
                </p>
                <p className="mt-2 text-xs font-black uppercase tracking-[0.10em] text-black/40">
                  {item.label}
                </p>
                <p className="mt-3 text-base font-bold leading-7 text-black/58 md:text-[17px] md:leading-8">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-16 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(3,145,71,0.08),transparent_30%),radial-gradient(circle_at_88%_70%,rgba(3,145,71,0.07),transparent_28%)]" />
        <div className="pml-hex-pattern absolute inset-0 opacity-[0.025]" />

        <div className="pml-container relative">
          <div className="mb-10 flex flex-col justify-between gap-6 md:mb-14 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#039147] md:text-sm">
                {t("Industries Served", "Industri yang Dilayani")}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.04em] text-black md:text-[52px]">
                {t(
                  "Supporting regulated industries with CRO and laboratory capability",
                  "Mendukung industri teregulasi melalui kapabilitas CRO dan laboratorium",
                )}
              </h2>
            </div>

            <p className="max-w-xl text-base leading-8 text-black/60 md:text-base md:leading-8">
              {t(
                "PML supports organizations that need research, testing, regulatory, and documentation support across science-driven product categories.",
                "PML mendukung organisasi yang membutuhkan layanan penelitian, pengujian, regulasi, dan dokumentasi pada berbagai kategori produk berbasis sains.",
              )}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {industryCards.map((industry) => (
              <article
                key={industry.title}
                className="group relative overflow-hidden rounded-[30px] border border-black/5 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#039147]/20 hover:shadow-[0_26px_80px_rgba(3,145,71,0.14)] md:p-7"
              >
                <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#eaf8f0] transition duration-500 group-hover:scale-125 group-hover:bg-[#039147]/12" />
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#039147] transition-all duration-500 group-hover:w-full" />

                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf8f0] text-[#039147] ring-1 ring-[#039147]/10 transition duration-300 group-hover:bg-[#039147] group-hover:text-white group-hover:shadow-[0_18px_44px_rgba(3,145,71,0.22)]">
                    <IndustryIcon name={industry.icon} />
                  </div>

                  <h3 className="mt-6 text-xl font-black leading-tight text-black transition group-hover:text-[#039147]">
                    {industry.title}
                  </h3>

                  <p className="mt-3 text-base font-medium leading-8 text-black/58">
                    {industry.desc}
                  </p>

                  <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#f4fbf7] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#039147] transition group-hover:bg-[#039147] group-hover:text-white">
                    {t("Industry fit", "Sesuai untuk industri")}
                    <span className="transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-28">
        <div className="pml-container">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#039147] md:text-sm">
              {t("Services Ecosystem", "Ekosistem Layanan")}
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
              {t(
                "Driving progress through integrated service excellence",
                "Mendorong kemajuan melalui keunggulan layanan terintegrasi",
              )}
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-black/65 md:mt-6 md:text-lg md:leading-9">
              {t(
                "PML connects clinical, laboratory, and regulatory capabilities to support project delivery from early discussion through execution and reporting.",
                "PML menghubungkan kapabilitas klinis, laboratorium, dan regulasi untuk mendukung pelaksanaan proyek sejak tahap diskusi awal hingga eksekusi dan pelaporan.",
              )}
            </p>
          </div>

          <div className="-mx-4 mt-10 flex snap-x gap-4 overflow-x-auto px-4 pb-5 md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
            {serviceEcosystem.map((service) => (
              <Link
                key={service.title}
                href={localizeHref(service.href, locale)}
                className="group w-[78vw] max-w-[320px] shrink-0 snap-start rounded-[26px] border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl md:w-auto md:max-w-none md:rounded-[28px] md:p-7"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf8f0] text-sm font-black text-[#039147] transition group-hover:bg-[#039147] group-hover:text-white">
                  ✓
                </div>

                <h3 className="text-xl font-black leading-tight text-black">
                  {service.title}
                </h3>

                <p className="mt-4 text-base leading-7 text-black/60">
                  {service.desc}
                </p>

                <span className="mt-6 inline-flex text-sm font-extrabold text-[#039147]">
                  {t("Learn more", "Pelajari lebih lanjut")} →
                </span>
              </Link>
            ))}
          </div>

          <p className="mt-1 text-center text-xs font-bold text-black/40 md:hidden">
            {t("Swipe to explore services", "Geser untuk melihat layanan")}
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#f4fbf7] py-16 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(3,145,71,0.10),transparent_28%),radial-gradient(circle_at_88%_20%,rgba(3,145,71,0.08),transparent_30%)]" />
        <div className="pml-hex-pattern absolute inset-0 opacity-[0.04]" />

        <div className="pml-container relative">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#039147] md:text-sm">
                {t("Regulatory Acceptance", "Penerimaan Regulasi")}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
                {t(
                  "Study reports accepted across multiple regulatory bodies",
                  "Laporan studi diterima oleh berbagai badan regulasi",
                )}
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-8 text-black/62 md:mt-6 md:text-lg md:leading-9">
                {t(
                  "PML’s study reports have supported submissions across multiple global regulatory bodies, strengthening its position as a trusted CRO partner for local and international sponsors.",
                  "Laporan studi PML telah mendukung pengajuan kepada berbagai badan regulasi global, sehingga memperkuat posisinya sebagai mitra CRO terpercaya bagi sponsor lokal dan internasional.",
                )}
              </p>

              <div className="mt-8 grid grid-cols-3 gap-3">
                {[
                  ["13", t("Accepted countries", "Negara penerima")],
                  ["300+", t("Sponsors", "Sponsor")],
                  ["190+", t("Validated methods", "Metode tervalidasi")],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-[22px] border border-black/5 bg-white p-4 shadow-sm md:p-5"
                  >
                    <p className="text-2xl font-black tracking-[-0.04em] text-[#039147] md:text-3xl">
                      {value}
                    </p>
                    <p className="mt-2 text-[10px] font-extrabold uppercase leading-4 tracking-[0.12em] text-black/50 md:text-xs">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <article className="relative overflow-hidden rounded-[34px] border border-[#039147]/10 bg-white p-4 shadow-[0_28px_90px_rgba(3,145,71,0.14)] md:rounded-[42px] md:p-5">
              <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
                <div className="rounded-[28px] bg-[#f4fbf7] p-5 md:p-6">
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#039147]">
                    {t("Accepted Countries", "Negara Penerima")}
                  </p>

                  <div className="mt-5 flex max-h-[310px] flex-wrap gap-2.5 overflow-y-auto pr-1">
                    {countryDetails.map((country) => {
                      const active = activeCountry.name === country.name;

                      return (
                        <button
                          key={country.name}
                          type="button"
                          onClick={() => setActiveCountry(country)}
                          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-extrabold shadow-sm transition duration-300 hover:-translate-y-0.5 ${
                            active
                              ? "border-[#039147] bg-[#039147] text-white shadow-[0_16px_34px_rgba(3,145,71,0.22)]"
                              : "border-black/5 bg-white text-[#039147] hover:border-[#039147]/25 hover:bg-[#eaf8f0]"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              active ? "bg-white" : "bg-[#039147]"
                            }`}
                          />
                          {isIndonesian
                            ? (countryNamesId[country.name] ?? country.name)
                            : country.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="group relative min-h-[430px] overflow-hidden rounded-[28px] bg-[#0a2c1a]">
                  <Image
                    src={activeCountry.image}
                    alt={activeCountry.name}
                    fill
                    unoptimized
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-[#039147]/8" />
                  <div className="pml-hex-pattern-light absolute inset-0 opacity-[0.07]" />

                  <div className="absolute bottom-0 left-0 right-0 p-7 md:p-9">
                    <h3 className="text-4xl font-black leading-tight tracking-[-0.04em] text-white drop-shadow-[0_12px_34px_rgba(0,0,0,0.48)] md:text-5xl">
                      {isIndonesian
                        ? (countryNamesId[activeCountry.name] ??
                          activeCountry.name)
                        : activeCountry.name}
                    </h3>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-16 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(3,145,71,0.08),transparent_30%),radial-gradient(circle_at_92%_70%,rgba(3,145,71,0.06),transparent_28%)]" />
        <div className="pml-hex-pattern absolute inset-0 opacity-[0.025]" />

        <div className="pml-container relative">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#039147] md:text-sm">
                {t("Accreditations & Recognitions", "Akreditasi & Pengakuan")}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.04em] text-black md:text-[52px]">
                {t(
                  "Quality credentials that strengthen clinical and laboratory trust",
                  "Kredensial mutu yang memperkuat kepercayaan terhadap layanan klinis dan laboratorium",
                )}
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-8 text-black/62 md:mt-6 md:text-lg md:leading-9">
                {t(
                  "PML’s accreditation and inspection records help demonstrate study readiness, laboratory reliability, and regulatory confidence across clinical and analytical project delivery.",
                  "Rekam jejak akreditasi dan inspeksi PML menunjukkan kesiapan studi, keandalan laboratorium, dan kepercayaan regulasi dalam pelaksanaan proyek klinis maupun analitik.",
                )}
              </p>
            </div>

            <div className="rounded-[34px] border border-[#039147]/10 bg-[#f4fbf7] p-6 shadow-[0_24px_70px_rgba(3,145,71,0.10)] md:p-8">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ["4", t("Credential areas", "Area kredensial")],
                  ["GCP / GLP", t("Quality framework", "Kerangka mutu")],
                  [
                    "Local + regional",
                    t("Acceptance signal", "Pengakuan lokal dan regional"),
                  ],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-[24px] border border-black/5 bg-white p-5 shadow-sm"
                  >
                    <p className="text-2xl font-black text-[#039147] md:text-3xl">
                      {value}
                    </p>
                    <p className="mt-2 text-xs font-extrabold uppercase leading-5 tracking-[0.12em] text-black/45">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-2">
            {accreditations.map((item, index) => (
              <article
                key={item.title}
                className="group relative overflow-hidden rounded-[30px] border border-black/5 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#039147]/20 hover:shadow-[0_26px_80px_rgba(3,145,71,0.14)] md:rounded-[34px] md:p-8"
              >
                <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#eaf8f0] transition duration-500 group-hover:scale-125 group-hover:bg-[#039147]/12" />
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#039147] transition-all duration-500 group-hover:w-full" />

                <div className="relative flex gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#eaf8f0] text-[#039147] ring-1 ring-[#039147]/10 transition duration-300 group-hover:bg-[#039147] group-hover:text-white group-hover:shadow-[0_18px_44px_rgba(3,145,71,0.22)]">
                    <AccreditationIcon name="shield" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#f4fbf7] px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#039147]">
                        0{index + 1}
                      </span>
                      <span className="rounded-full border border-[#039147]/12 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-black/45">
                        {t("Recognition", "Pengakuan")}
                      </span>
                    </div>

                    <h3 className="mt-4 text-xl font-black leading-tight text-black transition group-hover:text-[#039147] md:text-2xl">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-base font-medium leading-8 text-black/58">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-16 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(3,145,71,0.10),transparent_32%),radial-gradient(circle_at_88%_40%,rgba(3,145,71,0.08),transparent_30%)]" />
        <div className="pml-hex-pattern absolute inset-0 opacity-[0.035]" />

        <div className="pml-container relative">
          <div className="overflow-hidden rounded-[38px] border border-black/5 bg-[#f4fbf7] shadow-[0_28px_90px_rgba(3,145,71,0.10)] md:rounded-[48px]">
            <div className="grid lg:grid-cols-[1.02fr_0.98fr]">
              <div className="flex flex-col justify-center p-7 md:p-12 lg:p-14">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#039147]/15 bg-white px-4 py-2 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-[#039147]" />
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                    {t(
                      "Ministry of Health Project",
                      "Proyek Kementerian Kesehatan",
                    )}
                  </span>
                </div>

                <h2 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-[-0.04em] text-black md:text-[52px]">
                  {t(
                    "Chosen partner for Indonesia Ministry of Health BA/BE Project",
                    "Mitra terpilih untuk proyek BA/BE Kementerian Kesehatan Indonesia",
                  )}
                </h2>

                <p className="mt-5 max-w-2xl text-base leading-8 text-black/65 md:mt-6 md:text-lg md:leading-9">
                  {t(
                    "PML has been trusted to perform bioequivalence studies supporting the transition from imported to locally manufactured active pharmaceutical ingredients (APIs) for Azithromycin and Bisoprolol products.",
                    "PML dipercaya untuk melaksanakan studi bioekuivalensi yang mendukung peralihan bahan baku aktif farmasi dari impor menuju produksi lokal untuk produk Azithromycin dan Bisoprolol.",
                  )}
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    [
                      "BA/BE",
                      t("Bioequivalence study", "Studi bioekuivalensi"),
                    ],
                    ["APIs", "Azithromycin dan Bisoprolol"],
                    [
                      "Trusted",
                      t(
                        "Ministry-level project support",
                        "Dukungan proyek tingkat kementerian",
                      ),
                    ],
                  ].map(([title, desc]) => (
                    <div
                      key={title}
                      className="rounded-[22px] border border-black/5 bg-white p-4 shadow-sm"
                    >
                      <p className="text-lg font-black text-[#039147]">
                        {title}
                      </p>
                      <p className="mt-3 text-base font-bold leading-7 text-black/58">
                        {desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[520px] overflow-hidden bg-[#039147] p-6 md:p-10">
                <Image
                  src="/images/pml/services/contract-analysis-cta.png"
                  alt=""
                  fill
                  className="object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(3,145,71,0.92),rgba(1,74,43,0.92))]" />
                <div className="pml-hex-pattern-light absolute inset-0 opacity-[0.10]" />

                <div className="relative h-full min-h-[430px]">
                  <article className="absolute inset-0 flex animate-[pmlProjectSlideOne_12s_ease-in-out_infinite] flex-col justify-center rounded-[34px] border border-white/18 bg-white/14 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl md:p-9">
                    <div className="inline-flex w-fit rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#039147]">
                      {t("Case Highlight", "Sorotan Proyek")}
                    </div>

                    <h3 className="mt-7 text-6xl font-black leading-none tracking-[-0.06em] text-white md:text-7xl">
                      BA/BE
                    </h3>

                    <p className="mt-5 max-w-xl text-base font-semibold leading-8 text-white/86 md:text-lg md:leading-9">
                      Chosen partner for Indonesia Ministry of Health BA/BE
                      Project.
                    </p>

                    <div className="mt-7 rounded-[24px] bg-white p-6 text-black shadow-xl">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                        {t("Project Relevance", "Relevansi Proyek")}
                      </p>
                      <p className="mt-3 text-base font-bold leading-8 text-black/72">
                        {t(
                          "Bioequivalence studies supporting the transition from imported to locally manufactured APIs for Azithromycin and Bisoprolol products.",
                          "Studi bioekuivalensi yang mendukung peralihan bahan baku aktif farmasi dari impor menuju produksi lokal untuk produk Azithromycin dan Bisoprolol.",
                        )}
                      </p>
                    </div>
                  </article>

                  <article className="absolute inset-0 flex animate-[pmlProjectSlideTwo_12s_ease-in-out_infinite] flex-col justify-center rounded-[34px] border border-white/18 bg-white/14 p-7 opacity-0 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl md:p-9">
                    <div className="inline-flex w-fit rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#039147]">
                      Case Highlight
                    </div>

                    <h3 className="mt-7 text-4xl font-black leading-tight tracking-[-0.05em] text-white md:text-5xl">
                      {t(
                        "Clinical Trial and Regulatory Management",
                        "Uji Klinis dan Manajemen Regulasi",
                      )}
                    </h3>

                    <p className="mt-5 max-w-xl text-base font-semibold leading-8 text-white/86 md:text-lg md:leading-9">
                      {t(
                        "Reliable partner for an innovator nephrology product.",
                        "Mitra andal untuk produk inovatif di bidang nefrologi.",
                      )}
                    </p>

                    <div className="mt-7 rounded-[24px] bg-white p-6 text-black shadow-xl">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#039147]">
                        {t(
                          "CT & Regulatory Management",
                          "Uji Klinis & Manajemen Regulasi",
                        )}
                      </p>
                      <p className="mt-3 text-base font-bold leading-8 text-black/72">
                        {t(
                          "PML supported the successful clinical development and regulatory approval of an innovative nephrology product through end-to-end research and regulatory services, including clinical trial management, regulatory coordination, and product registration support for innovative therapies.",
                          "PML mendukung keberhasilan pengembangan klinis dan persetujuan regulasi produk nefrologi inovatif melalui layanan penelitian dan regulasi menyeluruh, termasuk manajemen uji klinis, koordinasi regulasi, dan dukungan registrasi produk untuk terapi inovatif.",
                        )}
                      </p>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes pmlProjectSlideOne {
              0%, 42% {
                opacity: 1;
                transform: translateX(0) scale(1);
              }
              50%, 92% {
                opacity: 0;
                transform: translateX(-16px) scale(0.98);
              }
              100% {
                opacity: 1;
                transform: translateX(0) scale(1);
              }
            }

            @keyframes pmlProjectSlideTwo {
              0%, 42% {
                opacity: 0;
                transform: translateX(16px) scale(0.98);
              }
              50%, 92% {
                opacity: 1;
                transform: translateX(0) scale(1);
              }
              100% {
                opacity: 0;
                transform: translateX(16px) scale(0.98);
              }
            }
          `}</style>
        </div>
      </section>

      <section className="bg-[#f6faf7] py-16 md:py-28">
        <div className="pml-container">
          <div className="grid gap-9 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-12">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#039147] md:text-sm">
                {t("Company Contact", "Kontak Perusahaan")}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
                {t(
                  "Reach Pharma Metric Labs for company, service, and project discussions",
                  "Hubungi Pharma Metric Labs untuk diskusi perusahaan, layanan, dan proyek",
                )}
              </h2>

              <p className="mt-5 text-base leading-8 text-black/65 md:mt-6 md:text-lg md:leading-9">
                {t(
                  "Use the official company contact information below for catalogue requests, project discussions, proposal inquiries, or service clarification.",
                  "Gunakan informasi kontak resmi perusahaan di bawah ini untuk permintaan katalog, diskusi proyek, pengajuan proposal, atau klarifikasi layanan.",
                )}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={localizeHref("/contact", locale)}
                  className="inline-flex items-center justify-center rounded-full bg-[#039147] px-7 py-4 text-sm font-extrabold text-white shadow-[0_18px_40px_rgba(3,145,71,0.22)] transition hover:-translate-y-0.5"
                >
                  {t("Open Contact Page", "Buka Halaman Kontak")}
                </Link>

                <a
                  href="mailto:info@pharmametriclabs.com"
                  className="inline-flex items-center justify-center rounded-full border border-[#039147]/20 bg-white px-7 py-4 text-sm font-extrabold text-[#039147] transition hover:bg-[#039147] hover:text-[#039147]"
                >
                  {t("Email PML", "Kirim Email ke PML")}
                </a>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 md:gap-4">
              {contactItems.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[22px] border border-black/5 bg-white p-5 shadow-sm md:rounded-[26px] md:p-6"
                >
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#039147]">
                    {item.title}
                  </p>
                  <p className="mt-3 text-base font-bold leading-8 text-black/70">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pb-20 md:pb-32">
        <div className="pml-container">
          <div className="relative overflow-hidden rounded-[30px] bg-[#f4fbf7] px-6 py-14 text-center text-black shadow-[0_28px_90px_rgba(0,0,0,0.12)] md:rounded-[36px] md:px-14 md:py-20">
            <Image
              src="/images/pml/cta-lab-background.png"
              alt=""
              fill
              className="object-cover opacity-42"
            />
            <div className="absolute inset-0 bg-[#039147]/22" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/94 via-white/78 to-[#039147]/16" />
            <div className="pml-hex-pattern-light absolute inset-0 opacity-[0.10]" />

            <div className="relative mx-auto max-w-3xl">
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-black/64">
                {t("Company Materials", "Materi Perusahaan")}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
                {t(
                  "Need the latest official company profile or service catalogue?",
                  "Membutuhkan profil perusahaan atau katalog layanan resmi terbaru?",
                )}
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-black/68">
                {t(
                  "Explore PML catalogue materials or contact the team to request the latest official documents.",
                  "Jelajahi materi katalog PML atau hubungi tim kami untuk meminta dokumen resmi terbaru.",
                )}
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href={localizeHref("/about-us/catalogue", locale)}
                  className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-extrabold text-[#039147] shadow-xl transition hover:-translate-y-0.5"
                >
                  {t("View Catalogue", "Lihat Katalog")}
                </Link>

                <button
                  type="button"
                  onClick={openProposal}
                  className="inline-flex items-center justify-center rounded-full border border-[#039147]/25 bg-white/85 px-8 py-4 text-sm font-extrabold text-[#039147] shadow-sm backdrop-blur transition hover:bg-[#039147] hover:text-white"
                >
                  {t("Request Proposal", "Ajukan Proposal")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
