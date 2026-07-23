import type { Metadata } from "next";

import { isLocale, type Locale } from "@/i18n/config";
import { generatePageMetadata } from "@/lib/page-seo";

import ExpertsTeamPageClient from "./ExpertsTeamPageClient";

type ExpertsTeamPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: ExpertsTeamPageProps): Promise<Metadata> {
  const resolvedParams = await params;

  const locale: Locale = isLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : "en";

  const isIndonesian = locale === "id";

  return generatePageMetadata(`/${locale}/about-us/experts-and-team`, {
    title: isIndonesian ? "Para Ahli & Tim" : "Experts & Team",
    description: isIndonesian
      ? "Kenali para ahli multidisiplin Pharma Metric Labs dalam bidang klinis, laboratorium, regulasi, dokumentasi, dan alur proyek."
      : "Meet Pharma Metric Labs multidisciplinary experts across clinical, laboratory, regulatory, and project workflows.",
  });
}

export default function ExpertsTeamPage() {
  return <ExpertsTeamPageClient />;
}
