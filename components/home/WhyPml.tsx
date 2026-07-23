"use client";

import { usePathname } from "next/navigation";

import SectionHeader from "@/components/ui/SectionHeader";
import { getLocaleFromPathname } from "@/i18n/client";

const englishPoints = [
  {
    title: "Quality, integrity, and compliance",
    desc: "Quality-driven workflows, ethical execution, and regulatory awareness across every project stage.",
    icon: "shield",
  },
  {
    title: "Multidisciplinary expertise",
    desc: "Clinical, laboratory, regulatory, and project specialists working as one integrated CRO team.",
    icon: "network",
  },
  {
    title: "Responsive project management",
    desc: "Clear coordination, structured communication, and responsive support from inquiry to delivery.",
    icon: "workflow",
  },
  {
    title: "Accredited facilities",
    desc: "Reliable study execution supported by qualified facilities and validated operational standards.",
    icon: "facility",
  },
  {
    title: "Strong local network",
    desc: "Partnerships with hospitals, investigators, healthcare institutions, and industry networks across Indonesia.",
    icon: "globe",
    featured: true,
  },
];

const indonesianPoints = [
  {
    title: "Kualitas, integritas, dan kepatuhan",
    desc: "Alur kerja berbasis kualitas, pelaksanaan yang etis, dan kesadaran regulasi di setiap tahap proyek.",
    icon: "shield",
  },
  {
    title: "Keahlian multidisiplin",
    desc: "Spesialis klinis, laboratorium, regulasi, dan proyek yang bekerja sebagai satu tim CRO terintegrasi.",
    icon: "network",
  },
  {
    title: "Manajemen proyek yang responsif",
    desc: "Koordinasi yang jelas, komunikasi terstruktur, dan dukungan responsif sejak inquiry hingga penyelesaian proyek.",
    icon: "workflow",
  },
  {
    title: "Fasilitas terakreditasi",
    desc: "Pelaksanaan studi yang andal dengan dukungan fasilitas berkualitas dan standar operasional tervalidasi.",
    icon: "facility",
  },
  {
    title: "Jaringan lokal yang kuat",
    desc: "Kemitraan dengan rumah sakit, investigator, institusi kesehatan, dan jaringan industri di seluruh Indonesia.",
    icon: "globe",
    featured: true,
  },
];

function WhyIcon({ name }: { name: string }) {
  const common = "currentColor";

  if (name === "shield") {
    return (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
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

  if (name === "network") {
    return (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="6.5" cy="7" r="2.5" stroke={common} strokeWidth="2" />
        <circle cx="17.5" cy="7" r="2.5" stroke={common} strokeWidth="2" />
        <circle cx="12" cy="17" r="2.5" stroke={common} strokeWidth="2" />
        <path
          d="M8.5 8.8L10.8 14.8M15.5 8.8L13.2 14.8M9 17H15"
          stroke={common}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "workflow") {
    return (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M5 7H13"
          stroke={common}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M5 17H19"
          stroke={common}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M13 7L10.5 4.5M13 7L10.5 9.5"
          stroke={common}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 17L16.5 14.5M19 17L16.5 19.5"
          stroke={common}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="17" cy="7" r="2" stroke={common} strokeWidth="2" />
        <circle cx="7" cy="17" r="2" stroke={common} strokeWidth="2" />
      </svg>
    );
  }

  if (name === "facility") {
    return (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M5 20V7L12 3L19 7V20"
          stroke={common}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M9 20V14H15V20"
          stroke={common}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M9 9H10M14 9H15M9 12H10M14 12H15"
          stroke={common}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "globe") {
    return (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
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

  return null;
}

export default function WhyPml() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isIndonesian = locale === "id";
  const points = isIndonesian ? indonesianPoints : englishPoints;

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-white py-18 md:py-32"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(3,145,71,0.10),transparent_34%),radial-gradient(circle_at_82%_62%,rgba(3,145,71,0.08),transparent_30%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      <div className="absolute right-[-160px] top-20 h-[420px] w-[420px] rounded-full bg-[#eaf8f0]/70 blur-3xl" />
      <div className="absolute left-[-180px] bottom-10 h-[360px] w-[360px] rounded-full bg-[#f4fbf7] blur-3xl" />

      <div className="pml-container relative grid gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-16">
        <div>
          <SectionHeader
            eyebrow={isIndonesian ? "Mengapa PML" : "Why PML"}
            title={
              isIndonesian
                ? "Dibangun untuk kualitas, kepatuhan, dan kolaborasi yang andal"
                : "Built for quality, compliance, and reliable collaboration"
            }
            description={
              isIndonesian
                ? "PML memadukan disiplin ilmiah, pemahaman regulasi, keahlian multidisiplin, dan dukungan proyek yang responsif untuk membantu sponsor bergerak dari perencanaan menuju pelaksanaan studi dan dokumentasi yang andal."
                : "PML combines scientific discipline, regulatory awareness, multidisciplinary expertise, and responsive project support to help sponsors move from planning to reliable study execution and documentation."
            }
          />

          <div className="relative mt-8 overflow-hidden rounded-[34px] bg-[#039147] p-7 text-white shadow-[0_28px_80px_rgba(3,145,71,0.26)] md:mt-9 md:p-9">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
            <div className="absolute -bottom-20 left-8 h-44 w-44 rounded-full bg-white/10" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.14),transparent_42%)]" />

            <div className="relative">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/14 text-white ring-1 ring-white/20">
                <WhyIcon name="shield" />
              </div>

              <p className="max-w-xl text-2xl font-black leading-tight tracking-[-0.03em] md:text-[30px]">
                {isIndonesian
                  ? "Inovasi yang didukung oleh keunggulan ilmiah."
                  : "Innovation, powered by scientific excellence."}
              </p>
              <p className="mt-5 max-w-2xl text-[17px] font-medium leading-8 text-white/84 md:text-[19px] md:leading-9">
                {isIndonesian
                  ? "Arah digital baru yang mencerminkan komitmen PML terhadap dukungan CRO yang kredibel, patuh terhadap regulasi, dan berorientasi pada kebutuhan pelanggan."
                  : "A renewed digital direction that reflects PML’s commitment to credible, compliant, and customer-oriented CRO support."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {points.map((point) => (
            <article
              key={point.title}
              className={`group relative overflow-hidden rounded-[32px] border border-black/5 bg-white/94 p-6 shadow-[0_18px_55px_rgba(0,0,0,0.07)] backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:border-[#039147]/20 hover:shadow-[0_28px_80px_rgba(3,145,71,0.14)] md:p-7 ${
                point.featured ? "md:col-span-2" : ""
              }`}
            >
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#eaf8f0] transition duration-500 group-hover:scale-125 group-hover:bg-[#039147]/12" />
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#039147] transition-all duration-500 group-hover:w-full" />

              <div
                className={`relative flex gap-5 ${point.featured ? "items-start md:items-center" : "items-start"}`}
              >
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] bg-[#eaf8f0] text-[#039147] ring-1 ring-[#039147]/10 transition duration-300 group-hover:bg-[#039147] group-hover:text-white group-hover:shadow-[0_18px_44px_rgba(3,145,71,0.22)]">
                  <WhyIcon name={point.icon} />
                </span>

                <div>
                  <h3 className="text-[22px] font-black leading-tight tracking-[-0.03em] text-black md:text-[25px]">
                    {point.title}
                  </h3>

                  <p className="mt-4 text-[17px] font-medium leading-8 text-black/62">
                    {point.desc}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
