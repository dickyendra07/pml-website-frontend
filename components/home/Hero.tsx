"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { getLocaleFromPathname, localizeHref } from "@/i18n/client";

const slidesByLocale = {
  en: [
    {
      eyebrow: "CRO Services",
      title: "Your Partner for End-to-End Clinical Research Success",
      description:
        "PML supports pharmaceutical, biotechnology, medical device, food, beverage, and healthcare companies with integrated CRO services, from contract analysis, BA/BE study, and clinical trial to regulatory management.",
      primary: "Request a Proposal",
      secondary: "Explore Our Services",
      secondaryHref: "#services",
      image: "/images/pml/hero-lab-hexagon.png",
    },
    {
      eyebrow: "BA/BE Study",
      title: "End-to-End BA/BE Study Support You Can Rely On",
      description:
        "PML supports end-to-end bioavailability and bioequivalence studies, from clinical conduct and bioanalysis to regulatory-ready reporting.",
      primary: "Request a Proposal",
      secondary: "Explore BA/BE Study",
      secondaryHref: "/services/babe-studies",
      image: "/images/pml/hero/hero-babe-studies.png",
    },
    {
      eyebrow: "Clinical Trial",
      title: "Clinical Trial Support Across the Entire Study Journey",
      description:
        "From study planning and site coordination to monitoring, data management, and regulatory support, PML helps sponsors execute clinical research with reliable local expertise.",
      primary: "Request a Proposal",
      secondary: "Explore Clinical Trial",
      secondaryHref: "/services/clinical-trial",
      image: "/images/pml/hero/hero-clinical-trials.png",
    },
  ],
  id: [
    {
      eyebrow: "Layanan CRO",
      title: "Mitra Anda untuk Keberhasilan Riset Klinis Menyeluruh",
      description:
        "PML mendukung perusahaan farmasi, bioteknologi, alat kesehatan, makanan, minuman, dan layanan kesehatan melalui layanan CRO terintegrasi, mulai dari analisis kontrak, studi BA/BE, dan uji klinis hingga manajemen regulasi.",
      primary: "Ajukan Proposal",
      secondary: "Jelajahi Layanan Kami",
      secondaryHref: "#services",
      image: "/images/pml/hero-lab-hexagon.png",
    },
    {
      eyebrow: "Studi BA/BE",
      title: "Dukungan Studi BA/BE Menyeluruh yang Dapat Diandalkan",
      description:
        "PML mendukung studi bioavailabilitas dan bioekuivalensi secara menyeluruh, mulai dari pelaksanaan klinis dan bioanalisis hingga laporan yang siap untuk kebutuhan regulasi.",
      primary: "Ajukan Proposal",
      secondary: "Pelajari Studi BA/BE",
      secondaryHref: "/services/babe-studies",
      image: "/images/pml/hero/hero-babe-studies.png",
    },
    {
      eyebrow: "Uji Klinis",
      title: "Dukungan Uji Klinis di Setiap Tahap Penelitian",
      description:
        "Mulai dari perencanaan studi dan koordinasi lokasi hingga monitoring, pengelolaan data, dan dukungan regulasi, PML membantu sponsor menjalankan riset klinis dengan keahlian lokal yang andal.",
      primary: "Ajukan Proposal",
      secondary: "Pelajari Uji Klinis",
      secondaryHref: "/services/clinical-trial",
      image: "/images/pml/hero/hero-clinical-trials.png",
    },
  ],
} as const;

export default function Hero() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const slides = slidesByLocale[locale];

  const [activeIndex, setActiveIndex] = useState(0);

  const activeSlide = useMemo(
    () => slides[activeIndex] ?? slides[0],
    [activeIndex, slides],
  );

  const openProposal = () => {
    window.dispatchEvent(new CustomEvent("open-proposal-modal"));
  };

  const goToSlide = (index: number) => {
    setActiveIndex((index + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 10000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="pml-home-hero relative min-h-[calc(100vh-80px)] overflow-hidden bg-white">
      <div className="pml-home-hero-stage relative min-h-[calc(100vh-80px)]">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;

          return (
            <article
              key={`${locale}-${slide.title}`}
              className={`pml-home-hero-slide absolute inset-0 min-h-[calc(100vh-80px)] transition-opacity duration-700 ${
                isActive ? "z-10 opacity-100" : "z-0 opacity-0"
              }`}
              aria-hidden={!isActive}
            >
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  priority={index === 0}
                  className={`object-cover opacity-90 transition-transform duration-[9000ms] ${
                    isActive ? "scale-105" : "scale-100"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/96 via-white/78 to-white/20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_38%,rgba(3,145,71,0.18),transparent_34%),radial-gradient(circle_at_18%_70%,rgba(255,40,0,0.055),transparent_28%)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-white/65 via-transparent to-white/20" />
                <div className="pml-hex-pattern absolute inset-0 opacity-[0.075]" />
              </div>

              <div className="pml-home-hero-content pml-container relative flex min-h-[calc(100vh-80px)] items-center py-20">
                <div
                  className={`max-w-4xl transition duration-700 ${
                    isActive
                      ? "translate-y-0 opacity-100"
                      : "translate-y-5 opacity-0"
                  }`}
                >
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-black/70 shadow-sm backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-[#039147]" />
                    {slide.eyebrow}
                  </div>

                  <h1 className="pml-home-hero-title max-w-5xl text-4xl font-black leading-[1.04] tracking-tight text-black md:text-5xl lg:text-[54px] xl:text-[60px]">
                    {slide.title}
                  </h1>

                  <p className="pml-home-hero-description mt-6 max-w-2xl text-base leading-7 text-black/66 md:text-lg">
                    {slide.description}
                  </p>

                  <div className="pml-home-hero-actions mt-9 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={openProposal}
                      className="inline-flex items-center justify-center rounded-full bg-[#039147] px-7 py-3.5 text-sm font-extrabold text-white shadow-[0_18px_44px_rgba(3,145,71,0.22)] transition hover:-translate-y-0.5 hover:bg-[#027a3c] hover:shadow-xl"
                    >
                      {slide.primary}
                    </button>

                    <Link
                      href={localizeHref(slide.secondaryHref, locale)}
                      className="inline-flex items-center justify-center rounded-full border border-[#039147]/25 bg-white/70 px-7 py-3.5 text-sm font-extrabold text-[#039147] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-[#039147] hover:text-white"
                    >
                      {slide.secondary}
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        <button
          type="button"
          onClick={() => goToSlide(activeIndex - 1)}
          className="absolute left-5 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/75 text-2xl font-light text-[#039147] shadow-sm backdrop-blur transition hover:bg-[#039147] hover:text-white md:flex"
          aria-label={
            locale === "id" ? "Slide sebelumnya" : "Previous hero slide"
          }
        >
          ‹
        </button>

        <button
          type="button"
          onClick={() => goToSlide(activeIndex + 1)}
          className="absolute right-5 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/75 text-2xl font-light text-[#039147] shadow-sm backdrop-blur transition hover:bg-[#039147] hover:text-white md:flex"
          aria-label={locale === "id" ? "Slide berikutnya" : "Next hero slide"}
        >
          ›
        </button>

        <div className="absolute bottom-9 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
          {slides.map((slide, index) => (
            <button
              key={`${locale}-${slide.title}`}
              type="button"
              onClick={() => goToSlide(index)}
              className={`h-2.5 rounded-full transition ${
                index === activeIndex ? "w-8 bg-[#039147]" : "w-2.5 bg-white/50"
              }`}
              aria-label={
                locale === "id"
                  ? `Buka slide ${index + 1}`
                  : `Go to hero slide ${index + 1}`
              }
              aria-current={index === activeIndex}
            />
          ))}
        </div>
      </div>

      <span className="sr-only">{activeSlide.title}</span>
    </section>
  );
}
