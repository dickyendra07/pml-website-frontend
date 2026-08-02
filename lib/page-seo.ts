import type { Metadata } from "next";
import { resolveMediaUrl, type MediaSource } from "@/lib/media";

export type PageSeo = {
  path: string;
  label: string;
  title: string;
  description: string;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  canonicalUrl?: string | null;
};

type PageSeoApiItem = Omit<PageSeo, "ogImage"> & {
  ogImage?: MediaSource;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  (process.env.NODE_ENV === "development" ? "http://localhost:4000/api" : "");

const hasApiBaseUrl = API_BASE_URL.length > 0;

const SITE_NAME = "Pharma Metric Labs";
const SITE_URL = "https://pharmametriclabs.com";
const DEFAULT_OG_IMAGE = "/images/pml/hero-lab-hexagon.png";

export async function getPageSeo(path: string): Promise<PageSeo | null> {
  if (!hasApiBaseUrl) {
    return null;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/page-seo?path=${encodeURIComponent(path)}`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const item = (await response.json()) as PageSeoApiItem;

    return {
      ...item,
      ogImage: resolveMediaUrl(item.ogImage) || null,
    };
  } catch {
    return null;
  }
}

export async function generatePageMetadata(
  path: string,
  fallback: {
    title: string;
    description: string;
  }
): Promise<Metadata> {
  const seo = await getPageSeo(path);

  const title = seo?.title || fallback.title;
  const description = seo?.description || fallback.description;
  const ogTitle = seo?.ogTitle || title;
  const ogDescription = seo?.ogDescription || description;
  const canonicalUrl = seo?.canonicalUrl || `${SITE_URL}${path === "/" ? "" : path}`;
  const ogImage = resolveMediaUrl(seo?.ogImage) || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
  };
}
