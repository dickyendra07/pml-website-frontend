import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

import GoogleTagManager from "@/components/analytics/GoogleTagManager";
import { getSeoDefaults } from "@/lib/server-settings";
import { SITE_URL } from "@/lib/site-url";

const kalbeHelix = localFont({
  src: [
    {
      path: "../public/fonts/kalbe/KalbeHelix-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/kalbe/KalbeHelix-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/kalbe/KalbeHelix-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/kalbe/KalbeHelix-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/kalbe/KalbeHelix-ExtraBold.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-kalbe-helix",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoDefaults();

  const isProductionSite = SITE_URL === "https://pharmametriclabs.com";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: seo.title,
      template: `%s | ${seo.companyName}`,
    },
    description: seo.description,
    applicationName: seo.companyName,
    authors: [{ name: seo.companyName }],
    creator: seo.companyName,
    publisher: seo.companyName,
    keywords: [
      "Pharma Metric Labs",
      "PML",
      "Contract Research Organization",
      "CRO Indonesia",
      "BA/BE Study",
      "Bioequivalence Study",
      "Clinical Trial",
      "Contract Analysis",
      "Regulatory Management",
      "BPOM Registration",
      "Pharmaceutical Development",
    ],
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: SITE_URL,
      siteName: seo.companyName,
      title: seo.title,
      description: seo.description,
      images: [
        {
          url: "/images/pml/hero-lab-hexagon.png",
          width: 1200,
          height: 630,
          alt: `${seo.companyName} laboratory and CRO services`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: ["/images/pml/hero-lab-hexagon.png"],
    },
    icons: {
      icon: [
        {
          url: "/favicon.ico",
          sizes: "64x64",
          type: "image/x-icon",
        },
        {
          url: "/icon.png",
          type: "image/png",
        },
      ],
      apple: [
        {
          url: "/apple-icon.png",
          type: "image/png",
        },
      ],
    },
    robots: {
      index: isProductionSite,
      follow: isProductionSite,
      googleBot: {
        index: isProductionSite,
        follow: isProductionSite,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-locale="en">
      <body className={`${kalbeHelix.className} ${kalbeHelix.variable}`}>
        <GoogleTagManager />

        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MNT2NKMQ"
            height="0"
            width="0"
            style={{
              display: "none",
              visibility: "hidden",
            }}
          />
        </noscript>

        {children}
      </body>
    </html>
  );
}
