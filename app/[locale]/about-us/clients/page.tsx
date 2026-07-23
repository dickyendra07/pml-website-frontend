import type { Metadata } from "next";

import { isLocale, type Locale } from "@/i18n/config";
import { generatePageMetadata } from "@/lib/page-seo";

import ClientsPageClient from "./ClientsPageClient";

type ClientsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: ClientsPageProps): Promise<Metadata> {
  const resolvedParams = await params;

  const locale: Locale = isLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : "en";

  const isIndonesian = locale === "id";

  return generatePageMetadata(`/${locale}/about-us/clients`, {
    title: isIndonesian ? "Klien & Jaringan" : "Clients & Network",
    description: isIndonesian
      ? "Pelajari jaringan klien lokal dan internasional Pharma Metric Labs, kemitraan rumah sakit, serta kolaborasi dengan investigator dan institusi penelitian."
      : "Learn about Pharma Metric Labs local and international client network, hospital partnerships, and investigator collaboration.",
  });
}

export default function ClientsPage() {
  return <ClientsPageClient />;
}
