"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import SectionHeader from "@/components/ui/SectionHeader";
import { services } from "@/data/services";
import { getLocaleFromPathname, localizeHref } from "@/i18n/client";

const indonesianServiceContent: Record<
  string,
  {
    title: string;
    summary: string;
  }
> = {
  "/services/contract-analysis": {
    title: "Analisis Kontrak",
    summary:
      "Dukungan pengujian analitik untuk membantu memenuhi kebutuhan kualitas produk, keamanan, kepatuhan, dan dokumentasi.",
  },
  "/services/babe-studies": {
    title: "Studi BA/BE",
    summary:
      "Dukungan studi bioavailabilitas dan bioekuivalensi secara menyeluruh, mulai dari pelaksanaan klinis dan bioanalisis hingga laporan yang siap untuk kebutuhan regulasi.",
  },
  "/services/clinical-trial": {
    title: "Uji Klinis",
    summary:
      "Dukungan riset klinis dengan keahlian lokal, jaringan rumah sakit, investigator, serta koordinasi studi yang terstruktur dan andal.",
  },
  "/services/regulatory-consultation": {
    title: "Manajemen Regulasi",
    summary:
      "Dukungan manajemen regulasi untuk registrasi produk, dokumen ACTD, kepatuhan, dan kesiapan proses pengajuan.",
  },
};

export default function Services() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isIndonesian = locale === "id";

  return (
    <section id="services" className="bg-[#eaf8f0] py-16 md:py-28">
      <div className="pml-container">
        <SectionHeader
          align="center"
          eyebrow={isIndonesian ? "Layanan" : "Services"}
          title={
            isIndonesian
              ? "Layanan CRO Terintegrasi untuk Pengembangan Farmasi"
              : "Integrated CRO Services for Pharmaceutical Development"
          }
          description={
            isIndonesian
              ? "Mulai dari studi BA/BE dan uji klinis hingga analisis kontrak dan manajemen regulasi, PML menyediakan dukungan CRO terintegrasi untuk perusahaan farmasi, bioteknologi, layanan kesehatan, makanan, minuman, kosmetik, dan alat kesehatan."
              : "From BA/BE study and clinical trials to contract analysis and regulatory management, PML provides integrated CRO support for pharmaceutical, biotechnology, healthcare, food, beverage, cosmetic, and medical device companies."
          }
        />

        <div className="-mx-4 mt-10 flex snap-x gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:mt-14 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-4 xl:gap-6">
          {services.map((service) => {
            const translated = indonesianServiceContent[service.href];
            const title =
              isIndonesian && translated ? translated.title : service.title;
            const summary =
              isIndonesian && translated ? translated.summary : service.summary;

            return (
              <article
                key={service.key}
                className="group flex h-full min-w-[82%] snap-start flex-col rounded-[28px] border border-black/5 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.12)] sm:min-w-[48%] md:min-w-0 md:rounded-[34px] md:p-7"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf8f0] transition group-hover:bg-[#039147] md:h-16 md:w-16">
                  <Image
                    src={service.icon}
                    alt=""
                    width={32}
                    height={32}
                    className="transition duration-300 group-hover:brightness-0 group-hover:invert"
                  />
                </div>

                <h3 className="mt-6 text-xl font-black leading-tight text-black md:mt-7 md:text-2xl">
                  {title}
                </h3>

                <p className="mt-4 line-clamp-4 text-[17px] leading-8 text-black/68 md:mt-5 md:text-[19px] md:leading-9">
                  {summary}
                </p>

                <Link
                  href={localizeHref(service.href, locale)}
                  className="mt-auto inline-flex items-center pt-6 text-base font-extrabold text-[#039147] md:pt-7"
                >
                  {isIndonesian ? "Pelajari lebih lanjut" : "Learn more"}
                  <span className="ml-2 transition group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </article>
            );
          })}
        </div>

        <p className="mt-2 text-center text-xs font-bold text-black/40 md:hidden">
          {isIndonesian
            ? "Geser untuk menjelajahi layanan"
            : "Swipe to explore services"}
        </p>
      </div>
    </section>
  );
}
