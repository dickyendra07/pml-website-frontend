import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getInsightBySlug } from "@/lib/api";
import { isLocale, type Locale } from "@/i18n/config";
import { generatePageMetadata } from "@/lib/page-seo";
import InsightSidebar from "@/components/pages/InsightSidebar";
import RichTextContent from "@/components/pages/RichTextContent";
import { resolveMediaUrl } from "@/lib/media";

type Props = {
  params: Promise<{
    locale: string;
    category: string;
    slug: string;
  }>;
};

function formatDate(
  value: string | null,
  locale: Locale,
) {
  if (!value) return "";

  return new Intl.DateTimeFormat(
    locale === "id" ? "id-ID" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  ).format(new Date(value));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const resolved = await params;

  const locale: Locale = isLocale(resolved.locale)
    ? resolved.locale
    : "en";

  const data = await getInsightBySlug(
    resolved.slug,
    locale,
  );

  return generatePageMetadata(
    `/${locale}/insight/${resolved.category}/${resolved.slug}`,
    {
      title: data?.seoTitle || "Insight",
      description:
        data?.metaDescription ||
        "Pharma Metric Labs insight article.",
    },
  );
}

export default async function InsightDetailPage({
  params,
}: Props) {
  const resolved = await params;

  const locale: Locale = isLocale(resolved.locale)
    ? resolved.locale
    : "en";

  const data = await getInsightBySlug(
    resolved.slug,
    locale,
  );

  if (!data) {
    notFound();
  }

  return (
    <main className="bg-white text-black">

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="relative min-h-[620px]">

          <Image
            src={
              resolveMediaUrl(data.coverImage) ||
              "/images/pml/cta-lab-background.png"
            }
            alt={data.title}
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/25" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20" />

          <div className="pml-container relative flex min-h-[620px] items-end pb-16 md:pb-20">

            <div className="max-w-5xl text-white">

              <div className="mb-8 flex items-center gap-3 text-sm font-bold text-white/70">
                <Link
                  href={`/${locale}/insight`}
                  className="transition hover:text-white"
                >
                  Insight
                </Link>

                <span>/</span>

                <Link
                  href={`/${locale}/insight/${data.category}`}
                  className="transition hover:text-white"
                >
                  {data.category}
                </Link>
              </div>


              <p className="mb-5 text-xs font-black uppercase tracking-[0.28em] text-white/75">
                Pharma Metric Labs
              </p>


              <h1 className="max-w-4xl text-4xl font-black leading-[1.05] md:text-6xl">
                {data.title}
              </h1>


              {data.excerpt && (
                <p className="mt-6 max-w-3xl text-lg leading-8 text-white/80 md:text-xl">
                  {data.excerpt}
                </p>
              )}


              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm font-bold text-white/70">

                <span>
                  {formatDate(
                    data.publishedAt,
                    locale,
                  )}
                </span>

                <span className="h-1 w-1 rounded-full bg-white/50" />

                <span>
                  1 min read
                </span>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* CONTENT */}
      <section className="pml-container py-16 md:py-24">

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">


          <article className="max-w-none">

            <div className="mb-10 flex flex-wrap gap-3">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#eaf8f0] px-4 py-2 text-sm font-black text-[#039147]"
                >
                  {tag}
                </span>
              ))}
            </div>


            <div className="prose prose-lg max-w-none">
              <RichTextContent
                content={data.content}
                className="text-base leading-9 text-black/80"
              />

            </div>


          </article>


          <InsightSidebar
            category={data.category}
            locale={locale}
          />


        </div>

      </section>

    </main>
  );
}
