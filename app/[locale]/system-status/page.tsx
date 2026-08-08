import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale } from "@/i18n/config";
import SystemStatusClient from "./SystemStatusClient";

type SystemStatusPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export const metadata: Metadata = {
  title: "System Status | Pharma Metric Labs",
  description:
    "General availability status for Pharma Metric Labs website and platform services.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function SystemStatusPage({
  params,
}: SystemStatusPageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return <SystemStatusClient locale={locale} />;
}
