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
  (process.env.NODE_ENV === "development" ? "http://localhost:4000/api" : "");

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

export async function getCatalogues() {
  if (!hasApiBaseUrl) {
    return [];
  }

  const response = await fetch(`${API_BASE_URL}/catalogues`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load catalogues.");
  }

  return (await response.json()) as CatalogueItem[];
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

  return (await response.json()) as InsightItem[];
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

export async function getHomepageFeatures(type?: string) {
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

  return (await response.json()) as HomepageFeature[];
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
