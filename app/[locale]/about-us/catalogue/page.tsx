import type { Metadata } from "next";

import { isLocale, type Locale } from "@/i18n/config";
import { generatePageMetadata } from "@/lib/page-seo";

import CataloguePageClient from "./CataloguePageClient";

type CataloguePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: CataloguePageProps): Promise<Metadata> {
  const resolvedParams = await params;

  const locale: Locale = isLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : "en";

  const isIndonesian = locale === "id";

  return generatePageMetadata(`/${locale}/about-us/catalogue`, {
    title: isIndonesian ? "Katalog" : "Catalogue",
    description: isIndonesian
      ? "Akses katalog Pharma Metric Labs, materi perusahaan, informasi layanan, dan referensi yang dapat diunduh."
      : "Access Pharma Metric Labs catalogue, company materials, service information, and downloadable references.",
  });
}

export default function CataloguePage() {
  return <CataloguePageClient />;
}
