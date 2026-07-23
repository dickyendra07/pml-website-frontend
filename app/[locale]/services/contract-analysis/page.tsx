import type { Metadata } from "next";

import { isLocale, type Locale } from "@/i18n/config";
import { generatePageMetadata } from "@/lib/page-seo";

import ContractAnalysisPageClient from "./ContractAnalysisPageClient";

type ContractAnalysisPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: ContractAnalysisPageProps): Promise<Metadata> {
  const resolvedParams = await params;

  const locale: Locale = isLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : "en";

  const isIndonesian = locale === "id";

  return generatePageMetadata(`/${locale}/services/contract-analysis`, {
    title: isIndonesian ? "Analisis Kontrak" : "Contract Analysis",
    description: isIndonesian
      ? "Jelajahi layanan analisis kontrak Pharma Metric Labs untuk pengujian analitik, mutu produk, keamanan, kepatuhan, dan kebutuhan dokumentasi."
      : "Explore Pharma Metric Labs contract analysis services for analytical testing, product quality, safety, compliance, and documentation needs.",
  });
}

export default function ContractAnalysisPage() {
  return <ContractAnalysisPageClient />;
}
