import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale, type Locale } from "@/i18n/config";
import { getInsightBySlug } from "@/lib/api";
import { generatePageMetadata } from "@/lib/page-seo";

import InsightDetailClient from "./InsightDetailClient";

type Props = {
  params: Promise<{
    locale: string;
    category: string;
    slug: string;
  }>;
};

async function loadInsight(slug: string, locale: Locale) {
  try {
    return {
      data: await getInsightBySlug(slug, locale),
      apiAvailable: true,
    };
  } catch {
    return {
      data: null,
      apiAvailable: false,
    };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await params;
  const locale: Locale = isLocale(resolved.locale) ? resolved.locale : "en";
  const { data } = await loadInsight(resolved.slug, locale);

  return generatePageMetadata(
    `/${locale}/insight/${resolved.category}/${resolved.slug}`,
    {
      title: data?.seoTitle || "Insight",
      description: data?.metaDescription || "Pharma Metric Labs insight article.",
    },
  );
}

export default async function InsightDetailPage({ params }: Props) {
  const resolved = await params;

  if (!isLocale(resolved.locale)) {
    notFound();
  }

  const { data, apiAvailable } = await loadInsight(resolved.slug, resolved.locale);

  if (apiAvailable && (!data || data.category !== resolved.category)) {
    notFound();
  }

  return (
    <InsightDetailClient
      category={resolved.category}
      initialData={data}
      locale={resolved.locale}
      slug={resolved.slug}
    />
  );
}
