"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import InsightCard from "@/components/pages/InsightCard";
import { type InsightCategory, insightCategories } from "@/data/insights";
import { getLocaleFromPathname, localizeHref } from "@/i18n/client";
import { getInsights, type InsightItem } from "@/lib/api";

type InsightCategoryTemplateProps = {
  category: InsightCategory;
};

const mockFaqItems = [
  {
    question: "What services does PML provide?",
    answer:
      "PML provides integrated CRO services including BA/BE study support, clinical trial support, contract analysis, regulatory management, and project documentation support.",
  },
  {
    question: "Can PML support both local and international sponsors?",
    answer:
      "Yes. PML supports local and international sponsors across pharmaceutical, healthcare, research, and regulated product industries.",
  },
  {
    question: "What information should sponsors prepare before contacting PML?",
    answer:
      "Sponsors can prepare the product or study background, service of interest, project timeline, available documents, and expected regulatory or analytical requirements.",
  },
  {
    question: "Does PML provide regulatory management support?",
    answer:
      "Yes. PML supports regulatory-oriented preparation, document review, ACTD-related documentation, and submission readiness based on project requirements.",
  },
  {
    question: "How can sponsors start a project discussion with PML?",
    answer:
      "Sponsors can submit an inquiry through the contact form or request a proposal. The PML team will review the information and follow up with the recommended next steps.",
  },
];

const categoryHero: Record<
  InsightCategory,
  { title: string; eyebrow: string; description: string; image: string }
> = {
  articles: {
    eyebrow: "Articles",
    title: "Educational articles for CRO and pharmaceutical project readiness",
    description:
      "Read practical content about BA/BE study, clinical trial support, contract analysis, regulatory preparation, and pharmaceutical development.",
    image: "/images/pml/services/babe-studies-hero.png",
  },
  news: {
    eyebrow: "News",
    title: "Company updates and service-related activities from PML",
    description:
      "Follow updates from Pharma Metric Labs, including facility capability, service activities, and company announcements.",
    image: "/images/pml/facilities-gallery/clinical-main.jpg",
  },
  publications: {
    eyebrow: "Publications",
    title: "Our Scientific Publications",
    description:
      "Explore peer-reviewed publications and scientific contributions by PML, demonstrating our expertise in clinical research, analytical testing, and regulatory science.",
    image: "/images/pml/services/clinical-trial-regulatory.png",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Frequently asked questions about Pharma Metric Labs",
    description:
      "Find answers to common questions about PML services, inquiry preparation, regulatory support, and facility access.",
    image: "/images/pml/cta-lab-background.png",
  },
};

const mockFaqItemsId = [
  {
    question: "Layanan apa saja yang disediakan PML?",
    answer:
      "PML menyediakan layanan CRO terintegrasi, termasuk dukungan studi BA/BE, uji klinis, analisis kontrak, manajemen regulasi, dan dokumentasi proyek.",
  },
  {
    question: "Apakah PML dapat mendukung sponsor lokal maupun internasional?",
    answer:
      "Ya. PML mendukung sponsor lokal dan internasional dari industri farmasi, kesehatan, penelitian, dan produk teregulasi.",
  },
  {
    question:
      "Informasi apa yang perlu disiapkan sponsor sebelum menghubungi PML?",
    answer:
      "Sponsor dapat menyiapkan latar belakang produk atau studi, layanan yang dibutuhkan, jadwal proyek, dokumen yang tersedia, serta kebutuhan regulasi atau analitik.",
  },
  {
    question: "Apakah PML menyediakan dukungan manajemen regulasi?",
    answer:
      "Ya. PML mendukung persiapan berorientasi regulasi, peninjauan dokumen, dokumentasi terkait ACTD, dan kesiapan pengajuan berdasarkan kebutuhan proyek.",
  },
  {
    question: "Bagaimana sponsor dapat memulai diskusi proyek dengan PML?",
    answer:
      "Sponsor dapat mengirimkan inquiry melalui formulir kontak atau mengajukan proposal. Tim PML akan meninjau informasi tersebut dan menindaklanjuti dengan rekomendasi langkah berikutnya.",
  },
];

const categoryHeroId: Record<
  InsightCategory,
  {
    title: string;
    eyebrow: string;
    description: string;
    image: string;
  }
> = {
  articles: {
    eyebrow: "Artikel",
    title: "Artikel edukatif untuk kesiapan proyek CRO dan farmasi",
    description:
      "Baca konten praktis mengenai studi BA/BE, dukungan uji klinis, analisis kontrak, persiapan regulasi, dan pengembangan farmasi.",
    image: "/images/pml/services/babe-studies-hero.png",
  },
  news: {
    eyebrow: "Berita",
    title: "Pembaruan perusahaan dan aktivitas layanan dari PML",
    description:
      "Ikuti informasi terbaru dari Pharma Metric Labs, termasuk kapabilitas fasilitas, aktivitas layanan, dan pengumuman perusahaan.",
    image: "/images/pml/facilities-gallery/clinical-main.jpg",
  },
  publications: {
    eyebrow: "Publikasi",
    title: "Publikasi Ilmiah Kami",
    description:
      "Jelajahi publikasi peer-reviewed dan kontribusi ilmiah PML yang menunjukkan keahlian kami dalam penelitian klinis, pengujian analitik, dan ilmu regulasi.",
    image: "/images/pml/services/clinical-trial-regulatory.png",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Pertanyaan yang sering diajukan mengenai Pharma Metric Labs",
    description:
      "Temukan jawaban atas pertanyaan umum mengenai layanan PML, persiapan inquiry, dukungan regulasi, dan akses fasilitas.",
    image: "/images/pml/cta-lab-background.png",
  },
};

const categoryLabelId: Record<InsightCategory, string> = {
  articles: "Artikel",
  news: "Berita",
  publications: "Publikasi",
  faq: "FAQ",
};

export default function InsightCategoryTemplate({
  category,
}: InsightCategoryTemplateProps) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isIndonesian = locale === "id";

  const t = (english: string, indonesian: string) =>
    isIndonesian ? indonesian : english;

  const hero = isIndonesian ? categoryHeroId[category] : categoryHero[category];

  const localizedCategories = insightCategories.map((item) => ({
    ...item,
    label: isIndonesian ? categoryLabelId[item.category] : item.label,
  }));

  const fallbackFaqItems = isIndonesian ? mockFaqItemsId : mockFaqItems;

  const [items, setItems] = useState<InsightItem[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  const openProposal = () => {
    window.dispatchEvent(new CustomEvent("open-proposal-modal"));
  };

  useEffect(() => {
    let isMounted = true;

    async function loadCategoryInsights() {
      try {
        const data = await getInsights(category, locale);

        if (!isMounted) return;

        setItems(data);
        setStatus("success");
      } catch {
        if (!isMounted) return;

        setStatus("error");
      }
    }

    void loadCategoryInsights();

    return () => {
      isMounted = false;
    };
  }, [category, locale]);

  return (
    <main>
      <section className="relative overflow-hidden bg-white text-black">
        <Image
          src={hero.image}
          alt=""
          fill
          priority
          className="object-cover opacity-64"
        />
        <div className="absolute inset-0 bg-white/52" />
        <div className="absolute inset-0 bg-white/18" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/88 via-white/58 to-[#039147]/16" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/54 via-transparent to-black/20" />
        <div className="pml-hex-pattern absolute inset-0 opacity-[0.045]" />

        <div className="pml-container relative py-20 md:py-32">
          <nav className="mb-10 flex flex-wrap items-center gap-2 text-sm font-bold text-black/58">
            <Link
              href={localizeHref("/", locale)}
              className="transition hover:text-black"
            >
              {t("Home", "Beranda")}
            </Link>
            <span>/</span>
            <Link
              href={localizeHref("/insight", locale)}
              className="transition hover:text-black"
            >
              Insight
            </Link>
            <span>/</span>
            <span className="text-[#039147]">{hero.eyebrow}</span>
          </nav>

          <div className="max-w-5xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#039147] backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#039147]" />
              {hero.eyebrow}
            </p>

            <h1 className="mt-6 max-w-5xl text-4xl font-black leading-[1.04] tracking-tight text-black md:text-6xl lg:text-[68px]">
              {hero.title}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-black/68 md:text-lg">
              {hero.description}
            </p>
          </div>
        </div>
      </section>

      <section className="sticky top-[72px] z-30 border-b border-black/5 bg-[#eaf8f0]/95 py-3 backdrop-blur md:top-20 md:py-4">
        <div className="pml-container flex gap-2 overflow-x-auto md:gap-3">
          <Link
            href={localizeHref("/insight", locale)}
            className="shrink-0 rounded-full bg-white px-4 py-2.5 text-xs font-extrabold text-black/60 transition hover:text-[#039147] md:px-5 md:py-3 md:text-sm"
          >
            {t("All Resources", "Semua Sumber Daya")}
          </Link>

          {localizedCategories.map((item) => (
            <Link
              key={item.href}
              href={localizeHref(item.href, locale)}
              className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-extrabold transition md:px-5 md:py-3 md:text-sm ${
                item.category === category
                  ? "bg-[#039147] text-white shadow-[0_12px_30px_rgba(3,145,71,0.20)]"
                  : "bg-white text-black/60 hover:text-[#039147]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      {category === "faq" ? (
        <section className="bg-white py-16 md:py-28">
          <div className="pml-container grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-10">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
                {t("FAQ Center", "Pusat FAQ")}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight text-black md:text-[52px]">
                {t(
                  "Frequently Asked Questions",
                  "Pertanyaan yang Sering Diajukan",
                )}
              </h2>

              <p className="mt-5 text-base leading-8 text-black/65 md:mt-6 md:text-lg md:leading-9">
                {t(
                  "Find answers to common questions about PML's services, processes, and capabilities. If you need further assistance, our team is here to help.",
                  "Temukan jawaban atas pertanyaan umum mengenai layanan, proses, dan kapabilitas PML. Tim kami siap membantu apabila Anda membutuhkan informasi lebih lanjut.",
                )}
              </p>
            </div>

            <div className="space-y-3 md:space-y-4">
              {(items.length > 0
                ? items.map((faq) => ({
                    question: faq.title,
                    answer:
                      faq.excerpt ||
                      faq.content ||
                      t(
                        "Answer will be available soon.",
                        "Jawaban akan segera tersedia.",
                      ),
                  }))
                : fallbackFaqItems
              ).map((faq) => (
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
        </section>
      ) : (
        <section className="bg-white py-16 md:py-28">
          <div className="pml-container">
            <div className="mb-9 flex flex-col justify-between gap-5 md:mb-12 md:flex-row md:items-end md:gap-6">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
                  {t(`${hero.eyebrow} Collection`, `Koleksi ${hero.eyebrow}`)}
                </p>

                <h2 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-black md:text-[52px]">
                  {t(
                    `Latest ${hero.eyebrow.toLowerCase()} from Pharma Metric Labs`,
                    `${hero.eyebrow} terbaru dari Pharma Metric Labs`,
                  )}
                </h2>
              </div>

              <p className="max-w-xl text-base leading-8 text-black/55">
                {t(
                  "This section is connected to the CMS and can be updated from the admin panel.",
                  "Bagian ini terhubung dengan CMS dan dapat diperbarui melalui panel admin.",
                )}
              </p>
            </div>

            {status === "loading" ? (
              <div className="mx-auto max-w-3xl rounded-[34px] border border-black/5 bg-[#f6faf7] p-10 text-center shadow-sm">
                <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
                  {t("Loading", "Memuat")}
                </p>
                <h2 className="mt-4 text-3xl font-black leading-tight text-black">
                  {t(
                    `Loading ${hero.eyebrow.toLowerCase()} from CMS...`,
                    `Memuat ${hero.eyebrow.toLowerCase()} dari CMS...`,
                  )}
                </h2>
              </div>
            ) : null}

            {status === "error" ? (
              <div className="mx-auto max-w-3xl rounded-[34px] border border-red-100 bg-red-50 p-10 text-center shadow-sm">
                <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-red-600">
                  {t("Error", "Kesalahan")}
                </p>
                <h2 className="mt-4 text-3xl font-black leading-tight text-red-700">
                  {t("Unable to load content", "Konten tidak dapat dimuat")}
                </h2>
                <p className="mt-5 text-base leading-8 text-red-600">
                  {t("Please try again later.", "Silakan coba kembali nanti.")}
                </p>
              </div>
            ) : null}

            {status === "success" && items.length > 0 ? (
              <>
                <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-5 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
                  {items.map((item) => (
                    <InsightCard key={item.slug} item={item} />
                  ))}
                </div>

                <p className="mt-1 text-center text-xs font-bold text-black/40 md:hidden">
                  {t(
                    "Swipe to explore resources",
                    "Geser untuk menjelajahi sumber daya",
                  )}
                </p>
              </>
            ) : null}

            {status === "success" && items.length === 0 ? (
              <div className="mx-auto max-w-3xl rounded-[34px] border border-black/5 bg-white p-10 text-center shadow-sm">
                <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
                  {t("Coming Soon", "Segera Hadir")}
                </p>
                <h2 className="mt-4 text-3xl font-black leading-tight text-black">
                  {t(
                    "More resources will be available soon",
                    "Sumber daya lainnya akan segera tersedia",
                  )}
                </h2>
                <p className="mt-5 text-base leading-8 text-black/60">
                  {t(
                    "This section is ready for future CMS-managed content updates.",
                    "Bagian ini telah siap untuk pembaruan konten melalui CMS.",
                  )}
                </p>
              </div>
            ) : null}
          </div>
        </section>
      )}

      <section className="bg-[#f6faf7] pb-20 pt-4 md:pb-32">
        <div className="pml-container">
          <div className="relative overflow-hidden rounded-[30px] bg-black px-6 py-14 text-center text-black shadow-[0_28px_90px_rgba(0,0,0,0.18)] md:rounded-[36px] md:px-14 md:py-20">
            <Image
              src="/images/pml/cta-lab-background.png"
              alt=""
              fill
              className="object-cover opacity-48"
            />
            <div className="absolute inset-0 bg-white/34" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/78 via-white/48 to-[#039147]/12" />
            <div className="pml-hex-pattern-light absolute inset-0 opacity-[0.10]" />

            <div className="relative mx-auto max-w-3xl">
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#039147]">
                {t("Start a Project", "Mulai Proyek")}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight md:text-[52px] text-black">
                {t(
                  "Need support for your next project?",
                  "Membutuhkan dukungan untuk proyek berikutnya?",
                )}
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-black/72">
                {t(
                  "Share your study, testing, or regulatory needs with our team and we will help identify the right service scope, required information, and next steps.",
                  "Sampaikan kebutuhan studi, pengujian, atau regulasi kepada tim kami. Kami akan membantu menentukan ruang lingkup layanan, informasi yang dibutuhkan, dan langkah berikutnya.",
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
