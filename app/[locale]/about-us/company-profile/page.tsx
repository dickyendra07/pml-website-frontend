import type { Metadata } from "next";

import { isLocale, type Locale } from "@/i18n/config";
import { generatePageMetadata } from "@/lib/page-seo";

import CompanyProfilePageClient from "./CompanyProfilePageClient";

type CompanyProfilePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: CompanyProfilePageProps): Promise<Metadata> {
  const resolvedParams = await params;

  const locale: Locale = isLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : "en";

  const isIndonesian = locale === "id";

  return generatePageMetadata(`/${locale}/about-us/company-profile`, {
    title: isIndonesian ? "Profil Perusahaan" : "Company Profile",
    description: isIndonesian
      ? "Pelajari profil perusahaan Pharma Metric Labs, kapabilitas, pengalaman, standar mutu, dan fokus layanan CRO."
      : "Explore Pharma Metric Labs company profile, capabilities, experience, quality standards, and CRO service focus.",
  });
}

export default function CompanyProfilePage() {
  return <CompanyProfilePageClient />;
}
