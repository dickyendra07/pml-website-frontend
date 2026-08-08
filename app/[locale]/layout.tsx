import { notFound } from "next/navigation";

import ClientShell from "@/components/ClientShell";
import CookieConsent from "@/components/CookieConsent";
import DocumentLanguage from "@/components/DocumentLanguage";
import { isLocale, locales } from "@/i18n/config";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  console.log("LOCALE LAYOUT RUN:", locale);

  console.log("LOCALE LAYOUT RUN:", locale);

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <>
      <DocumentLanguage locale={locale} />
      <ClientShell key={locale} locale={locale}>
        {children}
      </ClientShell>
      <CookieConsent locale={locale} />
    </>
  );
}
