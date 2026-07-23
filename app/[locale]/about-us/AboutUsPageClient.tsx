"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";

import OtherServices from "@/components/OtherServices";
import { getLocaleFromPathname, localizeHref } from "@/i18n/client";

const heroImage = "/images/pml/services/clinical-trial-cta.png";
const companyImage = "/images/pml/services/contract-analysis-cta.png";

const timelineEn = [
  {
    year: "2005",
    title: "PML established",
    text: "Pharma Metric Labs was established with a clear purpose: to become a reliable scientific partner for pharmaceutical development in Indonesia. From the beginning, PML focused on building a disciplined CRO foundation supported by clinical, analytical, and documentation capabilities.",
  },
  {
    year: "2007",
    title: "First 15 local BE projects completed",
    text: "PML completed its first 15 bioequivalence projects for local sponsors, marking an important early achievement in the company’s CRO journey. This milestone strengthened PML’s experience in supporting local pharmaceutical companies with study execution, bioanalysis, and regulatory-ready reporting.",
  },
  {
    year: "2010",
    title: "First international sponsor project",
    text: "PML expanded its project experience by supporting its first international sponsor. This milestone reflected growing trust from overseas partners and positioned PML as an Indonesia-based CRO capable of supporting both local and international pharmaceutical development needs.",
  },
  {
    year: "2013",
    title: "Foreign BE Centre accreditation from NPRA Malaysia",
    text: "PML received Foreign Bioequivalence Centre accreditation from the National Pharmaceutical Regulatory Agency Malaysia. This accreditation became an important trust signal for international sponsors and demonstrated PML’s commitment to accepted standards, reliable study conduct, and credible bioequivalence reporting.",
  },
  {
    year: "2020",
    title: "Analytical and bioanalytical laboratory expansion",
    text: "PML strengthened its analytical and bioanalytical laboratory operations through a clearer facility separation. Analytical laboratory activities were expanded to KBIC East Jakarta, creating a more focused structure for laboratory testing, bioanalysis workflows, and broader testing capacity.",
  },
  {
    year: "2024",
    title: "Plenary accreditation from the Ministry of Health",
    text: "PML received Plenary Accreditation from the Ministry of Health of the Republic of Indonesia. This recognition strengthened PML’s credibility as a clinical and laboratory service provider and reinforced the company’s commitment to quality standards, accountable processes, and reliable study operations.",
  },
  {
    year: "2026",
    title: "New facility and expanded BA/BE clinical capacity",
    text: "PML relocated to a new facility and expanded its BA/BE clinical site capacity from 40 beds to 70 beds. This milestone strengthens PML's ability to support larger studies, improve clinical operation flow, and deliver more efficient study execution.",
  },
];

const valuesEn = [
  {
    title: "Scientific excellence",
    text: "Delivering services through strong experience, scientific discipline, and continuous innovation.",
    icon: "science",
  },
  {
    title: "Quality and compliance",
    text: "Maintaining rigorous standards to support reliable outcomes and accountable documentation.",
    icon: "shield",
  },
  {
    title: "Customer-oriented collaboration",
    text: "Working closely with sponsors to understand goals, timelines, and project requirements.",
    icon: "network",
  },
  {
    title: "Global readiness",
    text: "Supporting local and international clients with credible CRO services and accepted study outputs.",
    icon: "global",
  },
];

const certifications = [
  {
    title: "SNI ISO/IEC 17025:2017",
    image: "/images/pml/certificates/iso-17025.png",
  },
  {
    title:
      "Plenary Accreditation from the Ministry of Health of the Republic of Indonesia",
    image: "/images/pml/certificates/akreditasi-paripurna.png",
  },
  {
    title:
      "Foreign Bioequivalence Centre Accreditation from the National Pharmaceutical Regulatory Agency Malaysia",
    image: "/images/pml/certificates/npra.jpeg",
  },
];

const factsEn = [
  { number: 20, suffix: "+", label: "years experience" },
  { number: 6000, suffix: "+", label: "completed projects" },
  { number: 300, suffix: "+", label: "sponsors" },
  { number: 190, suffix: "+", label: "validated bioanalytical method" },
];

const timelineId = [
  {
    year: "2005",
    title: "PML didirikan",
    text: "Pharma Metric Labs didirikan dengan tujuan yang jelas: menjadi mitra ilmiah yang andal bagi pengembangan farmasi di Indonesia. Sejak awal, PML berfokus membangun fondasi CRO yang disiplin dengan dukungan kapabilitas klinis, analitik, dan dokumentasi.",
  },
  {
    year: "2007",
    title: "Menyelesaikan 15 proyek BE lokal pertama",
    text: "PML menyelesaikan 15 proyek bioekuivalensi pertama untuk sponsor lokal. Pencapaian ini memperkuat pengalaman PML dalam mendukung perusahaan farmasi Indonesia melalui pelaksanaan studi, bioanalisis, dan pelaporan yang siap untuk kebutuhan regulasi.",
  },
  {
    year: "2010",
    title: "Proyek sponsor internasional pertama",
    text: "PML memperluas pengalaman proyek dengan mendukung sponsor internasional pertamanya. Pencapaian ini mencerminkan meningkatnya kepercayaan mitra luar negeri dan memperkuat posisi PML sebagai CRO berbasis di Indonesia.",
  },
  {
    year: "2013",
    title: "Akreditasi Foreign BE Centre dari NPRA Malaysia",
    text: "PML memperoleh akreditasi Foreign Bioequivalence Centre dari National Pharmaceutical Regulatory Agency Malaysia. Akreditasi ini menjadi bukti kepercayaan bagi sponsor internasional dan menunjukkan komitmen PML terhadap standar yang diakui.",
  },
  {
    year: "2020",
    title: "Ekspansi laboratorium analitik dan bioanalitik",
    text: "PML memperkuat operasional laboratorium analitik dan bioanalitik melalui pemisahan fasilitas yang lebih jelas. Aktivitas laboratorium analitik dikembangkan di KBIC Jakarta Timur untuk mendukung pengujian, bioanalisis, dan kapasitas laboratorium yang lebih luas.",
  },
  {
    year: "2024",
    title: "Akreditasi Paripurna dari Kementerian Kesehatan",
    text: "PML memperoleh Akreditasi Paripurna dari Kementerian Kesehatan Republik Indonesia. Pengakuan ini memperkuat kredibilitas PML sebagai penyedia layanan klinis dan laboratorium yang berkomitmen terhadap mutu dan proses yang akuntabel.",
  },
  {
    year: "2026",
    title: "Fasilitas baru dan peningkatan kapasitas klinis BA/BE",
    text: "PML berpindah ke fasilitas baru dan meningkatkan kapasitas lokasi klinis BA/BE dari 40 menjadi 70 tempat tidur. Peningkatan ini memperkuat kemampuan PML dalam mendukung studi yang lebih besar dan pelaksanaan klinis yang lebih efisien.",
  },
];

const valuesId = [
  {
    title: "Keunggulan ilmiah",
    text: "Memberikan layanan melalui pengalaman yang kuat, disiplin ilmiah, dan inovasi berkelanjutan.",
    icon: "science",
  },
  {
    title: "Kualitas dan kepatuhan",
    text: "Menjaga standar yang ketat untuk mendukung hasil yang andal dan dokumentasi yang akuntabel.",
    icon: "shield",
  },
  {
    title: "Kolaborasi berorientasi pelanggan",
    text: "Bekerja erat dengan sponsor untuk memahami tujuan, waktu, dan kebutuhan proyek.",
    icon: "network",
  },
  {
    title: "Kesiapan global",
    text: "Mendukung klien lokal dan internasional melalui layanan CRO yang kredibel dan hasil studi yang dapat diterima.",
    icon: "global",
  },
];

const factsId = [
  { number: 20, suffix: "+", label: "tahun pengalaman" },
  { number: 6000, suffix: "+", label: "proyek selesai" },
  { number: 300, suffix: "+", label: "sponsor" },
  { number: 190, suffix: "+", label: "metode bioanalitik tervalidasi" },
];

function formatNumber(value: number, locale: "en" | "id") {
  return new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US").format(
    value,
  );
}

function CountUpNumber({
  target,
  suffix,
  locale,
}: {
  target: number;
  suffix: string;
  locale: "en" | "id";
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element || hasAnimated) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setHasAnimated(true);

        const duration = 1400;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = 1 - Math.pow(1 - progress, 3);
          const currentValue = Math.floor(easedProgress * target);

          setCount(currentValue);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setCount(target);
          }
        };

        requestAnimationFrame(animate);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasAnimated, target]);

  return (
    <p ref={ref} className="text-3xl font-black text-[#039147] md:text-5xl">
      {formatNumber(count, locale)}
      {suffix}
    </p>
  );
}

function Icon({ name }: { name: string }) {
  if (name === "science") {
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

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      <path
        d="M4 12H20M12 4C14 6.2 15 8.8 15 12C15 15.2 14 17.8 12 20M12 4C10 6.2 9 8.8 9 12C9 15.2 10 17.8 12 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CertIcon() {
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

void CertIcon;

function HeroButton({
  children,
  onClick,
  href,
  variant = "white",
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "white" | "outline";
}) {
  const className =
    variant === "white"
      ? "inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-base font-extrabold text-[#039147] shadow-[0_18px_40px_rgba(0,0,0,0.22)]"
      : "inline-flex items-center justify-center rounded-full border border-[#039147]/25 bg-white/85 px-7 py-4 text-base font-extrabold text-[#039147] shadow-sm backdrop-blur transition hover:bg-[#039147] hover:text-white";

  if (href) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}

function AboutSectionIcon({ name }: { name: string }) {
  const common = "currentColor";

  if (name === "clinical") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M8 4H16V7H8V4Z"
          stroke={common}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M6 7H18V20H6V7Z"
          stroke={common}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M9 13H15M12 10V16"
          stroke={common}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "lab") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 3H15"
          stroke={common}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M10 3V8L6 17.5C5.4 19 6.5 20.5 8.2 20.5H15.8C17.5 20.5 18.6 19 18 17.5L14 8V3"
          stroke={common}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 16H15.5"
          stroke={common}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "regulatory") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3L19 6V11C19 15.8 16 19.2 12 21C8 19.2 5 15.8 5 11V6L12 3Z"
          stroke={common}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M9 12L11 14L15.5 9.5"
          stroke={common}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "project") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="6" cy="7" r="2.2" stroke={common} strokeWidth="2" />
        <circle cx="18" cy="7" r="2.2" stroke={common} strokeWidth="2" />
        <circle cx="12" cy="17" r="2.2" stroke={common} strokeWidth="2" />
        <path
          d="M8 8.5L10.8 15M16 8.5L13.2 15"
          stroke={common}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "quality") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M7 3H14L18 7V21H7V3Z"
          stroke={common}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M14 3V7H18"
          stroke={common}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 14L11.3 15.8L15 12"
          stroke={common}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "communication") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 6.5C5 5.1 6.1 4 7.5 4H16.5C17.9 4 19 5.1 19 6.5V13.5C19 14.9 17.9 16 16.5 16H10L6 20V16.2C5.4 15.8 5 15.2 5 14.5V6.5Z"
          stroke={common}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 8.5H15.5M8.5 12H13"
          stroke={common}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "pharma") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 20V8L10 5L15 8V20"
          stroke={common}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M15 20V10H20V20"
          stroke={common}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M8 12H12M8 16H12M17 14H18"
          stroke={common}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "globe") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8.5" stroke={common} strokeWidth="2" />
        <path
          d="M3.5 12H20.5"
          stroke={common}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M12 3.5C14.2 6 15.2 8.8 15.2 12C15.2 15.2 14.2 18 12 20.5C9.8 18 8.8 15.2 8.8 12C8.8 8.8 9.8 6 12 3.5Z"
          stroke={common}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "hospital") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 20V6H19V20"
          stroke={common}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M9 20V15H15V20"
          stroke={common}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M12 8V13M9.5 10.5H14.5"
          stroke={common}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "research") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="9" r="3" stroke={common} strokeWidth="2" />
        <path
          d="M11.2 11.2L18.5 18.5"
          stroke={common}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M15 18.5H20"
          stroke={common}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M18.5 15V20"
          stroke={common}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "approval") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M7 3H14L18 7V21H7V3Z"
          stroke={common}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M14 3V7H18"
          stroke={common}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 15L11.5 17L15.5 12.5"
          stroke={common}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12L10 17L20 7"
        stroke={common}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AboutUsPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isIndonesian = locale === "id";

  const timeline = isIndonesian ? timelineId : timelineEn;
  const values = isIndonesian ? valuesId : valuesEn;
  const facts = isIndonesian ? factsId : factsEn;

  const t = (english: string, indonesian: string) =>
    isIndonesian ? indonesian : english;

  const [activeTimeline, setActiveTimeline] = useState(0);

  const openProposal = () => {
    window.dispatchEvent(new CustomEvent("open-proposal-modal"));
  };

  const goTimeline = (nextIndex: number) => {
    setActiveTimeline((nextIndex + timeline.length) % timeline.length);
  };

  const activeItem = timeline[activeTimeline];

  return (
    <main>
      <section className="relative overflow-hidden bg-black text-white">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-[#039147]/18" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/60 to-[#039147]/18" />
        <div className="pml-hex-pattern absolute inset-0 opacity-[0.075]" />

        <div className="pml-container relative py-20 md:py-32">
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
            <span className="text-[#039147]">
              {t("About Us", "Tentang Kami")}
            </span>
          </nav>

          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#039147]/20 bg-white/95 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#039147] shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#039147]" />
              {t("About Pharma Metric Labs", "Tentang Pharma Metric Labs")}
            </p>

            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.04] tracking-tight text-black md:text-6xl lg:text-[68px]">
              {t(
                "Indonesia-based CRO partner built for scientific excellence",
                "Mitra CRO Indonesia yang dibangun untuk keunggulan ilmiah",
              )}
            </h1>

            <p className="mt-6 max-w-2xl text-[17px] leading-8 text-black/70 md:text-[19px] md:leading-9 md:text-lg">
              {t(
                "Pharma Metric Labs supports pharmaceutical and healthcare companies with BA/BE study, clinical trial, contract analysis, and regulatory management.",
                "Pharma Metric Labs mendukung perusahaan farmasi dan layanan kesehatan melalui studi BA/BE, uji klinis, analisis kontrak, dan manajemen regulasi.",
              )}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <HeroButton href="#company-profile">
                {t("Learn About PML", "Pelajari PML")}
              </HeroButton>
              <HeroButton onClick={openProposal} variant="outline">
                {t("Request a Proposal", "Ajukan Proposal")}
              </HeroButton>
            </div>
          </div>
        </div>
      </section>

      <section id="company-profile" className="bg-white py-16 md:py-28">
        <div className="pml-container">
          <div className="grid gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12">
            <div className="overflow-hidden rounded-[28px] bg-white p-2 shadow-[0_24px_70px_rgba(0,0,0,0.10)] md:rounded-[34px] md:p-3">
              <Image
                src={companyImage}
                alt="Pharma Metric Labs scientific team and laboratory"
                width={900}
                height={675}
                className="aspect-[4/3] w-full rounded-[26px] object-cover"
              />
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#039147] md:text-sm">
                {t("Company Overview", "Profil Perusahaan")}
              </p>

              <h2 className="mt-4 text-2xl font-black leading-tight text-black md:text-5xl">
                {t(
                  "Scientific CRO support for reliable pharmaceutical development",
                  "Dukungan CRO ilmiah untuk pengembangan farmasi yang andal",
                )}
              </h2>

              <div className="mt-5 space-y-4 text-[17px] leading-8 text-black/68 md:text-[19px] md:leading-9 md:mt-6 md:space-y-5 md:text-base md:leading-8">
                <p>
                  {t(
                    "Pharma Metric Labs is an Indonesia-based Contract Research Organization supporting sponsors through integrated clinical, analytical, and regulatory services. PML helps companies move from study planning to reliable execution, accountable documentation, and regulatory-ready outcomes.",
                    "Pharma Metric Labs adalah Contract Research Organization berbasis di Indonesia yang mendukung sponsor melalui layanan klinis, analitik, dan regulasi terintegrasi. PML membantu perusahaan bergerak dari perencanaan studi menuju pelaksanaan yang andal, dokumentasi yang akuntabel, dan hasil yang siap untuk kebutuhan regulasi.",
                  )}
                </p>

                <p>
                  {t(
                    "With experience across bioequivalence studies, clinical trial, contract analysis, and regulatory management, PML combines scientific discipline, quality standards, multidisciplinary expertise, and responsive project collaboration.",
                    "Dengan pengalaman dalam studi bioekuivalensi, uji klinis, analisis kontrak, dan manajemen regulasi, PML memadukan disiplin ilmiah, standar mutu, keahlian multidisiplin, dan kolaborasi proyek yang responsif.",
                  )}
                </p>
              </div>

              <div className="mt-7 rounded-[24px] bg-[#039147] p-6 text-white shadow-[0_24px_60px_rgba(3,145,71,0.22)] md:mt-8 md:rounded-[28px] md:p-7">
                <h3 className="text-2xl font-black">
                  {t(
                    "Innovation, powered by scientific excellence.",
                    "Inovasi yang didukung oleh keunggulan ilmiah.",
                  )}
                </h3>
                <p className="mt-4 text-[17px] leading-8 text-white/86">
                  {t(
                    "The brand essence behind Pharma Metric Labs’ renewed identity and digital direction.",
                    "Esensi merek yang mendasari identitas baru dan arah digital Pharma Metric Labs.",
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 md:mt-14 md:grid-cols-4 md:gap-5">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-[22px] border border-black/5 bg-white p-4 text-center shadow-sm md:rounded-[28px] md:p-7"
              >
                <CountUpNumber
                  target={fact.number}
                  suffix={fact.suffix}
                  locale={locale}
                />
                <p className="mt-2 text-sm font-extrabold leading-6 text-[#039147]">
                  {fact.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="experts-team" className="bg-[#f6faf7] py-16 md:py-28">
        <div className="pml-container">
          <div className="grid gap-9 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-12">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#039147] md:text-sm">
                Experts & Team
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
                Multidisciplinary expertise across clinical, laboratory,
                regulatory, and project workflows
              </h2>

              <p className="mt-5 text-[17px] leading-8 text-black/68 md:text-[19px] md:leading-9 md:mt-6 md:text-lg md:leading-9">
                PML is supported by professionals with experience across
                clinical study operations, bioanalysis, laboratory testing,
                regulatory affairs, documentation, and project coordination.
                This multidisciplinary structure helps sponsors move from
                inquiry to execution with clearer communication and stronger
                technical support.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {(isIndonesian
                ? [
                    {
                      title: "Tim operasional klinis",
                      desc: "Pelaksanaan studi, koordinasi lokasi, dan dukungan alur kerja klinis.",
                      icon: "clinical",
                    },
                    {
                      title: "Tim laboratorium bioanalitik",
                      desc: "Kapabilitas laboratorium untuk analisis yang andal dan dokumentasi ilmiah.",
                      icon: "lab",
                    },
                    {
                      title: "Dukungan urusan regulasi",
                      desc: "Kesiapan pengajuan, keselarasan kepatuhan, dan koordinasi regulasi.",
                      icon: "regulatory",
                    },
                    {
                      title: "Tim koordinasi proyek",
                      desc: "Koordinasi lintas fungsi untuk menjaga pelaksanaan proyek tetap jelas dan responsif.",
                      icon: "project",
                    },
                    {
                      title: "Alur kualitas dan dokumentasi",
                      desc: "Standar dokumentasi yang dapat ditelusuri untuk hasil proyek yang akuntabel.",
                      icon: "quality",
                    },
                    {
                      title: "Dukungan komunikasi sponsor",
                      desc: "Komunikasi yang jelas antara sponsor, tim internal, dan pemangku kepentingan.",
                      icon: "communication",
                    },
                  ]
                : [
                    {
                      title: "Clinical operations team",
                      desc: "Study execution, site coordination, and clinical workflow support.",
                      icon: "clinical",
                    },
                    {
                      title: "Bioanalytical laboratory team",
                      desc: "Laboratory capability for reliable analysis and scientific documentation.",
                      icon: "lab",
                    },
                    {
                      title: "Regulatory affairs support",
                      desc: "Submission readiness, compliance alignment, and regulatory coordination.",
                      icon: "regulatory",
                    },
                    {
                      title: "Project coordination team",
                      desc: "Cross-functional coordination to keep project delivery clear and responsive.",
                      icon: "project",
                    },
                    {
                      title: "Quality and documentation workflow",
                      desc: "Traceable documentation standards for accountable project outcomes.",
                      icon: "quality",
                    },
                    {
                      title: "Sponsor communication support",
                      desc: "Clear communication between sponsors, internal teams, and stakeholders.",
                      icon: "communication",
                    },
                  ]
              ).map((item) => (
                <article
                  key={item.title}
                  className="group relative overflow-hidden rounded-[28px] border border-black/5 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#039147]/20 hover:shadow-[0_24px_70px_rgba(3,145,71,0.12)]"
                >
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#eaf8f0] transition duration-500 group-hover:scale-125 group-hover:bg-[#039147]/12" />

                  <div className="relative flex items-start gap-4">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#eaf8f0] text-[#039147] ring-1 ring-[#039147]/10 transition duration-300 group-hover:bg-[#039147] group-hover:text-white group-hover:shadow-[0_18px_44px_rgba(3,145,71,0.22)]">
                      <AboutSectionIcon name={item.icon} />
                    </span>

                    <div>
                      <h3 className="text-xl font-black leading-tight tracking-[-0.02em] text-black">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-base font-medium leading-7 text-black/62">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#eaf8f0] py-16 md:py-28">
        <div className="pml-container">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
              {t("History / Milestones", "Sejarah / Pencapaian")}
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
              {t(
                "A growing CRO journey built through experience and accreditation",
                "Perjalanan CRO yang terus berkembang melalui pengalaman dan akreditasi",
              )}
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-[17px] leading-8 text-black/68 md:text-[19px] md:leading-9 md:text-lg">
              {t(
                "From early bioequivalence projects to expanded facilities and national accreditation, PML continues to strengthen its capability for local and international sponsors.",
                "Dari proyek bioekuivalensi awal hingga perluasan fasilitas dan akreditasi nasional, PML terus memperkuat kapabilitasnya bagi sponsor lokal dan internasional.",
              )}
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-6xl md:mt-14">
            <div className="relative">
              <div className="absolute left-0 right-0 top-[35px] hidden h-px bg-black/10 lg:block" />

              <div className="grid auto-cols-[150px] grid-flow-col gap-4 overflow-x-auto pb-4 md:auto-cols-[170px] lg:auto-cols-fr lg:grid-flow-row lg:grid-cols-7 lg:overflow-visible lg:pb-0">
                {timeline.map((item, index) => {
                  const active = index === activeTimeline;

                  return (
                    <button
                      key={item.year}
                      type="button"
                      onClick={() => setActiveTimeline(index)}
                      className={`group relative flex min-h-[118px] flex-col items-center justify-center rounded-[22px] border px-4 py-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                        active
                          ? "border-[#039147]/25 bg-[#eaf8f0]"
                          : "border-black/5 bg-white"
                      }`}
                      aria-label={`${t(
                        "Show milestone",
                        "Tampilkan pencapaian",
                      )} ${item.year}`}
                    >
                      <span
                        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#eaf8f0] transition ${
                          active
                            ? "bg-[#039147] shadow-[0_0_0_8px_rgba(3,145,71,0.10)]"
                            : "bg-black/15"
                        }`}
                      />

                      <span
                        className={`mt-4 text-lg font-black transition ${
                          active ? "text-[#039147]" : "text-black/45"
                        }`}
                      >
                        {item.year}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:mt-12 lg:grid-cols-[1fr_0.75fr] lg:items-center lg:gap-10">
              <div className="relative">
                <article>
                  <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-sm md:rounded-[34px] md:p-10">
                    <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
                      {activeItem.year}
                    </p>

                    <h3 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
                      {activeItem.title}
                    </h3>

                    <p className="mt-5 text-[17px] leading-8 text-black/68 md:text-[19px] md:leading-9 md:mt-6 md:text-lg md:leading-9">
                      {activeItem.text}
                    </p>
                  </div>
                </article>
              </div>

              <div className="relative overflow-hidden rounded-[28px] bg-white p-6 text-center shadow-sm md:rounded-[34px] md:p-12">
                <div className="pml-hex-pattern absolute inset-0 opacity-[0.06]" />

                <div className="relative">
                  <p className="text-[58px] font-black leading-none text-[#039147] md:text-[110px]">
                    {activeItem.year}
                  </p>

                  <p className="mt-4 text-sm font-extrabold uppercase tracking-[0.18em] text-black/40">
                    {t("PML Milestone", "Pencapaian PML")}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => goTimeline(activeTimeline - 1)}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white text-xl font-black text-black/45 transition hover:border-[#039147] hover:text-[#039147]"
                aria-label={t("Previous milestone", "Pencapaian sebelumnya")}
              >
                ←
              </button>

              <button
                type="button"
                onClick={() => goTimeline(activeTimeline + 1)}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white text-lg font-black text-[#039147] transition hover:bg-[#039147] hover:text-[#039147]"
                aria-label={t("Next milestone", "Pencapaian berikutnya")}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-28">
        <div className="pml-container">
          <div className="grid gap-8 lg:grid-cols-2">
            <article className="rounded-[28px] border border-black/5 bg-white p-6 shadow-sm md:rounded-[34px] md:p-10">
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
                {t("Vision", "Visi")}
              </p>

              <h2 className="mt-4 text-3xl font-black leading-tight text-black">
                {t(
                  "To become a world-class Contract Research Organization",
                  "Menjadi Contract Research Organization berkelas dunia",
                )}
              </h2>

              <p className="mt-5 text-[17px] leading-8 text-black/68 md:text-[19px] md:leading-9">
                {t(
                  "PML aims to be recognized by local and international sponsors as a reliable CRO partner for pharmaceutical and healthcare development.",
                  "PML bertujuan untuk diakui oleh sponsor lokal dan internasional sebagai mitra CRO yang andal bagi pengembangan farmasi dan layanan kesehatan.",
                )}
              </p>
            </article>

            <article className="rounded-[28px] border border-[#039147]/20 bg-[#039147] p-6 text-white shadow-[0_24px_70px_rgba(3,145,71,0.20)] md:rounded-[34px] md:p-10">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/80 md:text-sm">
                {t("Mission", "Misi")}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.035em] text-white">
                {t(
                  "To ensure good quality healthcare products for the community",
                  "Memastikan tersedianya produk kesehatan berkualitas bagi masyarakat",
                )}
              </h2>

              <p className="mt-5 text-[17px] leading-8 text-white/86 md:text-lg md:leading-9">
                {t(
                  "PML supports this mission through scientific services, reliable data, quality-focused workflows, and collaborative project execution.",
                  "PML mendukung misi ini melalui layanan ilmiah, data yang andal, alur kerja berorientasi mutu, dan pelaksanaan proyek secara kolaboratif.",
                )}
              </p>
            </article>
          </div>

          <div className="mt-12">
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
                {t("Core Values", "Nilai Utama")}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
                {t(
                  "Built on quality, collaboration, and scientific rigor",
                  "Dibangun atas kualitas, kolaborasi, dan ketelitian ilmiah",
                )}
              </h2>
            </div>

            <div className="-mx-4 mt-10 flex snap-x gap-4 overflow-x-auto px-4 pb-5 md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
              {values.map((value) => (
                <article
                  key={value.title}
                  className="group w-[78vw] max-w-[320px] shrink-0 snap-start rounded-[26px] border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl md:w-auto md:max-w-none md:rounded-[28px] md:p-7"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#039147]/10 bg-[#eaf8f0] text-[#039147] transition group-hover:scale-105">
                    <Icon name={value.icon} />
                  </div>

                  <h3 className="text-2xl font-black leading-tight tracking-[-0.025em] text-black">
                    {value.title}
                  </h3>

                  <p className="mt-4 text-[17px] leading-8 text-black/62">
                    {value.text}
                  </p>
                </article>
              ))}
            </div>

            <p className="mt-1 text-center text-xs font-bold text-black/40 md:hidden">
              {t("Swipe to explore values", "Geser untuk melihat nilai utama")}
            </p>
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
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
              {t("Certifications / Compliance", "Sertifikasi / Kepatuhan")}
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
              {t(
                "Accredited support for reliable study and laboratory services",
                "Dukungan terakreditasi untuk layanan studi dan laboratorium yang andal",
              )}
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-[17px] leading-8 text-black/70 md:text-[19px] md:leading-9">
              {t(
                "PML’s certification and accreditation records strengthen trust in its scientific, clinical, and laboratory service delivery.",
                "Rekam jejak sertifikasi dan akreditasi PML memperkuat kepercayaan terhadap layanan ilmiah, klinis, dan laboratoriumnya.",
              )}
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-3">
            {certifications.map((item) => (
              <article
                key={item.title}
                className="group overflow-hidden rounded-[30px] border border-black/5 bg-white/92 p-5 shadow-[0_18px_55px_rgba(0,0,0,0.07)] backdrop-blur transition hover:-translate-y-1 hover:border-[#039147]/20 hover:shadow-[0_26px_70px_rgba(3,145,71,0.12)] md:p-6"
              >
                <div className="overflow-hidden rounded-[22px] bg-[#f4fbf7]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={700}
                    height={460}
                    className="aspect-[4/3] w-full object-contain p-4 transition duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="mt-5 flex h-10 w-10 items-center justify-center rounded-2xl border border-[#039147]/10 bg-[#eaf8f0] text-[#039147]">
                  <Icon name="shield" />
                </div>

                <h3 className="mt-4 text-2xl font-black leading-tight tracking-[-0.025em] text-black md:text-xl">
                  {isIndonesian
                    ? item.title ===
                      "Plenary Accreditation from the Ministry of Health of the Republic of Indonesia"
                      ? "Akreditasi Paripurna dari Kementerian Kesehatan Republik Indonesia"
                      : item.title ===
                          "Foreign Bioequivalence Centre Accreditation from the National Pharmaceutical Regulatory Agency Malaysia"
                        ? "Akreditasi Foreign Bioequivalence Centre dari National Pharmaceutical Regulatory Agency Malaysia"
                        : item.title
                    : item.title}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="clients-network" className="bg-white py-16 md:py-28">
        <div className="pml-container">
          <div className="grid gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#039147] md:text-sm">
                {t("Clients & Network", "Klien & Jaringan")}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
                {t(
                  "Supporting local and international sponsors through reliable collaboration",
                  "Mendukung sponsor lokal dan internasional melalui kolaborasi yang andal",
                )}
              </h2>

              <p className="mt-5 text-[17px] leading-8 text-black/68 md:text-[19px] md:leading-9 md:mt-6 md:text-lg md:leading-9">
                {t(
                  "PML supports pharmaceutical companies, healthcare organizations, research partners, hospitals, investigators, and overseas sponsors that require clinical, analytical, regulatory, and documentation support in Indonesia.",
                  "PML mendukung perusahaan farmasi, organisasi layanan kesehatan, mitra penelitian, rumah sakit, investigator, dan sponsor luar negeri yang membutuhkan dukungan klinis, analitik, regulasi, dan dokumentasi di Indonesia.",
                )}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {(isIndonesian
                ? [
                    {
                      title: "Perusahaan farmasi lokal",
                      desc: "Dukungan bagi sponsor di Indonesia dalam mempersiapkan kebutuhan klinis, analitik, dan regulasi.",
                      icon: "pharma",
                    },
                    {
                      title: "Sponsor internasional",
                      desc: "Dukungan kolaborasi bagi mitra luar negeri yang membutuhkan pelaksanaan CRO lokal di Indonesia.",
                      icon: "globe",
                    },
                    {
                      title: "Jaringan rumah sakit dan investigator",
                      desc: "Koordinasi klinis dengan fasilitas kesehatan, investigator, dan pemangku kepentingan operasional.",
                      icon: "hospital",
                    },
                    {
                      title: "Mitra kesehatan dan penelitian",
                      desc: "Kolaborasi penelitian dengan organisasi kesehatan, institusi, dan mitra studi.",
                      icon: "research",
                    },
                    {
                      title: "Tim regulasi dan dokumentasi",
                      desc: "Dukungan pengajuan, kepatuhan, dan dokumentasi untuk kesiapan proyek.",
                      icon: "approval",
                    },
                    {
                      title: "Kolaborator klinis dan laboratorium",
                      desc: "Kolaborasi terintegrasi antara operasional klinis dan alur kerja laboratorium.",
                      icon: "lab",
                    },
                  ]
                : [
                    {
                      title: "Local pharmaceutical companies",
                      desc: "Support for Indonesia-based sponsors preparing clinical, analytical, and regulatory needs.",
                      icon: "pharma",
                    },
                    {
                      title: "International sponsors",
                      desc: "Collaboration support for overseas partners requiring local CRO execution in Indonesia.",
                      icon: "globe",
                    },
                    {
                      title: "Hospital and investigator network",
                      desc: "Clinical coordination with healthcare sites, investigators, and operational stakeholders.",
                      icon: "hospital",
                    },
                    {
                      title: "Healthcare and research partners",
                      desc: "Research collaboration across healthcare organizations, institutions, and study partners.",
                      icon: "research",
                    },
                    {
                      title: "Regulatory and documentation teams",
                      desc: "Submission, compliance, and documentation support for project readiness.",
                      icon: "approval",
                    },
                    {
                      title: "Clinical and laboratory collaborators",
                      desc: "Integrated collaboration between clinical operations and laboratory workflows.",
                      icon: "lab",
                    },
                  ]
              ).map((item) => (
                <article
                  key={item.title}
                  className="group relative overflow-hidden rounded-[28px] border border-black/5 bg-[#f6faf7] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#039147]/20 hover:bg-white hover:shadow-[0_24px_70px_rgba(3,145,71,0.12)]"
                >
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white transition duration-500 group-hover:scale-125 group-hover:bg-[#eaf8f0]" />

                  <div className="relative flex items-start gap-4">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-[#039147] ring-1 ring-[#039147]/10 transition duration-300 group-hover:bg-[#039147] group-hover:text-white group-hover:shadow-[0_18px_44px_rgba(3,145,71,0.22)]">
                      <AboutSectionIcon name={item.icon} />
                    </span>

                    <div>
                      <h3 className="text-xl font-black leading-tight tracking-[-0.02em] text-black">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-base font-medium leading-7 text-black/62">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="catalogue" className="bg-[#eaf8f0] py-16 md:py-28">
        <div className="pml-container">
          <div className="relative overflow-hidden rounded-[30px] border border-black/5 bg-white p-6 shadow-[0_24px_70px_rgba(0,0,0,0.08)] md:rounded-[36px] md:p-10">
            <div className="pml-hex-pattern absolute inset-0 opacity-[0.05]" />

            <div className="relative grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#039147] md:text-sm">
                  {t("Catalogue", "Katalog")}
                </p>

                <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
                  {t(
                    "Company materials and service references",
                    "Materi perusahaan dan referensi layanan",
                  )}
                </h2>

                <p className="mt-5 text-[17px] leading-8 text-black/68 md:text-[19px] md:leading-9 md:mt-6 md:text-lg md:leading-9">
                  {t(
                    "This section is prepared for future company profile, service catalogue, certificates, and downloadable business materials. For now, visitors can contact PML directly to request the latest official documents.",
                    "Bagian ini disiapkan untuk profil perusahaan, katalog layanan, sertifikat, dan materi bisnis yang dapat diunduh. Pengunjung dapat menghubungi PML untuk meminta dokumen resmi terbaru.",
                  )}
                </p>

                <Link
                  href={localizeHref("/contact", locale)}
                  className="mt-7 inline-flex items-center justify-center rounded-full bg-[#039147] px-7 py-4 text-base font-extrabold text-white shadow-[0_18px_40px_rgba(3,145,71,0.22)] transition hover:-translate-y-0.5"
                >
                  {t("Request Catalogue", "Minta Katalog")}
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {[
                  "Company Profile",
                  "Service Catalogue",
                  "Certificates",
                  "Facility Overview",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[22px] border border-black/5 bg-[#f6faf7] p-5 text-center shadow-sm md:rounded-[26px] md:p-6"
                  >
                    <p className="text-sm font-black leading-tight text-black">
                      {item}
                    </p>
                    <p className="mt-2 text-sm font-bold text-black/48">
                      {t(
                        "Available by request",
                        "Tersedia berdasarkan permintaan",
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <OtherServices current={null} variant="four" />

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
                {t("Work with PML", "Bekerja Sama dengan PML")}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
                {t(
                  "Ready to discuss your next project?",
                  "Siap mendiskusikan proyek Anda berikutnya?",
                )}
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-8 text-black/70 md:text-[19px] md:leading-9">
                {t(
                  "Share your study, testing, or regulatory needs with our team and we will help identify the right service scope, required information, and next steps.",
                  "Sampaikan kebutuhan studi, pengujian, atau regulasi Anda kepada tim kami. PML akan membantu menentukan ruang lingkup layanan, informasi yang dibutuhkan, dan langkah berikutnya.",
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

                <Link
                  href={localizeHref("/services", locale)}
                  className="inline-flex items-center justify-center rounded-full border border-[#039147]/25 bg-white/85 px-8 py-4 text-base font-extrabold text-[#039147] shadow-sm backdrop-blur transition hover:bg-[#039147] hover:text-white"
                >
                  {t("Explore Services", "Jelajahi Layanan")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
