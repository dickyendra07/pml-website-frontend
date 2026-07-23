"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import FacilityCardGrid from "@/components/pages/FacilityCardGrid";
import { getLocaleFromPathname, localizeHref } from "@/i18n/client";

const facilityHeroSlidesEn = [
  {
    eyebrow: "Clinical Study Support",
    title: "Clinical facilities for reliable study execution",
    description:
      "Explore PML clinical facilities designed to support controlled study activities, volunteer coordination, screening, dining areas, and medical support.",
    image: "/images/pml/facilities/photos/pml-facility-photo-01.png",
    href: "/facilities/clinical-facilities",
    cta: "Explore Clinical Facilities",
  },
  {
    eyebrow: "Laboratory Capability",
    title: "Analytical facilities for testing and bioanalysis",
    description:
      "Discover analytical laboratory capability supported by instruments and workflows for bioanalysis, contract analysis, product testing, documentation, and reporting.",
    image: "/images/pml/facilities/photos/pml-facility-photo-17.png",
    href: "/facilities/analytical-facilities",
    cta: "Explore Analytical Facilities",
  },
  {
    eyebrow: "Operational Support",
    title: "Supporting facilities for complete project workflow",
    description:
      "Review supporting infrastructure for drug storage, archive management, sample handling, study operations, and project documentation readiness.",
    image: "/images/pml/facilities/photos/pml-facility-photo-11.png",
    href: "/facilities/supporting-facilities",
    cta: "Explore Supporting Facilities",
  },
  {
    eyebrow: "Facility Experience",
    title: "Explore PML facilities through the VR Gallery",
    description:
      "Access the facility experience and visual references through PML’s VR Gallery for a clearer view of selected facility areas.",
    image: "/images/pml/facilities/photos/pml-facility-photo-18.png",
    href: "/facilities/vr-gallery",
    cta: "Open VR Gallery",
  },
];

const facilityHeroSlidesId = [
  {
    eyebrow: "Dukungan Studi Klinis",
    title: "Fasilitas klinis untuk pelaksanaan studi yang andal",
    description:
      "Jelajahi fasilitas klinis PML yang dirancang untuk mendukung aktivitas studi terkontrol, koordinasi relawan, screening, area makan, dan dukungan medis.",
    image: "/images/pml/facilities/photos/pml-facility-photo-01.png",
    href: "/facilities/clinical-facilities",
    cta: "Jelajahi Fasilitas Klinis",
  },
  {
    eyebrow: "Kapabilitas Laboratorium",
    title: "Fasilitas analitik untuk pengujian dan bioanalisis",
    description:
      "Temukan kapabilitas laboratorium analitik yang didukung instrumen dan alur kerja untuk bioanalisis, analisis kontrak, pengujian produk, dokumentasi, dan pelaporan.",
    image: "/images/pml/facilities/photos/pml-facility-photo-17.png",
    href: "/facilities/analytical-facilities",
    cta: "Jelajahi Fasilitas Analitik",
  },
  {
    eyebrow: "Dukungan Operasional",
    title: "Fasilitas pendukung untuk alur proyek yang lengkap",
    description:
      "Tinjau infrastruktur pendukung untuk penyimpanan obat, pengelolaan arsip, penanganan sampel, operasional studi, dan kesiapan dokumentasi proyek.",
    image: "/images/pml/facilities/photos/pml-facility-photo-11.png",
    href: "/facilities/supporting-facilities",
    cta: "Jelajahi Fasilitas Pendukung",
  },
  {
    eyebrow: "Pengalaman Fasilitas",
    title: "Jelajahi fasilitas PML melalui Galeri VR",
    description:
      "Akses pengalaman fasilitas dan referensi visual melalui Galeri VR PML untuk melihat area fasilitas terpilih dengan lebih jelas.",
    image: "/images/pml/facilities/photos/pml-facility-photo-18.png",
    href: "/facilities/vr-gallery",
    cta: "Buka Galeri VR",
  },
];

export default function FacilitiesPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isIndonesian = locale === "id";

  const t = (english: string, indonesian: string) =>
    isIndonesian ? indonesian : english;

  const facilityHeroSlides = isIndonesian
    ? facilityHeroSlidesId
    : facilityHeroSlidesEn;

  const [activeSlide, setActiveSlide] = useState(0);
  const currentSlide = facilityHeroSlides[activeSlide];

  const openProposal = () => {
    window.dispatchEvent(new CustomEvent("open-proposal-modal"));
  };

  const goToPreviousSlide = () => {
    setActiveSlide((current) =>
      current === 0 ? facilityHeroSlides.length - 1 : current - 1,
    );
  };

  const goToNextSlide = () => {
    setActiveSlide((current) =>
      current === facilityHeroSlides.length - 1 ? 0 : current + 1,
    );
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) =>
        current === facilityHeroSlides.length - 1 ? 0 : current + 1,
      );
    }, 6000);

    return () => window.clearInterval(timer);
  }, [facilityHeroSlides.length]);

  return (
    <main>
      <section className="relative overflow-hidden bg-black text-white">
        {facilityHeroSlides.map((slide, index) => (
          <Image
            key={slide.title}
            src={slide.image}
            alt=""
            fill
            priority={index === 0}
            className={`object-cover transition duration-700 ${
              activeSlide === index ? "opacity-80" : "opacity-0"
            }`}
          />
        ))}

        <div className="absolute inset-0 bg-[#039147]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/94 via-white/68 to-[#039147]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent" />
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
            <span className="text-[#039147]">
              {t("Facilities", "Fasilitas")}
            </span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1fr_0.46fr] lg:items-end">
            <div className="max-w-4xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-[#039147]/20 bg-white/95 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#039147] shadow-sm backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[#039147]" />
                {currentSlide.eyebrow}
              </p>

              <h1 className="mt-6 max-w-5xl text-4xl font-black leading-[1.04] tracking-tight text-black md:text-6xl lg:text-[68px]">
                {currentSlide.title}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-black/68 md:text-lg">
                {currentSlide.description}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={localizeHref(currentSlide.href, locale)}
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-extrabold text-[#039147] shadow-xl transition hover:-translate-y-0.5"
                >
                  {currentSlide.cta}
                </Link>

                <button
                  type="button"
                  onClick={openProposal}
                  className="inline-flex items-center justify-center rounded-full border border-[#039147]/20 bg-white px-7 py-4 text-sm font-extrabold text-[#039147] shadow-xl backdrop-blur transition hover:-translate-y-0.5 hover:bg-[#039147] hover:text-white"
                >
                  {t("Request a Proposal", "Ajukan Proposal")}
                </button>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/35 bg-white/70 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl md:rounded-[36px] md:p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#039147]">
                {t("Facility Highlight", "Sorotan Fasilitas")}
              </p>

              <div className="mt-5 grid gap-3">
                {facilityHeroSlides.map((slide, index) => (
                  <button
                    key={slide.title}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      activeSlide === index
                        ? "border-[#039147]/20 bg-[#039147] text-white shadow-[0_16px_40px_rgba(3,145,71,0.18)]"
                        : "border-black/5 bg-white/75 text-black/62 hover:bg-white hover:text-[#039147]"
                    }`}
                  >
                    <span
                      className={`block text-[11px] font-black uppercase tracking-[0.14em] ${
                        activeSlide === index
                          ? "text-white/70"
                          : "text-[#039147]"
                      }`}
                    >
                      0{index + 1}
                    </span>
                    <span className="mt-1 block text-sm font-black leading-tight">
                      {slide.eyebrow}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={goToPreviousSlide}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl font-black text-[#039147] shadow-xl transition hover:-translate-y-0.5 hover:bg-[#039147] hover:text-white"
              aria-label={t(
                "Previous facility slide",
                "Slide fasilitas sebelumnya",
              )}
            >
              ←
            </button>

            <button
              type="button"
              onClick={goToNextSlide}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl font-black text-[#039147] shadow-xl transition hover:-translate-y-0.5 hover:bg-[#039147] hover:text-white"
              aria-label={t(
                "Next facility slide",
                "Slide fasilitas berikutnya",
              )}
            >
              →
            </button>

            <div className="ml-1 flex items-center gap-2">
              {facilityHeroSlides.map((slide, index) => (
                <button
                  key={`${slide.title}-dot`}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  className={`h-2.5 rounded-full transition ${
                    activeSlide === index
                      ? "w-9 bg-[#039147]"
                      : "w-2.5 bg-black/18 hover:bg-[#039147]/60"
                  }`}
                  aria-label={`${t(
                    "Go to",
                    "Buka",
                  )} ${slide.eyebrow} ${t("slide", "slide")}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div id="facilities-list">
        <FacilityCardGrid />
      </div>

      <section className="bg-white py-16 md:py-28">
        <div className="pml-container grid gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#039147] md:text-sm">
              {t("Facility Trust", "Keandalan Fasilitas")}
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
              {t(
                "Built for reliable study execution and laboratory support",
                "Dirancang untuk pelaksanaan studi dan dukungan laboratorium yang andal",
              )}
            </h2>

            <p className="mt-5 text-base leading-8 text-black/65 md:mt-6 md:text-lg md:leading-9">
              {t(
                "PML facilities are designed to support clinical conduct, sample handling, analytical work, study documentation, and project coordination. This gives sponsors a clearer operational foundation from early discussion to final reporting.",
                "Fasilitas PML dirancang untuk mendukung pelaksanaan klinis, penanganan sampel, pekerjaan analitik, dokumentasi studi, dan koordinasi proyek. Hal ini memberikan landasan operasional yang lebih jelas bagi sponsor sejak diskusi awal hingga pelaporan akhir.",
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-4">
            {[
              t(
                "Clinical facility and volunteer coordination",
                "Fasilitas klinis dan koordinasi relawan",
              ),
              t(
                "Analytical laboratory capability",
                "Kapabilitas laboratorium analitik",
              ),
              t(
                "Drug storage and archive support",
                "Dukungan penyimpanan obat dan arsip",
              ),
              t("Sample handling workflow", "Alur penanganan sampel"),
              t("Regulatory-ready documentation", "Dokumentasi siap regulasi"),
              t(
                "VR Gallery facility experience",
                "Pengalaman fasilitas melalui Galeri VR",
              ),
            ].map((item) => (
              <div
                key={item}
                className="rounded-[20px] border border-black/5 bg-white p-4 shadow-sm md:rounded-[24px] md:p-5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf8f0] text-sm font-black text-[#039147]">
                  ✓
                </span>
                <p className="mt-3 text-base font-bold leading-7 text-black/65 md:mt-4 md:text-base md:leading-7">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white pb-20 md:pb-32">
        <div className="pml-container">
          <div className="relative overflow-hidden rounded-[30px] bg-black px-6 py-14 text-center text-black shadow-[0_28px_90px_rgba(0,0,0,0.18)] md:rounded-[36px] md:px-14 md:py-20">
            <Image
              src="/images/pml/facilities/photos/pml-facility-photo-17.png"
              alt=""
              fill
              className="object-cover opacity-52"
            />
            <div className="absolute inset-0 bg-white/38" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/78 via-white/46 to-[#039147]/10" />
            <div className="pml-hex-pattern-light absolute inset-0 opacity-[0.10]" />

            <div className="relative mx-auto max-w-3xl">
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
                {t("Facility Discussion", "Diskusi Fasilitas")}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight md:text-[52px] text-black">
                {t(
                  "Need to understand PML facility capability?",
                  "Perlu memahami kapabilitas fasilitas PML?",
                )}
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-black/72">
                {t(
                  "Share your study, testing, or facility-related questions with our team and we will help identify the right support and next steps.",
                  "Sampaikan pertanyaan terkait studi, pengujian, atau fasilitas kepada tim kami dan kami akan membantu menentukan dukungan serta langkah berikutnya yang tepat.",
                )}
              </p>

              <button
                type="button"
                onClick={openProposal}
                className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-extrabold text-[#039147] shadow-xl transition hover:-translate-y-0.5"
              >
                {t("Request a Proposal", "Ajukan Proposal")}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
