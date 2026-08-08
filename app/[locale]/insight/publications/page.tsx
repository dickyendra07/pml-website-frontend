import type { Metadata } from "next";
import { notFound } from "next/navigation";

import InsightCategoryTemplate from "@/components/pages/InsightCategoryTemplate";
import { isLocale, type Locale } from "@/i18n/config";
import { generatePageMetadata } from "@/lib/page-seo";

type PublicationsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PublicationsPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale: Locale = isLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : "en";
  const isIndonesian = locale === "id";

  return generatePageMetadata(`/${locale}/insight/publications`, {
    title: isIndonesian ? "Publikasi Ilmiah" : "Scientific Publications",
    description: isIndonesian
      ? "Jelajahi publikasi ilmiah dan referensi regulasi Pharma Metric Labs dalam penelitian klinis, pengujian analitik, dan ilmu regulasi."
      : "Explore Pharma Metric Labs scientific publications and regulatory references in clinical research, analytical testing, and regulatory science.",
  });
}

export default async function PublicationsPage({
  params,
}: PublicationsPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <InsightCategoryTemplate category="publications" locale={locale} />;
}
