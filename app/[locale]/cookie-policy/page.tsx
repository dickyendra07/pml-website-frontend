import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import LegalPolicyLayout, {
  type LegalSection,
} from "@/components/pages/LegalPolicyLayout";
import { isLocale, type Locale } from "@/i18n/config";
import { generatePageMetadata } from "@/lib/page-seo";
import { getLegalPage } from "@/lib/legal-pages";

type CookiePolicyPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const fallbackSections: LegalSection[] = [
  {
    id: "cookie-policy",
    title: "Cookie Policy",
    paragraphs: [
      "This Cookie Policy explains how Pharma Metric Labs uses cookies and similar technologies when you access this website.",
      "You may manage cookie preferences through available browser settings or website controls.",
    ],
  },
];

export async function generateMetadata({
  params,
}: CookiePolicyPageProps): Promise<Metadata> {
  const resolvedParams = await params;

  const locale: Locale = isLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : "en";

  const isIndonesian = locale === "id";

  const cmsPage = await getLegalPage("COOKIE_POLICY");

  return generatePageMetadata(`/${locale}/cookie-policy`, {
    title:
      (isIndonesian
        ? cmsPage?.titleId
        : cmsPage?.titleEn) ||
      (isIndonesian ? "Kebijakan Cookies" : "Cookie Policy"),

    description:
      (isIndonesian
        ? cmsPage?.metaDescriptionId
        : cmsPage?.metaDescriptionEn) ||
      (isIndonesian
        ? "Kebijakan Cookies Pharma Metric Labs mengenai penggunaan cookies dan teknologi sejenis."
        : "Pharma Metric Labs Cookie Policy regarding cookies and similar technologies."),
  });
}

export default async function CookiePolicyPage({
  params,
}: CookiePolicyPageProps) {
  const resolvedParams = await params;

  const locale: Locale = isLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : "en";

  const isIndonesian = locale === "id";

  const cmsPage = await getLegalPage("COOKIE_POLICY");

  const title =
    (isIndonesian
      ? cmsPage?.titleId
      : cmsPage?.titleEn) ||
    (isIndonesian ? "Kebijakan Cookies" : "Cookie Policy");

  const content =
    (isIndonesian
      ? cmsPage?.contentId
      : cmsPage?.contentEn) || "";

  const sections: LegalSection[] = content
    ? [
        {
          id: "cms-content",
          title,
          paragraphs: [content],
        },
      ]
    : fallbackSections;

  return (
    <LegalPolicyLayout
      locale={locale}
      eyebrow={isIndonesian ? "Kebijakan Website" : "Website Policy"}
      title={title}
      description={
        isIndonesian
          ? "Kebijakan ini menjelaskan penggunaan cookies dan teknologi sejenis pada website Pharma Metric Labs."
          : "This policy explains the use of cookies and similar technologies on the Pharma Metric Labs website."
      }
      lastUpdatedLabel={
        isIndonesian ? "Terakhir diperbarui" : "Last updated"
      }
      lastUpdatedValue={
        isIndonesian ? "Juli 2026" : "July 2026"
      }
      tableOfContentsLabel={
        isIndonesian ? "Daftar Isi" : "Table of Contents"
      }
      sections={sections}
      relatedTitle={
        isIndonesian
          ? "Perlindungan Data Pribadi"
          : "Personal Data Protection"
      }
      relatedDescription={
        isIndonesian
          ? "Pelajari bagaimana Pharma Metric Labs mengelola informasi melalui Kebijakan Privasi."
          : "Learn how Pharma Metric Labs manages information through its Privacy Policy."
      }
      relatedHref="/privacy-policy"
      relatedLabel={
        isIndonesian
          ? "Lihat Kebijakan Privasi"
          : "View Privacy Policy"
      }
    />
  );
}
