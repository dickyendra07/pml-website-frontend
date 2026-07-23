"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { getLocaleFromPathname, localizeHref } from "@/i18n/client";

const regulatoryTeamEn = [
  {
    name: "Anton Hidayat",
    role: "President Director",
    image: "/images/pml/team/anton-hidayat.jpg",
    description:
      "As PML’s President Director, he leads the company’s strategic direction and business growth, leveraging more than 20 years of experience in regulatory and government affairs, as well as market access within Indonesia’s pharmaceutical industry. He provides strategic oversight of the company’s integrated service portfolio, enabling pharmaceutical and healthcare companies to successfully bring their products to market through tailored regulatory, product development, and market entry strategies. By fostering strong partnerships with regulatory authorities, government institutions, and industry stakeholders, he helps clients navigate Indonesia’s evolving regulatory landscape, facilitate timely market access, and achieve sustainable business growth.",
  },
  {
    name: "Fathi",
    role: "Senior Regulatory Affairs Professional",
    image: "/images/pml/team/fathi.jpg",
    description:
      "Senior Regulatory Affairs professional with 13+ years of experience in Indonesia's pharmaceutical industry, leading regulatory strategies, end-to-end product registrations, lifecycle management, and compliance across diverse product portfolios. Proven expertise in driving complex regulatory submissions and leading technical discussions and negotiations with regulatory authorities to support successful product approvals and business objectives.",
  },
  {
    name: "Rini Hayati Amril",
    role: "Senior Regulatory Affairs Professional",
    image: "/images/pml/team/rini-hayati.jpg",
    description:
      "Senior Regulatory Affairs professional with over 20 years of experience in Indonesia's pharmaceutical industry. Experienced in developing regulatory strategies, leading product registrations, managing lifecycle activities, and ensuring compliance with Indonesian regulatory requirements.",
  },
  {
    name: "Hikmahwati Syafrie",
    role: "Regulatory Affairs Professional",
    image: "/images/pml/team/hikmah.jpg",
    description:
      "Regulatory Affairs professional in Indonesia with 9+ years of experience in the registration of pharmaceuticals, medical devices, advanced therapy products, operational licensing and certification and building strong relationships with regulatory authorities.",
  },
  {
    name: "Jessica Seanjaya",
    role: "Regulatory Affairs Professional",
    image: "/images/pml/team/jessica.jpg",
    description:
      "Regulatory Affairs professional with 5+ years of experience in the registration of pharmaceutical products in Indonesia, including novel biological products, biosimilars, generic medicines (chemical), and traditional medicines. Experienced in preparing regulatory submissions, coordinating with regulatory authorities, and supporting product registrations in compliance with applicable regulations.",
  },
  {
    name: "Annisa Patima Az-Zahra",
    role: "Regulatory Affairs Pharmacist",
    image: "/images/pml/team/annisa-patimah.jpg",
    description:
      "Regulatory Affairs Pharmacist with experience in pharmaceutical, biological, and medical device regulatory affairs in Indonesia. Experienced in product registration and lifecycle management, including new registrations, variations, renewals, site transfers, and notifications for pharmaceutical and biological products. Skilled in CTD dossier preparation, regulatory document review, and submissions to the Indonesian health authority.",
  },
  {
    name: "Kristin Theresia",
    role: "Regulatory Affairs Pharmacist",
    image: "/images/pml/team/kristin-theresia.jpg",
    description:
      "Regulatory Affairs Pharmacist with experience in the registration of medical devices, traditional medicines, pharmaceuticals, and biologics. Experienced in preparing regulatory submissions, supporting product registrations, importation processes, and certification (GMP, Medical Device Good Manufacturing Practice, and Medical Device Good Distribution Practice) in compliance with applicable regulations.",
  },
  {
    name: "Gabriella Rosalina",
    role: "Regulatory Affairs Pharmacist",
    image: "/images/pml/team/gabriella.jpg",
    description:
      "Regulatory Affairs Pharmacist with experience in the registration of biological products. Experienced in preparing regulatory submissions, coordinating with regulatory authorities, supporting product registrations, and managing manufacturing site certification processes. Also serves as a Certified Halal Supervisor, supporting halal certification activities.",
  },
  {
    name: "Silviana Rezki Umami",
    role: "Regulatory Affairs Pharmacist",
    image: "/images/pml/team/silviana.jpg",
    description:
      "Regulatory Affairs Pharmacist with experience in the registration and regulatory compliance of pharmaceutical and biological products in Indonesia. Experienced in managing product registrations, post-approval changes, regulatory documentation, and health authority submissions to support product approval and lifecycle maintenance.",
  },
];

const expertiseAreasEn = [
  {
    title: "Regulatory Affairs",
    desc: "Strategic regulatory planning, submission preparation, and authority coordination.",
    icon: "regulatory",
  },
  {
    title: "Project Management",
    desc: "Structured coordination across timelines, stakeholders, and project milestones.",
    icon: "project",
  },
  {
    title: "Data Management",
    desc: "Organized handling of study information, records, and documentation flow.",
    icon: "data",
  },
  {
    title: "Quality Assurance",
    desc: "Quality-oriented review, compliance mindset, and reliable process control.",
    icon: "quality",
  },
  {
    title: "Clinical Operations",
    desc: "Operational support for clinical study preparation, execution, and monitoring.",
    icon: "clinical",
  },
  {
    title: "Analytical Laboratory",
    desc: "Laboratory-oriented coordination for analytical testing and technical workflows.",
    icon: "laboratory",
  },
  {
    title: "Study Documentation",
    desc: "Clear document preparation, tracking, review, and submission readiness.",
    icon: "documentation",
  },
  {
    title: "Sponsor Communication",
    desc: "Consistent communication support between sponsors, teams, and stakeholders.",
    icon: "communication",
  },
];

const regulatoryTeamId = [
  {
    name: "Anton Hidayat",
    role: "Presiden Direktur",
    image: "/images/pml/team/anton-hidayat.jpg",
    description:
      "Sebagai Presiden Direktur PML, beliau memimpin arah strategis dan pertumbuhan bisnis perusahaan dengan pengalaman lebih dari 20 tahun dalam bidang regulasi, hubungan pemerintahan, dan akses pasar di industri farmasi Indonesia. Beliau memberikan pengawasan strategis terhadap portofolio layanan terintegrasi perusahaan untuk membantu perusahaan farmasi dan layanan kesehatan membawa produknya ke pasar melalui strategi regulasi, pengembangan produk, dan masuk pasar yang disesuaikan. Melalui kemitraan yang kuat dengan otoritas regulasi, institusi pemerintah, dan pemangku kepentingan industri, beliau membantu klien menghadapi perkembangan regulasi Indonesia, mempercepat akses pasar, dan mencapai pertumbuhan bisnis yang berkelanjutan.",
  },
  {
    name: "Fathi",
    role: "Profesional Senior Urusan Regulasi",
    image: "/images/pml/team/fathi.jpg",
    description:
      "Profesional senior Urusan Regulasi dengan pengalaman lebih dari 13 tahun di industri farmasi Indonesia. Berpengalaman memimpin strategi regulasi, registrasi produk secara menyeluruh, manajemen siklus hidup, dan kepatuhan untuk berbagai portofolio produk. Memiliki keahlian dalam menangani pengajuan regulasi yang kompleks serta memimpin diskusi dan negosiasi teknis dengan otoritas regulasi untuk mendukung persetujuan produk dan tujuan bisnis.",
  },
  {
    name: "Rini Hayati Amril",
    role: "Profesional Senior Urusan Regulasi",
    image: "/images/pml/team/rini-hayati.jpg",
    description:
      "Profesional senior Urusan Regulasi dengan pengalaman lebih dari 20 tahun di industri farmasi Indonesia. Berpengalaman menyusun strategi regulasi, memimpin registrasi produk, mengelola aktivitas siklus hidup produk, dan memastikan kepatuhan terhadap persyaratan regulasi Indonesia.",
  },
  {
    name: "Hikmahwati Syafrie",
    role: "Profesional Urusan Regulasi",
    image: "/images/pml/team/hikmah.jpg",
    description:
      "Profesional Urusan Regulasi di Indonesia dengan pengalaman lebih dari 9 tahun dalam registrasi produk farmasi, alat kesehatan, produk terapi lanjutan, perizinan operasional, dan sertifikasi. Memiliki pengalaman membangun hubungan yang kuat dengan otoritas regulasi.",
  },
  {
    name: "Jessica Seanjaya",
    role: "Profesional Urusan Regulasi",
    image: "/images/pml/team/jessica.jpg",
    description:
      "Profesional Urusan Regulasi dengan pengalaman lebih dari 5 tahun dalam registrasi produk farmasi di Indonesia, termasuk produk biologis baru, biosimilar, obat generik kimia, dan obat tradisional. Berpengalaman menyiapkan dokumen pengajuan regulasi, berkoordinasi dengan otoritas regulasi, dan mendukung registrasi produk sesuai regulasi yang berlaku.",
  },
  {
    name: "Annisa Patima Az-Zahra",
    role: "Apoteker Urusan Regulasi",
    image: "/images/pml/team/annisa-patimah.jpg",
    description:
      "Apoteker Urusan Regulasi dengan pengalaman dalam regulasi produk farmasi, biologis, dan alat kesehatan di Indonesia. Berpengalaman dalam registrasi produk dan manajemen siklus hidup, termasuk registrasi baru, variasi, perpanjangan, perpindahan lokasi produksi, dan notifikasi. Terampil dalam penyusunan dossier CTD, peninjauan dokumen regulasi, dan pengajuan kepada otoritas kesehatan Indonesia.",
  },
  {
    name: "Kristin Theresia",
    role: "Apoteker Urusan Regulasi",
    image: "/images/pml/team/kristin-theresia.jpg",
    description:
      "Apoteker Urusan Regulasi dengan pengalaman dalam registrasi alat kesehatan, obat tradisional, produk farmasi, dan biologis. Berpengalaman menyiapkan pengajuan regulasi, mendukung registrasi produk, proses importasi, serta sertifikasi GMP, Cara Pembuatan Alat Kesehatan yang Baik, dan Cara Distribusi Alat Kesehatan yang Baik sesuai regulasi yang berlaku.",
  },
  {
    name: "Gabriella Rosalina",
    role: "Apoteker Urusan Regulasi",
    image: "/images/pml/team/gabriella.jpg",
    description:
      "Apoteker Urusan Regulasi dengan pengalaman dalam registrasi produk biologis. Berpengalaman menyiapkan pengajuan regulasi, berkoordinasi dengan otoritas, mendukung registrasi produk, dan mengelola proses sertifikasi lokasi produksi. Beliau juga merupakan Penyelia Halal Bersertifikat yang mendukung aktivitas sertifikasi halal.",
  },
  {
    name: "Silviana Rezki Umami",
    role: "Apoteker Urusan Regulasi",
    image: "/images/pml/team/silviana.jpg",
    description:
      "Apoteker Urusan Regulasi dengan pengalaman dalam registrasi dan kepatuhan regulasi produk farmasi serta biologis di Indonesia. Berpengalaman mengelola registrasi produk, perubahan pascapersetujuan, dokumentasi regulasi, dan pengajuan kepada otoritas kesehatan untuk mendukung persetujuan serta pemeliharaan siklus hidup produk.",
  },
];

const expertiseAreasId = [
  {
    title: "Urusan Regulasi",
    desc: "Perencanaan regulasi strategis, persiapan pengajuan, dan koordinasi dengan otoritas.",
    icon: "regulatory",
  },
  {
    title: "Manajemen Proyek",
    desc: "Koordinasi terstruktur terhadap jadwal, pemangku kepentingan, dan pencapaian proyek.",
    icon: "project",
  },
  {
    title: "Manajemen Data",
    desc: "Pengelolaan informasi studi, catatan, dan alur dokumentasi secara terorganisasi.",
    icon: "data",
  },
  {
    title: "Jaminan Mutu",
    desc: "Peninjauan berorientasi mutu, kepatuhan, dan pengendalian proses yang andal.",
    icon: "quality",
  },
  {
    title: "Operasional Klinis",
    desc: "Dukungan operasional untuk persiapan, pelaksanaan, dan monitoring studi klinis.",
    icon: "clinical",
  },
  {
    title: "Laboratorium Analitik",
    desc: "Koordinasi laboratorium untuk pengujian analitik dan alur kerja teknis.",
    icon: "laboratory",
  },
  {
    title: "Dokumentasi Studi",
    desc: "Persiapan, pelacakan, peninjauan dokumen, dan kesiapan pengajuan.",
    icon: "documentation",
  },
  {
    title: "Komunikasi Sponsor",
    desc: "Dukungan komunikasi yang konsisten antara sponsor, tim, dan pemangku kepentingan.",
    icon: "communication",
  },
];

const teamStrengthsId = [
  {
    title: "Koordinasi Regulasi",
    desc: "Mendukung persiapan berorientasi regulasi, alur dokumentasi, dan komunikasi antar pemangku kepentingan proyek.",
    icon: "regulatory",
  },
  {
    title: "Dokumentasi Proyek",
    desc: "Membantu menjaga catatan studi, materi pengajuan, dan kesiapan dokumentasi proyek secara terorganisasi.",
    icon: "documentation",
  },
  {
    title: "Komunikasi Sponsor",
    desc: "Mendukung koordinasi yang lebih jelas antara sponsor, tim internal, dan fungsi proyek terkait.",
    icon: "communication",
  },
  {
    title: "Dukungan Proyek Terintegrasi",
    desc: "Bekerja bersama tim klinis, analitik, dan operasional untuk mendukung pelaksanaan proyek CRO yang andal.",
    icon: "project",
  },
];

function ExpertiseIcon({ name }: { name: string }) {
  if (name === "regulatory") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3L19 7V12C19 16.6 16.1 19.8 12 21C7.9 19.8 5 16.6 5 12V7L12 3Z"
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

  if (name === "project") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 6H19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M5 12H15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M5 18H11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M17 15L19 17L22 13.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "data") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <ellipse
          cx="12"
          cy="6"
          rx="7"
          ry="3"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M5 6V12C5 13.7 8.1 15 12 15C15.9 15 19 13.7 19 12V6"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M5 12V18C5 19.7 8.1 21 12 21C15.9 21 19 19.7 19 18V12"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    );
  }

  if (name === "quality") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 4L14.2 8.5L19 9.2L15.5 12.6L16.4 17.4L12 15.1L7.6 17.4L8.5 12.6L5 9.2L9.8 8.5L12 4Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "clinical") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect
          x="4"
          y="4"
          width="16"
          height="16"
          rx="5"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M12 8V16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M8 12H16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "laboratory") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 3H15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M10 3V8L6 17.2C5.3 18.8 6.4 20.5 8.2 20.5H15.8C17.6 20.5 18.7 18.8 18 17.2L14 8V3"
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

  if (name === "documentation") {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M7 3H14L19 8V21H7V3Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M14 3V8H19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M10 13H16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M10 17H15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 8H17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 12H13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 5C4 3.9 4.9 3 6 3H18C19.1 3 20 3.9 20 5V14C20 15.1 19.1 16 18 16H9L5 20V16H6C4.9 16 4 15.1 4 14V5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const teamStrengthsEn = [
  {
    title: "Regulatory Coordination",
    desc: "Supporting regulatory-oriented preparation, documentation flow, and communication across project stakeholders.",
    icon: "regulatory",
  },
  {
    title: "Project Documentation",
    desc: "Helping maintain organized study records, submission-related materials, and project documentation readiness.",
    icon: "documentation",
  },
  {
    title: "Sponsor Communication",
    desc: "Supporting clearer coordination between sponsors, internal teams, and related project functions.",
    icon: "communication",
  },
  {
    title: "Integrated Project Support",
    desc: "Working alongside clinical, analytical, and operational teams to support reliable CRO project delivery.",
    icon: "project",
  },
];

export default function ExpertsAndTeamPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isIndonesian = locale === "id";

  const regulatoryTeam = isIndonesian ? regulatoryTeamId : regulatoryTeamEn;
  const expertiseAreas = isIndonesian ? expertiseAreasId : expertiseAreasEn;
  const teamStrengths = isIndonesian ? teamStrengthsId : teamStrengthsEn;

  const t = (english: string, indonesian: string) =>
    isIndonesian ? indonesian : english;

  const openProposal = () => {
    window.dispatchEvent(new CustomEvent("open-proposal-modal"));
  };

  return (
    <main>
      <section className="relative overflow-hidden bg-white text-black">
        <Image
          src="/images/pml/team/ra-team-pml.png"
          alt={t("PML Regulatory Affairs Team", "Tim Urusan Regulasi PML")}
          fill
          priority
          className="object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/96 via-white/78 to-white/22" />
        <div className="absolute inset-0 bg-[#039147]/10" />
        <div className="pml-hex-pattern absolute inset-0 opacity-[0.06]" />

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
              {t("Experts & Team", "Para Ahli & Tim")}
            </span>
          </nav>

          <div className="max-w-5xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#039147]/20 bg-white/95 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#039147] shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#039147]" />
              {t("Experts & Team", "Para Ahli & Tim")}
            </p>

            <h1 className="mt-6 max-w-5xl text-4xl font-black leading-[1.04] tracking-tight text-black md:text-6xl lg:text-[68px]">
              {t(
                "Regulatory affairs team supporting reliable CRO project delivery",
                "Tim urusan regulasi yang mendukung pelaksanaan proyek CRO secara andal",
              )}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-black/68 md:text-lg">
              {t(
                "PML is supported by professionals across regulatory affairs, project coordination, documentation, and sponsor communication to support smoother research and service delivery.",
                "PML didukung oleh para profesional di bidang urusan regulasi, koordinasi proyek, dokumentasi, dan komunikasi sponsor untuk mendukung pelaksanaan penelitian dan layanan yang lebih lancar.",
              )}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#regulatory-team"
                className="inline-flex items-center justify-center rounded-full bg-[#039147] px-7 py-4 text-sm font-extrabold text-white shadow-xl shadow-[#039147]/20 transition hover:-translate-y-0.5 hover:bg-[#027a3c]"
              >
                {t("Meet the Team", "Kenali Tim Kami")}
              </a>

              <button
                type="button"
                onClick={openProposal}
                className="inline-flex items-center justify-center rounded-full border border-[#039147]/25 bg-white/88 px-7 py-4 text-sm font-extrabold text-[#039147] shadow-sm backdrop-blur transition hover:bg-[#039147] hover:text-white"
              >
                {t("Request a Proposal", "Ajukan Proposal")}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-28">
        <div className="pml-container">
          <div className="grid gap-9 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-12">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#039147] md:text-sm">
                {t("Team Capability", "Kapabilitas Tim")}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
                {t(
                  "Experienced support for regulatory, documentation, and project workflows",
                  "Dukungan berpengalaman untuk alur regulasi, dokumentasi, dan proyek",
                )}
              </h2>

              <p className="mt-5 text-base leading-8 text-black/65 md:mt-6 md:text-lg md:leading-9">
                {t(
                  "PML’s team structure supports the complete project journey, from study discussion, planning, documentation, regulatory-oriented preparation, coordination, and reporting. This multidisciplinary capability helps sponsors work with clearer direction and stronger operational support.",
                  "Struktur tim PML mendukung perjalanan proyek secara menyeluruh, mulai dari diskusi studi, perencanaan, dokumentasi, persiapan regulasi, koordinasi, hingga pelaporan. Kapabilitas multidisiplin ini membantu sponsor bekerja dengan arah yang lebih jelas dan dukungan operasional yang lebih kuat.",
                )}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {expertiseAreas.map((area) => (
                <div
                  key={area.title}
                  className="group relative overflow-hidden rounded-[28px] border border-black/5 bg-white p-5 shadow-[0_18px_55px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#039147]/20 hover:shadow-[0_26px_80px_rgba(3,145,71,0.13)] md:p-6"
                >
                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#eaf8f0] opacity-70 transition duration-500 group-hover:scale-125" />

                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf8f0] text-[#039147] transition duration-300 group-hover:bg-[#039147] group-hover:text-white">
                    <ExpertiseIcon name={area.icon} />
                  </div>

                  <h3 className="relative mt-5 text-lg font-black leading-tight text-black md:text-xl">
                    {area.title}
                  </h3>

                  <p className="relative mt-3 text-sm font-medium leading-7 text-black/58 md:text-[15px]">
                    {area.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="regulatory-team" className="bg-[#eaf8f0] py-16 md:py-28">
        <div className="pml-container">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#039147] md:text-sm">
              {t("Regulatory Affairs Team", "Tim Urusan Regulasi")}
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
              {t(
                "Meet PML’s regulatory affairs team",
                "Kenali tim urusan regulasi PML",
              )}
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-black/65 md:mt-6 md:text-lg md:leading-9">
              {t(
                "Selected team members supporting regulatory affairs, project coordination, and documentation readiness. Detailed team narratives will be updated after final client review.",
                "Anggota tim terpilih yang mendukung urusan regulasi, koordinasi proyek, dan kesiapan dokumentasi. Informasi rinci mengenai tim akan diperbarui setelah peninjauan akhir dari klien.",
              )}
            </p>
          </div>

          <div className="-mx-4 mt-10 flex snap-x gap-4 overflow-x-auto px-4 pb-5 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
            {regulatoryTeam.map((member) => (
              <article
                key={member.name}
                className="group w-[82vw] max-w-[350px] shrink-0 snap-start overflow-hidden rounded-[30px] border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.12)] md:w-auto md:max-w-none md:rounded-[34px]"
              >
                <div className="relative aspect-[4/4.35] overflow-hidden bg-[#f6faf7]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/36 via-black/4 to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="rounded-full bg-white/92 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#039147] backdrop-blur">
                      {member.role}
                    </p>
                  </div>
                </div>

                <div className="p-6 md:p-7">
                  <h3 className="text-2xl font-black leading-tight text-black">
                    {member.name}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-black/60 md:text-[15px] md:leading-7">
                    {member.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-1 text-center text-xs font-bold text-black/40 md:hidden">
            {t(
              "Swipe to explore team members",
              "Geser untuk melihat anggota tim",
            )}
          </p>
        </div>
      </section>

      <section className="bg-white py-16 md:py-28">
        <div className="pml-container">
          <div className="grid gap-9 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-12">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#039147] md:text-sm">
                {t("Team Strength", "Kekuatan Tim")}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
                {t(
                  "Built to support sponsors from planning to documentation",
                  "Dibangun untuk mendukung sponsor dari perencanaan hingga dokumentasi",
                )}
              </h2>

              <p className="mt-5 text-base leading-8 text-black/65 md:mt-6 md:text-lg md:leading-9">
                {t(
                  "PML’s team capability is designed to support project clarity, operational reliability, communication flow, and documentation readiness.",
                  "Kapabilitas tim PML dirancang untuk mendukung kejelasan proyek, keandalan operasional, alur komunikasi, dan kesiapan dokumentasi.",
                )}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {teamStrengths.map((item) => (
                <div
                  key={item.title}
                  className="group relative overflow-hidden rounded-[30px] border border-black/5 bg-white p-5 shadow-[0_18px_55px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#039147]/20 hover:shadow-[0_26px_80px_rgba(3,145,71,0.13)] md:p-6"
                >
                  <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-[#eaf8f0] opacity-75 transition duration-500 group-hover:scale-125" />
                  <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#039147] via-[#7cc245] to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

                  <div className="relative flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#eaf8f0] text-[#039147] transition duration-300 group-hover:bg-[#039147] group-hover:text-white">
                      <ExpertiseIcon name={item.icon} />
                    </div>

                    <div>
                      <h3 className="text-lg font-black leading-tight text-black md:text-xl">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-sm font-medium leading-7 text-black/58 md:text-[15px]">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-16 text-black md:py-28">
        <Image
          src="/images/pml/services/clinical-trial-proof.png"
          alt=""
          fill
          className="object-cover opacity-34"
        />
        <div className="absolute inset-0 bg-white/68" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/96 via-white/82 to-[#039147]/16" />
        <div className="pml-hex-pattern absolute inset-0 opacity-[0.045]" />

        <div className="pml-container relative">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#039147] md:text-sm">
              {t("Work With PML Experts", "Bekerja Sama dengan Ahli PML")}
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
              {t(
                "Need clinical, analytical, regulatory, or project support?",
                "Membutuhkan dukungan klinis, analitik, regulasi, atau proyek?",
              )}
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-black/68 md:mt-6 md:text-lg md:leading-9">
              {t(
                "Share your project needs with PML and our team will help identify the right service scope, required information, and next steps.",
                "Sampaikan kebutuhan proyek Anda kepada PML dan tim kami akan membantu menentukan ruang lingkup layanan, informasi yang diperlukan, dan langkah berikutnya.",
              )}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={openProposal}
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-extrabold text-[#039147] shadow-xl transition hover:-translate-y-0.5"
              >
                {t("Request Proposal", "Ajukan Proposal")}
              </button>

              <Link
                href={localizeHref("/contact", locale)}
                className="inline-flex items-center justify-center rounded-full border border-[#039147]/25 bg-white/85 px-8 py-4 text-sm font-extrabold text-[#039147] shadow-sm backdrop-blur transition hover:bg-[#039147] hover:text-white"
              >
                {t("Contact PML", "Hubungi PML")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
