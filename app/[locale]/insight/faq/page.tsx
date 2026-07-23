import type { Metadata } from "next";

import InsightCategoryTemplate from "@/components/pages/InsightCategoryTemplate";
import { isLocale, type Locale } from "@/i18n/config";
import { generatePageMetadata } from "@/lib/page-seo";

type FaqPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: FaqPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale: Locale = isLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : "en";
  const isIndonesian = locale === "id";

  return generatePageMetadata(`/${locale}/insight/faq`, {
    title: isIndonesian
      ? "Pertanyaan yang Sering Diajukan"
      : "Frequently Asked Questions",
    description: isIndonesian
      ? "Temukan jawaban mengenai layanan Pharma Metric Labs, persiapan proyek, dukungan regulasi, fasilitas, dan pengajuan proposal."
      : "Find answers about Pharma Metric Labs services, project preparation, regulatory support, facilities, and proposal inquiries.",
  });
}

export default function FaqPage() {
  return <InsightCategoryTemplate category="faq" />;
}
