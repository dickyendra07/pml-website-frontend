"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { services, type ServiceKey } from "@/data/services";
import { getLocaleFromPathname, localizeHref } from "@/i18n/client";

const serviceTranslationsId: Record<
  ServiceKey,
  {
    title: string;
    summary: string;
  }
> = {
  "contract-analysis": {
    title: "Analisis Kontrak",
    summary:
      "Dukungan pengujian analitik yang andal untuk kebutuhan mutu produk, keamanan, kepatuhan, dan dokumentasi.",
  },
  babe: {
    title: "Studi BA/BE",
    summary:
      "Dukungan studi bioavailabilitas dan bioekuivalensi secara menyeluruh, mulai dari pelaksanaan klinis dan bioanalisis hingga pelaporan yang siap untuk kebutuhan regulasi.",
  },
  "clinical-trial": {
    title: "Uji Klinis",
    summary:
      "Dukungan penelitian klinis yang mencakup perencanaan studi, koordinasi regulasi, manajemen lokasi, monitoring, dan penulisan medis.",
  },
  "regulatory-consultation": {
    title: "Manajemen Regulasi",
    summary:
      "Dukungan manajemen regulasi untuk registrasi produk, dokumen ACTD, kepatuhan, dan kesiapan pengajuan.",
  },
};

export default function ServicesPageClient() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isIndonesian = locale === "id";

  const t = (english: string, indonesian: string) =>
    isIndonesian ? indonesian : english;

  const localizedServices = services.map((service) => {
    const translation = serviceTranslationsId[service.key];

    return {
      ...service,
      title: isIndonesian ? translation.title : service.title,
      summary: isIndonesian ? translation.summary : service.summary,
    };
  });

  const openProposal = () => {
    window.dispatchEvent(new CustomEvent("open-proposal-modal"));
  };

  return (
    <main>
      <section className="relative overflow-hidden bg-white text-black">
        <Image
          src="/images/pml/services/contract-analysis-cta.png"
          alt=""
          fill
          priority
          className="object-cover opacity-90"
        />

        <div
          className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/68 to-white/24"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_72%_34%,rgba(3,145,71,0.22),transparent_34%),radial-gradient(circle_at_18%_72%,rgba(255,40,0,0.055),transparent_28%)]"
          aria-hidden="true"
        />

        <svg
          className="absolute right-[-90px] top-12 h-[460px] w-[460px] text-[#039147]/18"
          viewBox="0 0 460 460"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M230 24L407 126V334L230 436L53 334V126L230 24Z"
            stroke="currentColor"
            strokeWidth="4"
          />
        </svg>

        <svg
          className="absolute right-[120px] bottom-[-90px] h-[260px] w-[260px] text-[#039147]/10"
          viewBox="0 0 260 260"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M130 14L230 72V188L130 246L30 188V72L130 14Z"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>

        <svg
          className="absolute left-[-120px] bottom-[-110px] h-[320px] w-[320px] text-[#FF2800]/10"
          viewBox="0 0 320 320"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M160 18L284 89V231L160 302L36 231V89L160 18Z"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>

        <div className="pml-container relative flex min-h-[520px] flex-col justify-center py-14 md:min-h-[620px] md:py-32">
          <nav
            className="mb-7 flex flex-wrap items-center gap-2 text-xs font-bold text-black/55 md:mb-10 md:text-sm"
            aria-label="Breadcrumb"
          >
            <Link
              href={localizeHref("/", locale)}
              className="transition hover:text-[#039147]"
            >
              {t("Home", "Beranda")}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#039147]">{t("Services", "Layanan")}</span>
          </nav>

          <div className="max-w-4xl text-left">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#039147]/15 bg-white/82 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#039147] shadow-sm backdrop-blur md:text-xs">
              <span className="h-2 w-2 rounded-full bg-[#039147]" />
              {t("CRO Services", "Layanan CRO")}
            </p>

            <h1 className="mt-5 max-w-5xl text-4xl font-black leading-[1.02] tracking-tight text-black md:mt-6 md:text-6xl lg:text-[68px]">
              {t(
                "Integrated CRO services for pharmaceutical development",
                "Layanan CRO terintegrasi untuk pengembangan produk farmasi",
              )}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-black/70 md:mt-6 md:text-lg md:leading-8">
              {t(
                "Explore PML services across bioequivalence studies, clinical research support, analytical testing, and regulatory management.",
                "Jelajahi layanan PML yang mencakup studi bioekuivalensi, dukungan penelitian klinis, pengujian analitik, dan manajemen regulasi.",
              )}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row md:mt-8">
              <a
                href="#services-list"
                className="inline-flex items-center justify-center rounded-full bg-[#039147] px-7 py-3.5 text-base font-extrabold text-white shadow-[0_18px_44px_rgba(3,145,71,0.22)] transition hover:-translate-y-0.5 hover:bg-[#027a3c] md:py-4"
              >
                {t("Explore Services", "Jelajahi Layanan")}
              </a>

              <button
                type="button"
                onClick={openProposal}
                className="inline-flex items-center justify-center rounded-full border border-[#039147]/25 bg-white/78 px-7 py-3.5 text-base font-extrabold text-[#039147] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-[#039147] hover:text-white md:py-4"
              >
                {t("Request a Proposal", "Ajukan Proposal")}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="services-list" className="bg-white py-16 md:py-28">
        <div className="pml-container">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#039147] md:text-sm">
              {t("Service Overview", "Ringkasan Layanan")}
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
              {t(
                "Choose the service that fits your project needs",
                "Pilih layanan yang sesuai dengan kebutuhan proyek Anda",
              )}
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-[17px] leading-8 text-black/68 md:text-[19px] md:leading-9 md:mt-6 md:text-lg md:leading-9">
              {t(
                "PML combines clinical, analytical, and regulatory capabilities to support study planning, reliable execution, laboratory analysis, and submission readiness.",
                "PML memadukan kapabilitas klinis, analitik, dan regulasi untuk mendukung perencanaan studi, pelaksanaan yang andal, analisis laboratorium, dan kesiapan pengajuan.",
              )}
            </p>
          </div>

          <div className="-mx-4 mt-10 flex snap-x gap-4 overflow-x-auto px-4 pb-5 md:mx-0 md:mt-12 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
            {localizedServices.map((service) => (
              <Link
                key={service.key}
                href={localizeHref(service.href, locale)}
                className="group flex w-[82vw] max-w-[360px] shrink-0 snap-start flex-col overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.12)] md:w-auto md:max-w-none md:rounded-[34px]"
              >
                <div className="relative h-52 overflow-hidden bg-[#eaf8f0] md:aspect-[16/9] md:h-auto">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                  <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#039147]/10 bg-white/95 text-[#039147] shadow-lg backdrop-blur transition group-hover:scale-105 group-hover:border-[#039147]/25 group-hover:bg-white md:bottom-5 md:left-5 md:h-14 md:w-14">
                    <Image src={service.icon} alt="" width={24} height={24} />
                  </div>

                  <div className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#039147] backdrop-blur md:hidden">
                    {t("Service", "Layanan")}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <h3 className="text-xl font-black leading-tight text-black transition group-hover:text-[#039147] md:text-2xl">
                    {service.title}
                  </h3>

                  <p className="mt-4 text-base leading-7 text-black/60 md:leading-8">
                    {service.summary}
                  </p>

                  <span className="mt-auto inline-flex items-center pt-6 text-base font-extrabold text-[#039147] md:pt-7">
                    {t("Learn more", "Pelajari lebih lanjut")}
                    <span
                      className="ml-2 transition group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <p className="mt-1 text-center text-xs font-bold text-black/40 md:hidden">
            {t(
              "Swipe to explore all services",
              "Geser untuk melihat seluruh layanan",
            )}
          </p>
        </div>
      </section>

      <section className="bg-white pb-20 md:pb-32">
        <div className="pml-container">
          <div className="relative overflow-hidden rounded-[30px] bg-black px-6 py-14 text-center text-white shadow-[0_28px_90px_rgba(0,0,0,0.18)] md:rounded-[36px] md:px-14 md:py-20">
            <Image
              src="/images/pml/services/contract-analysis-cta.png"
              alt=""
              fill
              className="object-cover opacity-[0.42]"
            />

            <div className="absolute inset-0 bg-white/58" aria-hidden="true" />
            <div
              className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/72 to-[#eaf8f0]/48"
              aria-hidden="true"
            />
            <div
              className="pml-hex-pattern-light absolute inset-0 opacity-[0.045]"
              aria-hidden="true"
            />

            <div className="relative mx-auto max-w-3xl">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/25 bg-white/90 shadow-lg backdrop-blur md:mb-7 md:h-16 md:w-16">
                <Image
                  src="/images/LOGO-PML.png"
                  alt="PML"
                  width={90}
                  height={48}
                  className="h-7 w-auto md:h-8"
                />
              </div>

              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#039147] md:text-sm">
                {t("Start a Project", "Mulai Proyek")}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.04em] text-black md:text-[52px]">
                {t(
                  "Need support for your next project?",
                  "Membutuhkan dukungan untuk proyek Anda berikutnya?",
                )}
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-[17px] font-medium leading-8 text-black/72 md:text-[19px] md:leading-9 md:text-[19px] md:leading-9">
                {t(
                  "Share your project needs with our team and we will help identify the right service scope, required information, and next steps.",
                  "Sampaikan kebutuhan proyek Anda kepada tim kami dan kami akan membantu menentukan ruang lingkup layanan, informasi yang diperlukan, dan langkah berikutnya.",
                )}
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={openProposal}
                  className="inline-flex items-center justify-center rounded-full bg-[#039147] px-8 py-3.5 text-base font-extrabold text-white shadow-[0_18px_44px_rgba(3,145,71,0.24)] transition hover:-translate-y-0.5 hover:bg-[#027a3d] md:py-4"
                >
                  {t("Request a Proposal", "Ajukan Proposal")}
                </button>

                <Link
                  href={localizeHref("/contact", locale)}
                  className="inline-flex items-center justify-center rounded-full border border-[#039147]/18 bg-white px-8 py-3.5 text-base font-extrabold text-[#039147] shadow-sm transition hover:-translate-y-0.5 hover:border-[#039147] hover:bg-[#f4fbf7] md:py-4"
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
