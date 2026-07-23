import type { Metadata } from "next";

import { isLocale, type Locale } from "@/i18n/config";
import { generatePageMetadata } from "@/lib/page-seo";

import FacilitiesPageClient from "./FacilitiesPageClient";

type FacilitiesPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: FacilitiesPageProps): Promise<Metadata> {
  const resolvedParams = await params;

  const locale: Locale = isLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : "en";

  const isIndonesian = locale === "id";

  return generatePageMetadata(`/${locale}/facilities`, {
    title: isIndonesian ? "Fasilitas & Kapabilitas" : "Facilities & Capability",
    description: isIndonesian
      ? "Jelajahi fasilitas klinis, analitik, dan pendukung Pharma Metric Labs untuk pelaksanaan studi dan operasional laboratorium yang andal."
      : "Explore Pharma Metric Labs clinical, analytical, and supporting facilities for reliable study execution and laboratory operations.",
  });
}

export default function FacilitiesPage() {
  return <FacilitiesPageClient />;
}
