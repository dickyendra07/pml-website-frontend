"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { getLocaleFromPathname, localizeHref } from "@/i18n/client";

const clientLogos = [
  {
    name: "Danone",
    image:
      "/images/pml/clients/all/11-LogoDanone-2e319fffe365090c3d87c9b0ccb495c2.png",
  },
  {
    name: "Draeger",
    image: "/images/pml/clients/logos/draeger-logo.png",
  },
  {
    name: "GSK",
    image: "/images/pml/clients/logos/gsk-logo.png",
  },
  {
    name: "Sanofi",
    image:
      "/images/pml/clients/all/09-Logo103-040273d3342defd193fcd90856ea4ec1.png",
  },
  {
    name: "Anika",
    image: "/images/pml/clients/logos/anika-logo.jpg",
  },
  {
    name: "Novotech",
    image:
      "/images/pml/clients/all/12-novotech-393598700a2884f3470db0f718de44e7.jpeg",
  },
  {
    name: "TTY Biopharm",
    image:
      "/images/pml/clients/all/08-Logo102-21e882f6bea598ffb0b9850bd0d1be94.png",
  },
  {
    name: "Daewoong",
    image: "/images/pml/clients/logos/daewoong-logo.png",
  },
  {
    name: "Genexine",
    image: "/images/pml/clients/logos/genexine-logo.jpg",
  },
  {
    name: "De La Salle",
    image:
      "/images/pml/clients/all/06-Logo48-50c461fc9ee60d8979787ca5b6f2d069.png",
  },
  {
    name: "Nano Medic",
    image: "/images/pml/clients/logos/nano-medic-logo.png",
  },
  {
    name: "Kementerian Kesehatan",
    image: "/images/pml/clients/logos/kemenkes-logo.png",
  },
  {
    name: "BRIN",
    image:
      "/images/pml/clients/all/10-LogoBrin-ce0b45219c32eb5f45bf40280107e319.png",
  },
  {
    name: "Kimia Farma",
    image:
      "/images/pml/clients/all/05-Logo23-9f1c4cebb16627a1c8863f0217589ff1.png",
  },
  {
    name: "Darya Varia",
    image:
      "/images/pml/clients/all/04-Logo11-929842ffe52e9f9acefa4d9b7d299b2c.png",
  },
  {
    name: "Endo",
    image: "/images/pml/clients/logos/endo-logo.png",
  },
  {
    name: "Bernofarm",
    image: "/images/pml/clients/logos/bernofarm-logo.png",
  },
];

const clientSegments = [
  "Pharmaceutical companies",
  "Biotechnology companies",
  "Medical device companies",
  "Food & beverage companies",
  "Cosmetic companies",
  "Traditional medicine companies",
  "Research institutions",
  "Clinical research partners",
];

void clientSegments;

const collaborationValuesEn = [
  {
    title: "Responsive coordination",
    desc: "Clear communication and project support from inquiry to study or testing execution.",
  },
  {
    title: "Scientific reliability",
    desc: "Clinical, analytical, and regulatory workflows supported by experienced teams and facility capability.",
  },
  {
    title: "Local and international readiness",
    desc: "PML supports sponsors and partners that need Indonesian CRO capability with global-facing standards.",
  },
  {
    title: "Regulatory-oriented documentation",
    desc: "Project outputs are prepared with documentation needs and submission readiness in mind.",
  },
];

const collaborationValuesId = [
  {
    title: "Koordinasi responsif",
    desc: "Komunikasi yang jelas dan dukungan proyek sejak tahap permintaan hingga pelaksanaan studi atau pengujian.",
  },
  {
    title: "Keandalan ilmiah",
    desc: "Alur kerja klinis, analitik, dan regulasi yang didukung oleh tim berpengalaman serta kapabilitas fasilitas.",
  },
  {
    title: "Kesiapan lokal dan internasional",
    desc: "PML mendukung sponsor dan mitra yang membutuhkan kapabilitas CRO Indonesia dengan standar berorientasi global.",
  },
  {
    title: "Dokumentasi berorientasi regulasi",
    desc: "Hasil proyek disiapkan dengan mempertimbangkan kebutuhan dokumentasi dan kesiapan pengajuan.",
  },
];

export default function ClientsPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isIndonesian = locale === "id";

  const collaborationValues = isIndonesian
    ? collaborationValuesId
    : collaborationValuesEn;

  const t = (english: string, indonesian: string) =>
    isIndonesian ? indonesian : english;

  const openProposal = () => {
    window.dispatchEvent(new CustomEvent("open-proposal-modal"));
  };

  return (
    <main>
      <section className="relative overflow-hidden bg-black text-white">
        <Image
          src="/images/pml/clients/all/03-banner_clients.png"
          alt=""
          fill
          priority
          className="object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-[#039147]/24" />
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
              {t("Our Clients", "Klien Kami")}
            </span>
          </nav>

          <div className="max-w-5xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#039147]/20 bg-white/95 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#039147] backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#039147]" />
              {t("Clients & Network", "Klien & Jaringan")}
            </p>

            <h1 className="mt-6 max-w-5xl text-4xl font-black leading-[1.04] tracking-tight text-black md:text-6xl lg:text-[68px]">
              {t(
                "Trusted by clients and partners across research-driven industries",
                "Dipercaya oleh klien dan mitra di berbagai industri berbasis penelitian",
              )}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-black/68 md:text-lg">
              {t(
                "PML works closely with local and international sponsors, institutions, and research partners that require clinical, analytical, regulatory, and documentation support.",
                "PML bekerja sama erat dengan sponsor lokal dan internasional, institusi, serta mitra penelitian yang membutuhkan dukungan klinis, analitik, regulasi, dan dokumentasi.",
              )}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#client-network"
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-extrabold text-[#039147] shadow-xl"
              >
                {t("Explore Network", "Jelajahi Jaringan")}
              </a>

              <button
                type="button"
                onClick={openProposal}
                className="inline-flex items-center justify-center rounded-full border border-[#039147]/20 bg-white px-7 py-4 text-sm font-extrabold text-[#039147] shadow-xl backdrop-blur transition hover:-translate-y-0.5 hover:bg-[#039147] hover:text-white"
              >
                {t("Start Collaboration", "Mulai Kolaborasi")}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-28">
        <div className="pml-container">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#039147] md:text-sm">
              {t("Client Network", "Jaringan Klien")}
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight text-black md:text-6xl">
              {t(
                "More than 300 clients globally have worked with PML",
                "Lebih dari 300 klien global telah bekerja sama dengan PML",
              )}
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-black/64 md:text-lg md:leading-9">
              {t(
                "PML supports a broad client network across pharmaceutical, healthcare, research, and regulated product industries. The collaboration experience includes clinical research, BA/BE study, contract analysis, regulatory management, and project documentation support.",
                "PML mendukung jaringan klien yang luas di industri farmasi, layanan kesehatan, penelitian, dan produk teregulasi. Pengalaman kolaborasinya mencakup penelitian klinis, studi BA/BE, analisis kontrak, manajemen regulasi, dan dukungan dokumentasi proyek.",
              )}
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-[34px] border border-[#039147]/10 bg-[#f6faf7] px-4 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.06)] md:mt-14 md:px-6 md:py-8">
            <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
              <div className="flex w-max gap-5 will-change-transform [animation:clientLogoMarquee_46s_linear_infinite] hover:[animation-play-state:paused]">
                {[...clientLogos, ...clientLogos].map((client, index) => (
                  <div
                    key={`${client.name}-${index}`}
                    className="flex h-28 w-[230px] shrink-0 items-center justify-center rounded-[24px] border border-black/5 bg-white px-7 py-5 shadow-sm md:h-32 md:w-[270px]"
                  >
                    <Image
                      src={client.image}
                      alt={client.name}
                      width={220}
                      height={92}
                      className="max-h-16 w-auto object-contain md:max-h-20"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <style>{`
            @keyframes clientLogoMarquee {
              from {
                transform: translateX(0);
              }
              to {
                transform: translateX(-50%);
              }
            }
          `}</style>
        </div>
      </section>
      <section className="bg-[#eaf8f0] py-16 md:py-28">
        <div className="pml-container">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#039147] md:text-sm">
              {t("Client Logo Wall", "Kumpulan Logo Klien")}
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight text-black md:text-6xl">
              {t(
                "Collaboration across industry, research, and clinical development",
                "Kolaborasi lintas industri, penelitian, dan pengembangan klinis",
              )}
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-black/64 md:text-lg md:leading-9">
              {t(
                "Selected client and partner logos are shown as visual references for PML’s broader collaboration network.",
                "Logo klien dan mitra terpilih ditampilkan sebagai referensi visual dari jaringan kolaborasi PML yang lebih luas.",
              )}
            </p>
          </div>

          <div className="mt-12 grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
            {clientLogos.map((client, index) => (
              <div
                key={`${client.name}-wall-${index}`}
                className="flex h-28 items-center justify-center rounded-[24px] border border-black/5 bg-white px-6 py-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl md:h-32 md:rounded-[28px]"
              >
                <Image
                  src={client.image}
                  alt={client.name}
                  width={220}
                  height={92}
                  className="max-h-16 w-auto object-contain md:max-h-20"
                />
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-base font-extrabold text-[#039147] md:text-lg">
            {t("and many more...", "dan masih banyak lagi...")}
          </p>
        </div>
      </section>

      <section className="bg-white py-16 md:py-28">
        <div className="pml-container">
          <div className="grid gap-9 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-12">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#039147] md:text-sm">
                {t(
                  "Why Clients Work With PML",
                  "Mengapa Klien Bekerja Sama dengan PML",
                )}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
                {t(
                  "A reliable partner for scientific, clinical, analytical, and regulatory needs",
                  "Mitra andal untuk kebutuhan ilmiah, klinis, analitik, dan regulasi",
                )}
              </h2>

              <p className="mt-5 text-base leading-8 text-black/65 md:mt-6 md:text-lg md:leading-9">
                {t(
                  "PML combines project coordination, facility capability, scientific discipline, and documentation-oriented workflows to help sponsors move with confidence.",
                  "PML memadukan koordinasi proyek, kapabilitas fasilitas, disiplin ilmiah, dan alur kerja berorientasi dokumentasi untuk membantu sponsor melangkah dengan lebih percaya diri.",
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {collaborationValues.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[20px] border border-black/5 bg-[#f6faf7] p-4 shadow-sm md:rounded-[24px] md:p-5"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf8f0] text-sm font-black text-[#039147]">
                    ✓
                  </span>
                  <h3 className="mt-3 text-base font-black leading-tight text-black md:mt-4 md:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-black/58 md:text-base md:leading-7">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#039147] py-16 text-black md:py-28">
        <Image
          src="/images/pml/facilities-gallery/clinical-main.jpg"
          alt=""
          fill
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-white/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/96 via-white/82 to-[#039147]/10" />
        <div className="pml-hex-pattern-light absolute inset-0 opacity-[0.10]" />

        <div className="pml-container relative">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#039147] md:text-sm">
              {t("Client Testimonial", "Testimoni Klien")}
            </p>

            <blockquote className="mt-5 text-2xl font-black leading-tight md:text-4xl">
              {t(
                "“PML provides responsive support and reliable coordination for study-related projects, helping sponsors move from planning to execution with clearer communication.”",
                "“PML memberikan dukungan yang responsif dan koordinasi yang andal untuk proyek terkait studi, membantu sponsor bergerak dari perencanaan menuju pelaksanaan dengan komunikasi yang lebih jelas.”",
              )}
            </blockquote>

            <div className="mx-auto mt-8 h-px w-20 bg-white/30" />

            <p className="mt-6 text-base font-extrabold text-black">
              Vitania Rebecca
            </p>
            <p className="mt-2 text-sm font-bold text-black/62">
              PT Kalbe Farma
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-28">
        <div className="pml-container">
          <div className="relative overflow-hidden rounded-[30px] bg-black px-6 py-14 text-center text-black shadow-[0_28px_90px_rgba(0,0,0,0.18)] md:rounded-[36px] md:px-14 md:py-20">
            <Image
              src="/images/pml/cta-lab-background.png"
              alt=""
              fill
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-[#039147]/22" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/74 to-[#039147]/14" />
            <div className="pml-hex-pattern-light absolute inset-0 opacity-[0.10]" />

            <div className="relative mx-auto max-w-3xl">
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
                {t("Business Opportunity", "Peluang Kolaborasi")}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
                {t(
                  "Looking for a reliable CRO partner in Indonesia?",
                  "Mencari mitra CRO yang andal di Indonesia?",
                )}
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-black/68">
                {t(
                  "Contact PML to discuss BA/BE study, clinical trial support, contract analysis, regulatory management, or other collaboration opportunities.",
                  "Hubungi PML untuk mendiskusikan studi BA/BE, dukungan uji klinis, analisis kontrak, manajemen regulasi, atau peluang kolaborasi lainnya.",
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
                  className="inline-flex items-center justify-center rounded-full border border-[#039147]/20 bg-white px-8 py-4 text-sm font-extrabold text-[#039147] shadow-xl backdrop-blur transition hover:-translate-y-0.5 hover:bg-[#039147] hover:text-white"
                >
                  {t("Contact PML", "Hubungi PML")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
