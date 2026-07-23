import type { Metadata } from "next";
import { notFound } from "next/navigation";

import HomepagePopup from "@/components/popups/HomepagePopup";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import Services from "@/components/home/Services";
import WhyPml from "@/components/home/WhyPml";
import CTACard from "@/components/ui/CTACard";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale } from "@/i18n/config";

type LocalizedHomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: LocalizedHomePageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  if (locale === "id") {
    return {
      title: "Pharma Metric Labs | Organisasi Riset Kontrak di Indonesia",
      description:
        "PML menyediakan layanan CRO terintegrasi di Indonesia, termasuk studi BA/BE, uji klinis, analisis kontrak, dan manajemen regulasi.",
      alternates: {
        canonical: "/id",
        languages: {
          en: "/en",
          id: "/id",
          "x-default": "/en",
        },
      },
    };
  }

  return {
    title: "Pharma Metric Labs | Contract Research Organization in Indonesia",
    description:
      "PML provides integrated CRO services in Indonesia, including BA/BE study, clinical trial, contract analysis, and regulatory management.",
    alternates: {
      canonical: "/en",
      languages: {
        en: "/en",
        id: "/id",
        "x-default": "/en",
      },
    },
  };
}

export default async function LocalizedHomePage({
  params,
}: LocalizedHomePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale);

  return (
    <main data-language={locale} data-home-heading={dictionary.navigation.home}>
      <Hero />
      <Stats />
      <Services />
      <WhyPml />
      <CTACard
        eyebrow={locale === "id" ? "Mulai Sebuah Proyek" : "Start a Project"}
        title={
          locale === "id"
            ? "Kami siap mendukung kebutuhan Anda"
            : "We are ready to support you"
        }
        description={
          locale === "id"
            ? "Sampaikan kebutuhan proyek Anda kepada tim kami. Kami akan membantu menentukan ruang lingkup layanan, informasi yang diperlukan, dan langkah selanjutnya."
            : "Share your project needs with our team and we will help you identify the right service scope, required information, and next steps."
        }
        primaryLabel={
          locale === "id" ? "Ajukan Proposal" : "Request a Proposal"
        }
        secondaryLabel={
          locale === "id" ? "Diskusikan Kebutuhan Anda" : "Discuss Your Needs"
        }
        secondaryHref={`/${locale}/contact`}
      />
      <HomepagePopup />
    </main>
  );
}
