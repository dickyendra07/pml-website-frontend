"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { facilities, type FacilityKey } from "@/data/facilities";
import { getLocaleFromPathname, localizeHref } from "@/i18n/client";

const facilityTranslationsId: Record<
  FacilityKey,
  {
    title: string;
    eyebrow: string;
    summary: string;
  }
> = {
  "clinical-facilities": {
    title: "Fasilitas Klinis",
    eyebrow: "Dukungan Studi Klinis",
    summary:
      "Dukungan fasilitas klinis untuk aktivitas studi terkontrol, termasuk kapasitas 70 tempat tidur, area screening dan dosing, staf penelitian klinis berpengalaman, serta dukungan medis 24 jam.",
  },
  "analytical-facilities": {
    title: "Fasilitas Analitik",
    eyebrow: "Kapabilitas Laboratorium",
    summary:
      "Kapabilitas laboratorium analitik yang didukung instrumen dan alur kerja untuk bioanalisis, analisis kontrak, pengujian produk, dokumentasi, dan pelaporan siap regulasi.",
  },
  "supporting-facilities": {
    title: "Fasilitas Pendukung",
    eyebrow: "Dukungan Operasional",
    summary:
      "Infrastruktur fasilitas pendukung untuk operasional studi dan laboratorium yang andal, termasuk penyimpanan obat, ruang arsip, penanganan sampel, dan dukungan operasional studi.",
  },
  "vr-gallery": {
    title: "Galeri VR",
    eyebrow: "Pengalaman Fasilitas",
    summary:
      "Pengalaman fasilitas interaktif yang memungkinkan pengunjung dan sponsor menjelajahi visual fasilitas PML melalui tur resmi Galeri VR.",
  },
};

export default function FacilityCardGrid() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isIndonesian = locale === "id";

  const t = (english: string, indonesian: string) =>
    isIndonesian ? indonesian : english;

  const localizedFacilities = facilities.map((facility) => {
    const translation = facilityTranslationsId[facility.key];

    return {
      ...facility,
      title: isIndonesian ? translation.title : facility.title,
      eyebrow: isIndonesian ? translation.eyebrow : facility.eyebrow,
      summary: isIndonesian ? translation.summary : facility.summary,
    };
  });

  return (
    <section className="bg-[#eaf8f0] py-20 md:py-28">
      <div className="pml-container">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
            {t("Facilities Overview", "Ringkasan Fasilitas")}
          </p>

          <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
            {t(
              "Integrated facilities for clinical, analytical, and operational needs",
              "Fasilitas terintegrasi untuk kebutuhan klinis, analitik, dan operasional",
            )}
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-black/65">
            {t(
              "PML supports reliable CRO delivery through clinical facilities, analytical laboratory capability, supporting infrastructure, and facility experience access through VR Gallery.",
              "PML mendukung pelaksanaan layanan CRO yang andal melalui fasilitas klinis, kapabilitas laboratorium analitik, infrastruktur pendukung, serta akses pengalaman fasilitas melalui Galeri VR.",
            )}
          </p>
        </div>

        <div className="-mx-4 mt-10 flex snap-x gap-4 overflow-x-auto px-4 pb-5 md:mx-0 md:mt-12 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
          {localizedFacilities.map((facility) => (
            <Link
              key={facility.key}
              href={localizeHref(facility.href, locale)}
              className="group w-[82vw] max-w-[340px] shrink-0 snap-start overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.12)] md:w-auto md:max-w-none md:rounded-[34px]"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-black">
                <Image
                  src={facility.image}
                  alt={facility.title}
                  fill
                  className="object-cover opacity-85 transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#039147] backdrop-blur">
                  {facility.eyebrow}
                </div>
              </div>

              <div className="p-6 md:p-8">
                <h3 className="text-xl font-black leading-tight text-black transition group-hover:text-[#039147] md:text-2xl">
                  {facility.title}
                </h3>

                <p className="mt-4 text-base leading-7 text-black/60 md:leading-8">
                  {facility.summary}
                </p>

                <span className="mt-7 inline-flex items-center text-sm font-extrabold text-[#039147]">
                  {t("Explore facility", "Jelajahi fasilitas")}
                  <span className="ml-2 transition group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-1 text-center text-xs font-bold text-black/40 md:hidden">
          {t(
            "Swipe to explore facilities",
            "Geser untuk menjelajahi fasilitas",
          )}
        </p>
      </div>
    </section>
  );
}
