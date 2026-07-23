import type { Metadata } from "next";
import { notFound } from "next/navigation";

import FacilityDetailTemplate from "@/components/pages/FacilityDetailTemplate";
import { getFacilityByKey } from "@/data/facilities";
import { isLocale, type Locale } from "@/i18n/config";
import { generatePageMetadata } from "@/lib/page-seo";

type AnalyticalFacilitiesPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: AnalyticalFacilitiesPageProps): Promise<Metadata> {
  const resolvedParams = await params;

  const locale: Locale = isLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : "en";

  const isIndonesian = locale === "id";

  return generatePageMetadata(`/${locale}/facilities/analytical-facilities`, {
    title: isIndonesian ? "Fasilitas Analitik" : "Analytical Facilities",
    description: isIndonesian
      ? "Jelajahi kapabilitas laboratorium analitik, instrumen, bioanalisis, pengujian, dokumentasi, dan pelaporan di Pharma Metric Labs."
      : "Explore analytical laboratory capability, instruments, bioanalysis, testing, documentation, and reporting at Pharma Metric Labs.",
  });
}

export default function AnalyticalFacilitiesPage() {
  const data = getFacilityByKey("analytical-facilities");

  if (!data) {
    notFound();
  }

  return <FacilityDetailTemplate data={data} />;
}
