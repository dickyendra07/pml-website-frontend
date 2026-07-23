import type { Metadata } from "next";
import { notFound } from "next/navigation";

import FacilityDetailTemplate from "@/components/pages/FacilityDetailTemplate";
import { getFacilityByKey } from "@/data/facilities";
import { isLocale, type Locale } from "@/i18n/config";
import { generatePageMetadata } from "@/lib/page-seo";

type ClinicalFacilitiesPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: ClinicalFacilitiesPageProps): Promise<Metadata> {
  const resolvedParams = await params;

  const locale: Locale = isLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : "en";

  const isIndonesian = locale === "id";

  return generatePageMetadata(`/${locale}/facilities/clinical-facilities`, {
    title: isIndonesian ? "Fasilitas Klinis" : "Clinical Facilities",
    description: isIndonesian
      ? "Jelajahi fasilitas klinis Pharma Metric Labs untuk aktivitas studi terkontrol, screening, dosing, koordinasi relawan, dan dukungan medis 24 jam."
      : "Explore Pharma Metric Labs clinical facilities for controlled study activities, screening, dosing, volunteer coordination, and 24-hour medical support.",
  });
}

export default function ClinicalFacilitiesPage() {
  const data = getFacilityByKey("clinical-facilities");

  if (!data) {
    notFound();
  }

  return <FacilityDetailTemplate data={data} />;
}
