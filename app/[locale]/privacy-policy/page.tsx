import type { Metadata } from "next";

import LegalPolicyLayout, {
  type LegalSection,
} from "@/components/pages/LegalPolicyLayout";
import { isLocale, type Locale } from "@/i18n/config";
import { generatePageMetadata } from "@/lib/page-seo";
import { getLegalPage } from "@/lib/legal-pages";

type PrivacyPolicyPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const fallbackSections: LegalSection[] = [
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    paragraphs: [
      "Pharma Metric Labs respects the privacy of website visitors, prospective clients, sponsors, business partners, job applicants, and other individuals who interact with this website.",
      "This Privacy Policy explains how information may be collected, used, stored, disclosed, and protected when you access the Pharma Metric Labs website or submit information through its available features.",
      "For further information, please contact Pharma Metric Labs through the Contact Us page.",
    ],
  },
];

export async function generateMetadata({
  params,
}: PrivacyPolicyPageProps): Promise<Metadata> {
  const resolvedParams = await params;

  const locale: Locale = isLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : "en";

  const isIndonesian = locale === "id";

  const cmsPage = await getLegalPage("PRIVACY_POLICY");

  return generatePageMetadata(`/${locale}/privacy-policy`, {
    title:
      (isIndonesian
        ? cmsPage?.titleId
        : cmsPage?.titleEn) ||
      (isIndonesian ? "Kebijakan Privasi" : "Privacy Policy"),

    description:
      (isIndonesian
        ? cmsPage?.metaDescriptionId
        : cmsPage?.metaDescriptionEn) ||
      (isIndonesian
        ? "Kebijakan Privasi Pharma Metric Labs mengenai pengelolaan informasi melalui website."
        : "Pharma Metric Labs Privacy Policy regarding information management through this website."),
  });
}

export default async function PrivacyPolicyPage({
  params,
}: PrivacyPolicyPageProps) {
  const resolvedParams = await params;

  const locale: Locale = isLocale(resolvedParams.locale)
    ? resolvedParams.locale
    : "en";

  const isIndonesian = locale === "id";

  const cmsPage = await getLegalPage("PRIVACY_POLICY");

  const title =
    (isIndonesian
      ? cmsPage?.titleId
      : cmsPage?.titleEn) ||
    (isIndonesian ? "Kebijakan Privasi" : "Privacy Policy");

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
          ? "Kebijakan ini menjelaskan bagaimana Pharma Metric Labs mengelola dan melindungi informasi yang disampaikan melalui website."
          : "This policy explains how Pharma Metric Labs manages and protects information submitted through this website."
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
          ? "Informasi Cookies"
          : "Cookie Information"
      }
      relatedDescription={
        isIndonesian
          ? "Pelajari penggunaan cookies melalui Kebijakan Cookies Pharma Metric Labs."
          : "Learn about cookie usage through the Pharma Metric Labs Cookie Policy."
      }
      relatedHref="/cookie-policy"
      relatedLabel={
        isIndonesian
          ? "Lihat Kebijakan Cookies"
          : "View Cookie Policy"
      }
    />
  );
}
