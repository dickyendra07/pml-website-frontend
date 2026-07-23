import type { Metadata } from "next";

import { isLocale, type Locale } from "@/i18n/config";
import { generatePageMetadata } from "@/lib/page-seo";

import BabeStudiesPageClient from "./BabeStudiesPageClient";

type BabeStudiesPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: BabeStudiesPageProps): Promise<Metadata> {
  const resolvedParams = await params;

  const locale: Locale = isLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : "en";

  const isIndonesian = locale === "id";

  return generatePageMetadata(`/${locale}/services/babe-studies`, {
    title: isIndonesian ? "Studi BA/BE" : "BA/BE Study",
    description: isIndonesian
      ? "Jelajahi layanan studi BA/BE Pharma Metric Labs, termasuk pelaksanaan klinis, bioanalisis, pelaporan, dan dukungan studi yang siap untuk kebutuhan regulasi."
      : "Explore Pharma Metric Labs BA/BE study services, including clinical conduct, bioanalysis, reporting, and regulatory-ready study support.",
  });
}

export default function BabeStudiesPage() {
  return <BabeStudiesPageClient />;
}
