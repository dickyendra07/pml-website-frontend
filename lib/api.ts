import { resolveMediaUrl, type MediaSource } from "./media";

export type ProposalPayload = {
  name: string;
  company: string;
  email: string;
  phone?: string;
  country?: string;
  serviceType: string;
  projectNeeds: string;
  sourcePage?: string;
};

export type ApiSubmitResult = {
  success: boolean;
  message: string;
  id?: string;
};


const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:4000/api"
    : "");

const hasApiBaseUrl = API_BASE_URL.length > 0;


export async function submitProposal(
  payload: ProposalPayload,
): Promise<ApiSubmitResult> {
  const response = await fetch(`${API_BASE_URL}/proposals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json()) as Partial<ApiSubmitResult>;

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Failed to submit request. Please try again.",
    );
  }

  return {
    success: true,
    message: result.message || "Request submitted successfully.",
    id: result.id,
  };
}

export type CatalogueDownloadMode = "PUBLIC_DOWNLOAD" | "REQUEST_REQUIRED";

export type CatalogueItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  serviceType: string | null;
  fileUrl: string | null;
  coverImage: string | null;
  downloadMode: CatalogueDownloadMode;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

type CatalogueApiItem = Omit<
  CatalogueItem,
  "fileUrl" | "coverImage"
> & {
  fileUrl: MediaSource;
  coverImage: MediaSource;
};

function normalizeCatalogue(item: CatalogueApiItem): CatalogueItem {
  return {
    ...item,
    fileUrl: resolveMediaUrl(item.fileUrl) || null,
    coverImage: resolveMediaUrl(item.coverImage) || null,
  };
}

export async function getCatalogues(): Promise<CatalogueItem[]> {
  if (!hasApiBaseUrl) {
    return [];
  }

  const response = await fetch(`${API_BASE_URL}/catalogues`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load catalogues.");
  }

  const items = (await response.json()) as CatalogueApiItem[];

  return Array.isArray(items) ? items.map(normalizeCatalogue) : [];
}

export async function submitCatalogueRequest(payload: {
  catalogueId?: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  message?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/catalogues/requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      result && typeof result === "object" && "message" in result
        ? String(result.message)
        : "Failed to submit catalogue request.";

    throw new Error(message);
  }

  return result;
}

export type InsightItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string;
  coverImage: string | null;
  tags: string[];
  seoTitle: string;
  metaDescription: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isFeatured: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type InsightApiItem = Omit<InsightItem, "coverImage"> & {
  coverImage: MediaSource;
};

function normalizeInsight(item: InsightApiItem): InsightItem {
  return {
    ...item,
    coverImage: resolveMediaUrl(item.coverImage) || null,
  };
}

export async function getInsights(
  category?: string,
  locale: "en" | "id" = "en",
) {
  if (!hasApiBaseUrl) {
    return [];
  }

  const searchParams = new URLSearchParams();

  if (category) {
    searchParams.set("category", category);
  }

  searchParams.set("locale", locale);

  const response = await fetch(
    `${API_BASE_URL}/insights?${searchParams.toString()}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to load insights.");
  }

  const items = (await response.json()) as InsightApiItem[];

  return Array.isArray(items) ? items.map(normalizeInsight) : [];
}

export async function getInsightBySlug(
  slug: string,
  locale: "en" | "id" = "en",
) {
  if (!hasApiBaseUrl) {
    return null;
  }

  const response = await fetch(
    `${API_BASE_URL}/insights/${slug}?locale=${locale}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return null;
  }

  const item = (await response.json()) as InsightApiItem;

  return normalizeInsight(item);
}

export type HomepageFeature = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  referenceId: string | null;
  imageUrl: string | null;
  buttonLabel: string | null;
  buttonUrl: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

type HomepageFeatureApiItem = Omit<HomepageFeature, "imageUrl"> & {
  imageUrl: MediaSource;
};

function normalizeHomepageFeature(
  item: HomepageFeatureApiItem,
): HomepageFeature {
  return {
    ...item,
    imageUrl: resolveMediaUrl(item.imageUrl) || null,
  };
}

export async function getHomepageFeatures(
  type?: string,
): Promise<HomepageFeature[]> {
  if (!hasApiBaseUrl) {
    return [];
  }

  const searchParams = type ? `?type=${encodeURIComponent(type)}` : "";

  const response = await fetch(
    `${API_BASE_URL}/homepage-features${searchParams}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to load homepage features.");
  }

  const items = (await response.json()) as HomepageFeatureApiItem[];

  return Array.isArray(items) ? items.map(normalizeHomepageFeature) : [];
}

export type CareerItem = {
  id: string;
  title: string;
  slug: string;
  department: string | null;
  location: string | null;
  employmentType: string | null;
  experienceLevel: string | null;
  summary: string | null;
  description: string | null;
  responsibilities: string | null;
  requirements: string | null;
  benefits: string | null;
  applyEmail: string | null;
  applyUrl: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  sortOrder: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function getCareers() {
  if (!hasApiBaseUrl) {
    return [];
  }

  const response = await fetch(`${API_BASE_URL}/careers`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load careers.");
  }

  return (await response.json()) as CareerItem[];
}


export type FacilityApiItem = {
  id: string;
  key: string;
  titleEn: string;
  titleId: string | null;
  eyebrowEn: string | null;
  eyebrowId: string | null;
  summaryEn: string | null;
  summaryId: string | null;
  contentEn: string | null;
  contentId: string | null;
  image: string | null;
  gallery: Array<{
    id: string;
    image: string;
    titleEn?: string;
    titleId?: string;
    captionEn?: string;
    captionId?: string;
    sortOrder?: number;
  }>;
  pointsEn: string[];
  pointsId: string[];
  category: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  sortOrder: number;
};

export type FacilityFrontendItem = {
  key:
    | "clinical-facilities"
    | "analytical-facilities"
    | "supporting-facilities"
    | "vr-gallery";
  title: string;
  eyebrow: string;
  href: string;
  summary: string;
  image: string;
  gallery: string[];
  points: string[];
};

export async function getFacilities() {
  if (!hasApiBaseUrl) {
    console.log("NO API BASE URL");
    return [];
  }

  const response = await fetch(`${API_BASE_URL}/facilities`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load facilities.");
  }

  return (await response.json()) as FacilityApiItem[];
}

export async function getFacilityByKey(key: string) {
  const facilities = await getFacilities();

  const item = facilities.find(
    (facility) => facility.key === key,
  );

  if (!item) {
    return null;
  }

  return {
    key: item.key as FacilityFrontendItem["key"],
    title: item.titleEn,
    eyebrow: item.eyebrowEn || "",
    href: `/facilities/${item.key}`,
    summary: item.summaryEn || "",
    image: resolveMediaUrl(item.image),
    gallery: Array.isArray(item.gallery)
      ? item.gallery.map((gallery) => resolveMediaUrl(gallery.image))
      : [],
    points: item.pointsEn || [],
  } satisfies FacilityFrontendItem;
}
