import type { Metadata } from "next";

import { isLocale, type Locale } from "@/i18n/config";
import { generatePageMetadata } from "@/lib/page-seo";

import AboutUsPageClient from "./AboutUsPageClient";

type AboutUsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: AboutUsPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale: Locale = isLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : "en";

  const isIndonesian = locale === "id";

  return generatePageMetadata(`/${locale}/about-us`, {
    title: isIndonesian
      ? "Tentang Pharma Metric Labs"
      : "About Pharma Metric Labs",
    description: isIndonesian
      ? "Pelajari Pharma Metric Labs, CRO independen di Indonesia dengan keahlian multidisiplin, integritas ilmiah, dan dukungan pelaksanaan studi yang andal."
      : "Learn about Pharma Metric Labs, an independent CRO in Indonesia with multidisciplinary expertise, scientific integrity, and reliable study execution support.",
  });
}

export default function AboutUsPage() {
  return <AboutUsPageClient />;
}
