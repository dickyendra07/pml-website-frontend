import type { Metadata } from "next";

import { isLocale, type Locale } from "@/i18n/config";
import { generatePageMetadata } from "@/lib/page-seo";

import RegulatoryConsultationPageClient from "./RegulatoryConsultationPageClient";

type RegulatoryConsultationPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: RegulatoryConsultationPageProps): Promise<Metadata> {
  const resolvedParams = await params;

  const locale: Locale = isLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : "en";

  const isIndonesian = locale === "id";

  return generatePageMetadata(`/${locale}/services/regulatory-consultation`, {
    title: isIndonesian ? "Manajemen Regulasi" : "Regulatory Management",
    description: isIndonesian
      ? "Jelajahi layanan manajemen regulasi Pharma Metric Labs untuk registrasi BPOM, dokumen ACTD, kepatuhan, strategi regulasi, dan kesiapan pengajuan."
      : "Explore Pharma Metric Labs regulatory management services for BPOM registration, ACTD documents, compliance, regulatory strategy, and submission readiness.",
  });
}

export default function RegulatoryConsultationPage() {
  return <RegulatoryConsultationPageClient />;
}
