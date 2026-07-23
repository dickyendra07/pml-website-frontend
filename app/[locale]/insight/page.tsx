import type { Metadata } from "next";

import { isLocale, type Locale } from "@/i18n/config";
import { generatePageMetadata } from "@/lib/page-seo";

import InsightPageClient from "./InsightPageClient";

type InsightPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: InsightPageProps): Promise<Metadata> {
  const resolvedParams = await params;

  const locale: Locale = isLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : "en";

  const isIndonesian = locale === "id";

  return generatePageMetadata(`/${locale}/insight`, {
    title: isIndonesian ? "Insight & Sumber Daya" : "Insight & Resources",
    description: isIndonesian
      ? "Jelajahi artikel, berita, publikasi, dan FAQ Pharma Metric Labs mengenai layanan CRO, studi BA/BE, uji klinis, analisis, dan regulasi."
      : "Explore Pharma Metric Labs articles, news, publications, and FAQ content about CRO services, BA/BE studies, clinical trials, analytical services, and regulatory topics.",
  });
}

export default function InsightPage() {
  return <InsightPageClient />;
}
