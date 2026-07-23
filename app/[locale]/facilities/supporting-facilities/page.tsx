import type { Metadata } from "next";
import { notFound } from "next/navigation";

import FacilityDetailTemplate from "@/components/pages/FacilityDetailTemplate";
import { getFacilityByKey } from "@/data/facilities";
import { isLocale, type Locale } from "@/i18n/config";
import { generatePageMetadata } from "@/lib/page-seo";

type SupportingFacilitiesPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: SupportingFacilitiesPageProps): Promise<Metadata> {
  const resolvedParams = await params;

  const locale: Locale = isLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : "en";

  const isIndonesian = locale === "id";

  return generatePageMetadata(`/${locale}/facilities/supporting-facilities`, {
    title: isIndonesian ? "Fasilitas Pendukung" : "Supporting Facilities",
    description: isIndonesian
      ? "Jelajahi fasilitas pendukung Pharma Metric Labs untuk penyimpanan obat, pengelolaan arsip, penerimaan sampel, dokumentasi, dan operasional studi."
      : "Explore Pharma Metric Labs supporting facilities for drug storage, archive management, sample handling, documentation, and study operations.",
  });
}

export default function SupportingFacilitiesPage() {
  const data = getFacilityByKey("supporting-facilities");

  if (!data) {
    notFound();
  }

  return <FacilityDetailTemplate data={data} />;
}
