import type { Metadata } from "next";

import InsightCategoryTemplate from "@/components/pages/InsightCategoryTemplate";
import { isLocale, type Locale } from "@/i18n/config";
import { generatePageMetadata } from "@/lib/page-seo";

type NewsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: NewsPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale: Locale = isLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : "en";
  const isIndonesian = locale === "id";

  return generatePageMetadata(`/${locale}/insight/news`, {
    title: isIndonesian ? "Berita" : "News",
    description: isIndonesian
      ? "Ikuti berita, pembaruan perusahaan, aktivitas layanan, dan perkembangan fasilitas Pharma Metric Labs."
      : "Follow Pharma Metric Labs news, company updates, service activities, and facility developments.",
  });
}

export default function NewsPage() {
  return <InsightCategoryTemplate category="news" />;
}
