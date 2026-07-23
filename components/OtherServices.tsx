"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { getOtherServices, ServiceKey } from "@/data/services";
import { getLocaleFromPathname, localizeHref } from "@/i18n/client";

type OtherServicesProps = {
  current?: ServiceKey | null;
  variant?: "three" | "four";
};

const indonesianServices: Record<
  string,
  {
    title: string;
    summary: string;
  }
> = {
  "/services/contract-analysis": {
    title: "Analisis Kontrak",
    summary:
      "Dukungan pengujian analitik yang andal untuk kualitas produk, keamanan, kepatuhan, dan kebutuhan dokumentasi.",
  },
  "/services/babe-studies": {
    title: "Studi BA/BE",
    summary:
      "Dukungan studi bioavailabilitas dan bioekuivalensi secara menyeluruh, mulai dari pelaksanaan klinis dan bioanalisis hingga pelaporan yang siap untuk kebutuhan regulasi.",
  },
  "/services/clinical-trial": {
    title: "Uji Klinis",
    summary:
      "Dukungan riset klinis mulai dari perencanaan studi, koordinasi regulasi, pengelolaan lokasi, monitoring, hingga penulisan medis.",
  },
  "/services/regulatory-consultation": {
    title: "Manajemen Regulasi",
    summary:
      "Dukungan manajemen regulasi untuk registrasi produk, dokumen ACTD, kepatuhan, dan kesiapan proses pengajuan.",
  },
};

export default function OtherServices({
  current = null,
  variant = "three",
}: OtherServicesProps) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isIndonesian = locale === "id";

  const services = getOtherServices(current);

  const desktopGrid =
    variant === "four" ? "md:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-3";

  return (
    <section className="bg-white py-16 md:py-28">
      <div className="pml-container">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#039147] md:text-sm">
            {isIndonesian ? "Layanan Lainnya" : "Other Services"}
          </p>

          <h2 className="mt-4 text-3xl font-black leading-tight text-black md:text-5xl">
            {isIndonesian
              ? "Jelajahi layanan CRO lainnya dari PML"
              : "Explore other CRO services from PML"}
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-black/62 md:mt-6 md:text-lg">
            {isIndonesian
              ? "Temukan layanan terkait yang dapat mendukung kebutuhan studi, pengujian, regulasi, dan pengembangan farmasi Anda."
              : "Discover related services that can support your study, testing, regulatory, and pharmaceutical development needs."}
          </p>
        </div>

        <div
          className={`-mx-4 mt-10 flex snap-x gap-4 overflow-x-auto px-4 pb-5 md:mx-0 md:mt-12 md:grid ${desktopGrid} md:gap-6 md:overflow-visible md:px-0 md:pb-0`}
        >
          {services.map((service) => {
            const translated = indonesianServices[service.href];

            const title =
              isIndonesian && translated ? translated.title : service.title;

            const summary =
              isIndonesian && translated ? translated.summary : service.summary;

            return (
              <Link
                key={service.key}
                href={localizeHref(service.href, locale)}
                className="group flex w-[78vw] max-w-[320px] shrink-0 snap-start flex-col overflow-hidden rounded-[30px] border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.12)] md:w-auto md:max-w-none md:rounded-[34px]"
              >
                <div className="relative h-44 overflow-hidden bg-[#eaf8f0] md:h-56">
                  <Image
                    src={service.image}
                    alt={title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                  <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg md:bottom-5 md:left-5">
                    <Image src={service.icon} alt="" width={24} height={24} />
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6 md:p-7">
                  <h3 className="text-xl font-black leading-tight text-black transition group-hover:text-[#039147] md:text-2xl">
                    {title}
                  </h3>

                  <p className="mt-4 text-base leading-7 text-black/62 md:leading-8">
                    {summary}
                  </p>

                  <span className="mt-auto inline-flex items-center pt-6 text-base font-extrabold text-[#039147]">
                    {isIndonesian ? "Pelajari lebih lanjut" : "Learn more"}

                    <span className="ml-2 transition group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <p className="mt-1 text-center text-xs font-bold text-black/40 md:hidden">
          {isIndonesian
            ? "Geser untuk melihat layanan lainnya"
            : "Swipe to explore other services"}
        </p>
      </div>
    </section>
  );
}
