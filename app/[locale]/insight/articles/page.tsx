import type { Metadata } from "next";

import InsightCategoryTemplate from "@/components/pages/InsightCategoryTemplate";
import { isLocale, type Locale } from "@/i18n/config";
import { generatePageMetadata } from "@/lib/page-seo";

type ArticlesPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ArticlesPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale: Locale = isLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : "en";
  const isIndonesian = locale === "id";

  return generatePageMetadata(`/${locale}/insight/articles`, {
    title: isIndonesian ? "Artikel" : "Articles",
    description: isIndonesian
      ? "Baca artikel edukatif Pharma Metric Labs mengenai layanan CRO, studi BA/BE, uji klinis, analisis kontrak, regulasi, dan pengembangan farmasi."
      : "Read educational Pharma Metric Labs articles about CRO services, BA/BE studies, clinical trials, contract analysis, regulatory topics, and pharmaceutical development.",
  });
}

export default function ArticlesPage() {
  return <InsightCategoryTemplate category="articles" />;
}
