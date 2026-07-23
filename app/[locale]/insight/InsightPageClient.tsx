"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import InsightCard from "@/components/pages/InsightCard";
import { insightCategories, insightFaqs } from "@/data/insights";
import { getLocaleFromPathname, localizeHref } from "@/i18n/client";
import { getInsights, InsightItem } from "@/lib/api";

const categoryIcons: Record<string, string> = {
  articles: "01",
  news: "02",
  publications: "03",
  faq: "04",
};

const insightCategoryTranslationsId = {
  articles: {
    label: "Artikel",
    description:
      "Konten edukatif mengenai layanan CRO, studi BA/BE, uji klinis, dan pengembangan farmasi.",
  },
  news: {
    label: "Berita",
    description:
      "Informasi terbaru dari Pharma Metric Labs, aktivitas layanan, pembaruan fasilitas, dan pengumuman perusahaan.",
  },
  publications: {
    label: "Publikasi",
    description:
      "Referensi ilmiah, regulasi, dan dokumentasi untuk sponsor serta mitra.",
  },
  faq: {
    label: "FAQ",
    description:
      "Pertanyaan umum mengenai layanan PML, persiapan inquiry, diskusi studi, dan dukungan regulasi.",
  },
};

const insightFaqsId = [
  {
    question: "Layanan apa saja yang disediakan Pharma Metric Labs?",
    answer:
      "PML menyediakan layanan CRO terintegrasi, termasuk studi BA/BE, uji klinis, analisis kontrak, dan manajemen regulasi untuk industri farmasi serta industri terkait.",
  },
  {
    question: "Apakah PML dapat mendukung sponsor lokal maupun internasional?",
    answer:
      "Ya. PML mendukung sponsor lokal dan luar negeri yang membutuhkan dukungan klinis, analitik, regulasi, dan dokumentasi di Indonesia.",
  },
  {
    question: "Informasi apa yang perlu disiapkan sebelum mengajukan proposal?",
    answer:
      "Sponsor dapat menyiapkan informasi perusahaan, layanan yang dibutuhkan, latar belakang produk atau studi, jadwal, konteks regulasi, dan dokumen yang tersedia.",
  },
  {
    question: "Apakah PML menyediakan layanan manajemen regulasi?",
    answer:
      "Ya. PML menyediakan manajemen regulasi yang mencakup panduan berfokus BPOM, peninjauan dokumen, analisis kesenjangan dossier, persiapan ACTD, dan dukungan kesiapan pengajuan.",
  },
  {
    question: "Apakah fasilitas PML dapat dijelajahi secara online?",
    answer:
      "Ya. Pengunjung dapat menjelajahi visual fasilitas terpilih melalui Galeri VR dan halaman fasilitas pada website.",
  },
];

export default function InsightPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isIndonesian = locale === "id";

  const t = (english: string, indonesian: string) =>
    isIndonesian ? indonesian : english;

  const localizedCategories = insightCategories.map((category) => {
    if (!isIndonesian) {
      return category;
    }

    const translation = insightCategoryTranslationsId[category.category];

    return {
      ...category,
      label: translation.label,
      description: translation.description,
    };
  });

  const localizedFaqs = isIndonesian ? insightFaqsId : insightFaqs;

  const openProposal = () => {
    window.dispatchEvent(new CustomEvent("open-proposal-modal"));
  };

  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [insightStatus, setInsightStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  useEffect(() => {
    let isMounted = true;

    async function loadInsights() {
      try {
        const data = await getInsights();

        if (!isMounted) return;

        setInsights(data);
        setInsightStatus("success");
      } catch {
        if (!isMounted) return;

        setInsightStatus("error");
      }
    }

    void loadInsights();

    return () => {
      isMounted = false;
    };
  }, []);

  const featured = useMemo(() => {
    return insights.find((item) => item.isFeatured) || insights[0] || null;
  }, [insights]);

  const latest = useMemo(() => {
    return insights.filter((item) => item.id !== featured?.id).slice(0, 3);
  }, [insights, featured]);

  return (
    <main>
      <section className="relative overflow-hidden bg-white text-black">
        <Image
          src="/images/pml/facilities-gallery/analytical-main.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-42"
        />
        <div className="absolute inset-0 bg-white/66" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/94 via-white/70 to-[#039147]/18" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/54 via-transparent to-black/20" />
        <div className="pml-hex-pattern absolute inset-0 opacity-[0.055]" />

        <div className="pml-container relative py-20 md:py-32">
          <nav className="mb-10 flex flex-wrap items-center gap-2 text-sm font-bold text-black/62">
            <Link
              href={localizeHref("/", locale)}
              className="transition hover:text-black"
            >
              {t("Home", "Beranda")}
            </Link>
            <span>/</span>
            <span className="text-black">{t("Insight", "Insight")}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-12">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-black backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[#039147]" />
                {t("Insight & Resources", "Insight & Sumber Daya")}
              </p>

              <h1 className="mt-6 max-w-5xl text-4xl font-black leading-[1.04] tracking-tight text-black md:text-6xl lg:text-[72px]">
                {t(
                  "Educational resources for better project readiness",
                  "Sumber daya edukatif untuk kesiapan proyek yang lebih baik",
                )}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-black/75 md:text-lg">
                {t(
                  "Explore articles, news, publications, and frequently asked questions about PML services, CRO support, pharmaceutical development, and regulatory preparation.",
                  "Jelajahi artikel, berita, publikasi, dan pertanyaan umum mengenai layanan PML, dukungan CRO, pengembangan farmasi, dan persiapan regulasi.",
                )}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#insight-content"
                  className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-extrabold text-[#039147] shadow-xl"
                >
                  {t("Explore Resources", "Jelajahi Sumber Daya")}
                </a>

                <button
                  type="button"
                  onClick={openProposal}
                  className="inline-flex items-center justify-center rounded-full border border-[#039147]/20 bg-white px-7 py-4 text-sm font-extrabold text-[#039147] shadow-xl backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:text-[#039147]"
                >
                  {t("Request a Proposal", "Ajukan Proposal")}
                </button>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur-xl md:rounded-[34px] md:p-6">
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-black/62">
                {t("Resource Focus", "Fokus Sumber Daya")}
              </p>

              <div className="mt-5 grid gap-3 md:mt-6 md:gap-4">
                {[
                  [
                    t("CRO Service Education", "Edukasi Layanan CRO"),
                    t(
                      "Understand PML’s BA/BE, clinical, analytical, and regulatory support.",
                      "Pahami dukungan BA/BE, klinis, analitik, dan regulasi dari PML.",
                    ),
                  ],
                  [
                    t("Sponsor Preparation", "Persiapan Sponsor"),
                    t(
                      "Prepare better inquiries, documents, timelines, and project requirements.",
                      "Persiapkan inquiry, dokumen, jadwal, dan kebutuhan proyek dengan lebih baik.",
                    ),
                  ],
                  [
                    t(
                      "Facility & Company Updates",
                      "Pembaruan Fasilitas & Perusahaan",
                    ),
                    t(
                      "Follow PML facility capability and service-related updates.",
                      "Ikuti perkembangan kapabilitas fasilitas dan pembaruan layanan PML.",
                    ),
                  ],
                ].map(([title, desc]) => (
                  <div
                    key={title}
                    className="rounded-[20px] border border-black/5 bg-white/10 p-4 md:rounded-[24px] md:p-5"
                  >
                    <h3 className="text-base font-black text-black">{title}</h3>
                    <p className="mt-3 text-base leading-7 text-black/62">
                      {desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="insight-content" className="bg-[#eaf8f0] py-16 md:py-28">
        <div className="pml-container">
          <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:gap-10">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#039147] md:text-sm">
                {t("Resource Categories", "Kategori Sumber Daya")}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
                {t(
                  "Choose the resource type you need",
                  "Pilih jenis sumber daya yang Anda butuhkan",
                )}
              </h2>
            </div>

            <p className="max-w-3xl text-base leading-8 text-black/65 md:text-base md:leading-8 lg:justify-self-end">
              {t(
                "PML resources are organized to help sponsors understand services, prepare inquiries, follow company updates, and review technical or regulatory references.",
                "Sumber daya PML disusun untuk membantu sponsor memahami layanan, mempersiapkan inquiry, mengikuti pembaruan perusahaan, serta meninjau referensi teknis dan regulasi.",
              )}
            </p>
          </div>

          <div className="-mx-4 mt-10 flex snap-x gap-4 overflow-x-auto px-4 pb-5 md:mx-0 md:mt-12 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
            {localizedCategories.map((category) => (
              <Link
                key={category.href}
                href={localizeHref(category.href, locale)}
                className="group relative w-[78vw] max-w-[320px] shrink-0 snap-start overflow-hidden rounded-[26px] border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl md:w-auto md:max-w-none md:rounded-[32px] md:p-7"
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#039147]/10 transition group-hover:scale-125" />

                <div className="relative mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf8f0] text-sm font-black text-[#039147] transition group-hover:bg-[#039147] group-hover:text-black md:mb-8 md:h-14 md:w-14">
                  {categoryIcons[category.category]}
                </div>

                <h3 className="relative text-xl font-black leading-tight text-black md:text-2xl">
                  {category.label}
                </h3>

                <p className="relative mt-4 text-base leading-8 text-black/60">
                  {category.description}
                </p>

                <span className="relative mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-[#039147]">
                  {t("View", "Lihat")} {category.label}
                  <span className="transition group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>

          <p className="mt-1 text-center text-xs font-bold text-black/40 md:hidden">
            {t(
              "Swipe to explore resources",
              "Geser untuk menjelajahi sumber daya",
            )}
          </p>
        </div>
      </section>

      <section className="bg-white py-16 md:py-28">
        <div className="pml-container">
          <div className="mb-9 flex flex-col justify-between gap-5 md:mb-12 md:flex-row md:items-end md:gap-6">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
                {t("Featured Insight", "Insight Pilihan")}
              </p>

              <h2 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-black md:text-[52px]">
                {t(
                  "Practical content for sponsors and project teams",
                  "Konten praktis untuk sponsor dan tim proyek",
                )}
              </h2>
            </div>

            <Link
              href={localizeHref("/insight/articles", locale)}
              className="inline-flex w-fit items-center justify-center rounded-full border border-[#039147]/20 px-6 py-3 text-sm font-extrabold text-[#039147] transition hover:bg-[#039147] hover:text-white"
            >
              {t("View Articles", "Lihat Artikel")}
            </Link>
          </div>

          {insightStatus === "loading" ? (
            <div className="rounded-[30px] border border-black/5 bg-[#f6faf7] p-8 text-center text-base font-bold text-black/48">
              {t("Loading insights from CMS...", "Memuat insight dari CMS...")}
            </div>
          ) : null}

          {insightStatus === "error" ? (
            <div className="rounded-[30px] border border-red-100 bg-red-50 p-8 text-center text-base font-bold text-red-700">
              {t(
                "Unable to load insights. Please try again later.",
                "Insight tidak dapat dimuat. Silakan coba kembali nanti.",
              )}
            </div>
          ) : null}

          {insightStatus === "success" && !featured ? (
            <div className="rounded-[30px] border border-black/5 bg-[#f6faf7] p-8 text-center text-base font-bold text-black/48">
              {t(
                "No insight available yet.",
                "Belum ada insight yang tersedia.",
              )}
            </div>
          ) : null}

          {featured ? <InsightCard item={featured} featured /> : null}

          {latest.length > 0 ? (
            <div className="-mx-4 mt-8 flex snap-x gap-4 overflow-x-auto px-4 pb-5 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
              {latest.map((item) => (
                <InsightCard key={item.slug} item={item} />
              ))}
            </div>
          ) : null}

          <p className="mt-1 text-center text-xs font-bold text-black/40 md:hidden">
            {t(
              "Swipe to read latest insights",
              "Geser untuk membaca insight terbaru",
            )}
          </p>
        </div>
      </section>

      <section className="bg-[#f6faf7] py-16 md:py-28">
        <div className="pml-container">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-10">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
                {t("FAQ Preview", "Pratinjau FAQ")}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
                {t(
                  "Common questions before starting with PML",
                  "Pertanyaan umum sebelum memulai bersama PML",
                )}
              </h2>

              <p className="mt-5 text-base leading-8 text-black/65 md:mt-6 md:text-lg md:leading-9">
                {t(
                  "Quick answers about services, project preparation, regulatory support, and facility access.",
                  "Jawaban ringkas mengenai layanan, persiapan proyek, dukungan regulasi, dan akses fasilitas.",
                )}
              </p>

              <Link
                href={localizeHref("/insight/faq", locale)}
                className="mt-8 inline-flex items-center justify-center rounded-full bg-[#039147] px-7 py-4 text-sm font-extrabold text-white shadow-[0_18px_40px_rgba(3,145,71,0.22)]"
              >
                {t("View All FAQ", "Lihat Semua FAQ")}
              </Link>
            </div>

            <div className="space-y-3 md:space-y-4">
              {localizedFaqs.slice(0, 4).map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-[22px] border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl md:rounded-[26px] md:p-6"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-base font-black text-black md:gap-6 md:text-lg">
                    {faq.question}
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eaf8f0] text-xl text-[#039147] transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-base leading-8 text-black/60">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pb-20 md:pb-32">
        <div className="pml-container">
          <div className="relative overflow-hidden rounded-[30px] bg-black px-6 py-14 text-center text-black shadow-[0_28px_90px_rgba(0,0,0,0.18)] md:rounded-[36px] md:px-14 md:py-20">
            <Image
              src="/images/pml/cta-lab-background.png"
              alt=""
              fill
              className="object-cover opacity-48"
            />
            <div className="absolute inset-0 bg-white/64" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/78 via-white/48 to-[#039147]/12" />
            <div className="pml-hex-pattern-light absolute inset-0 opacity-[0.10]" />

            <div className="relative mx-auto max-w-3xl">
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-black/70">
                {t("Start a Project", "Mulai Proyek")}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight md:text-[52px] text-black">
                {t(
                  "Need scientific, clinical, analytical, or regulatory support?",
                  "Membutuhkan dukungan ilmiah, klinis, analitik, atau regulasi?",
                )}
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-black/72">
                {t(
                  "Share your project needs with PML and our team will help identify the right service scope, required information, and next steps.",
                  "Sampaikan kebutuhan proyek Anda kepada PML. Tim kami akan membantu menentukan ruang lingkup layanan, informasi yang dibutuhkan, dan langkah berikutnya.",
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
