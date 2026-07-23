import type { Metadata } from "next";

import { isLocale, type Locale } from "@/i18n/config";
import { generatePageMetadata } from "@/lib/page-seo";

import ServicesPageClient from "./ServicesPageClient";

type ServicesPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: ServicesPageProps): Promise<Metadata> {
  const resolvedParams = await params;

  const locale: Locale = isLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : "en";

  const isIndonesian = locale === "id";

  return generatePageMetadata(`/${locale}/services`, {
    title: isIndonesian ? "Layanan CRO" : "Services",
    description: isIndonesian
      ? "Jelajahi layanan CRO Pharma Metric Labs, termasuk studi BA/BE, uji klinis, analisis kontrak, dan manajemen regulasi untuk pengembangan produk farmasi."
      : "Explore Pharma Metric Labs CRO services, including BA/BE study, clinical trial, contract analysis, and regulatory management for pharmaceutical development.",
  });
}

export default function ServicesPage() {
  return <ServicesPageClient />;
}
