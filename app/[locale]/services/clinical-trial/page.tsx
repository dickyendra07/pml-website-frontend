import type { Metadata } from "next";

import { isLocale, type Locale } from "@/i18n/config";
import { generatePageMetadata } from "@/lib/page-seo";

import ClinicalTrialPageClient from "./ClinicalTrialPageClient";

type ClinicalTrialPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: ClinicalTrialPageProps): Promise<Metadata> {
  const resolvedParams = await params;

  const locale: Locale = isLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : "en";

  const isIndonesian = locale === "id";

  return generatePageMetadata(`/${locale}/services/clinical-trial`, {
    title: isIndonesian ? "Uji Klinis" : "Clinical Trial",
    description: isIndonesian
      ? "Jelajahi layanan uji klinis Pharma Metric Labs, termasuk perencanaan studi, koordinasi regulasi, manajemen lokasi, monitoring, manajemen data, dan penulisan medis."
      : "Explore Pharma Metric Labs clinical trial services, including study planning, regulatory coordination, site management, monitoring, data management, and medical writing.",
  });
}

export default function ClinicalTrialPage() {
  return <ClinicalTrialPageClient />;
}
