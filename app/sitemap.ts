import type { MetadataRoute } from "next";

import { locales } from "@/i18n/config";

const baseUrl = "https://pharmametriclabs.com";

const routes = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/about-us", priority: 0.8, changeFrequency: "monthly" as const },
  {
    path: "/about-us/company-profile",
    priority: 0.75,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/about-us/experts-and-team",
    priority: 0.75,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/about-us/clients",
    priority: 0.7,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/about-us/catalogue",
    priority: 0.7,
    changeFrequency: "monthly" as const,
  },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" as const },
  {
    path: "/services/babe-studies",
    priority: 0.85,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/services/clinical-trial",
    priority: 0.85,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/services/contract-analysis",
    priority: 0.85,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/services/regulatory-consultation",
    priority: 0.85,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/facilities",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/facilities/clinical-facilities",
    priority: 0.75,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/facilities/analytical-facilities",
    priority: 0.75,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/facilities/supporting-facilities",
    priority: 0.75,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/facilities/vr-gallery",
    priority: 0.65,
    changeFrequency: "monthly" as const,
  },
  { path: "/insight", priority: 0.7, changeFrequency: "weekly" as const },
  {
    path: "/insight/articles",
    priority: 0.65,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/insight/news",
    priority: 0.65,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/insight/publications",
    priority: 0.65,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/insight/faq",
    priority: 0.65,
    changeFrequency: "monthly" as const,
  },
  { path: "/careers", priority: 0.65, changeFrequency: "weekly" as const },
  { path: "/contact", priority: 0.85, changeFrequency: "monthly" as const },
  {
    path: "/privacy-policy",
    priority: 0.3,
    changeFrequency: "yearly" as const,
  },
  {
    path: "/cookie-policy",
    priority: 0.3,
    changeFrequency: "yearly" as const,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.flatMap((route) => {
    const languageAlternates = Object.fromEntries(
      locales.map((locale) => [locale, `${baseUrl}/${locale}${route.path}`]),
    );

    return locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: languageAlternates,
      },
    }));
  });
}
