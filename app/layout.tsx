import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ClientShell from "@/components/ClientShell";
import CookieConsent from "@/components/CookieConsent";
import DocumentLanguage from "@/components/DocumentLanguage";
import { getSeoDefaults } from "@/lib/server-settings";

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

  return {
    metadataBase: new URL("https://pharmametriclabs.com"),
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
      url: "https://pharmametriclabs.com",
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
        { url: "/favicon.ico", sizes: "64x64", type: "image/x-icon" },
        { url: "/icon.png", type: "image/png" },
      ],
      apple: [{ url: "/apple-icon.png", type: "image/png" }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
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
    <html lang="en">
      <body className={`${kalbeHelix.className} ${kalbeHelix.variable}`}>
        <DocumentLanguage />
        <ClientShell>{children}</ClientShell>
        <CookieConsent />
      </body>
    </html>
  );
}
