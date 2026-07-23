import type { Metadata } from "next";

import { isLocale, type Locale } from "@/i18n/config";
import { generatePageMetadata } from "@/lib/page-seo";

import ContactPageClient from "./ContactPageClient";

type ContactPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const resolvedParams = await params;

  const locale: Locale = isLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : "en";

  const isIndonesian = locale === "id";

  return generatePageMetadata(`/${locale}/contact`, {
    title: isIndonesian ? "Hubungi Kami" : "Contact Us",
    description: isIndonesian
      ? "Hubungi Pharma Metric Labs untuk mendiskusikan studi BA/BE, uji klinis, analisis kontrak, manajemen regulasi, dan kebutuhan proyek farmasi."
      : "Contact Pharma Metric Labs to discuss BA/BE studies, clinical trials, contract analysis, regulatory management, and pharmaceutical project inquiries.",
  });
}

export default function ContactPage() {
  return <ContactPageClient />;
}
