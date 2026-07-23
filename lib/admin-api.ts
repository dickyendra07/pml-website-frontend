export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type AdminLoginResult = {
  accessToken: string;
  user: AdminUser;
};

export type InquiryStatus =
  "NEW" | "IN_REVIEW" | "CONTACTED" | "CLOSED" | "SPAM";

export type ProposalSubmission = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string | null;
  country: string | null;
  serviceType: string;
  projectNeeds: string;
  sourcePage: string | null;
  status: InquiryStatus;
  internalNote: string | null;
  createdAt: string;
  updatedAt: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  (process.env.NODE_ENV === "development" ? "http://localhost:4000/api" : "");

const hasApiBaseUrl = API_BASE_URL.length > 0;

const TOKEN_KEY = "pml_admin_token";

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      result && typeof result === "object" && "message" in result
        ? String(result.message)
        : "Request failed. Please try again.";

    throw new Error(message);
  }

  return result as T;
}

export async function loginAdmin(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/admin/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return parseJsonResponse<AdminLoginResult>(response);
}

export async function getCurrentAdmin(token: string) {
  const response = await fetch(`${API_BASE_URL}/admin/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseJsonResponse<AdminUser>(response);
}

export async function logoutAdmin(token: string) {
  const response = await fetch(`${API_BASE_URL}/admin/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseJsonResponse<{ success: boolean; message: string }>(response);
}

export async function getAdminProposals(token: string) {
  const response = await fetch(`${API_BASE_URL}/admin/proposals`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return parseJsonResponse<ProposalSubmission[]>(response);
}

export async function getAdminProposalDetail(token: string, id: string) {
  const response = await fetch(`${API_BASE_URL}/admin/proposals/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return parseJsonResponse<ProposalSubmission>(response);
}

export async function updateAdminProposalStatus(
  token: string,
  id: string,
  status: InquiryStatus,
) {
  const response = await fetch(`${API_BASE_URL}/admin/proposals/${id}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  return parseJsonResponse<ProposalSubmission>(response);
}

export async function updateAdminProposalNote(
  token: string,
  id: string,
  internalNote: string,
) {
  const response = await fetch(
    `${API_BASE_URL}/admin/proposals/${id}/internal-note`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ internalNote }),
    },
  );

  return parseJsonResponse<ProposalSubmission>(response);
}

export async function markAdminProposalAsSpam(token: string, id: string) {
  const response = await fetch(`${API_BASE_URL}/admin/proposals/${id}/spam`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseJsonResponse<ProposalSubmission>(response);
}

export type SiteSetting = {
  id: string;
  key: string;
  label: string;
  value: string | number | boolean | null | Record<string, unknown> | unknown[];
  group: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getAdminSettings(token: string) {
  const response = await fetch(`${API_BASE_URL}/admin/settings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return parseJsonResponse<SiteSetting[]>(response);
}

export async function updateAdminSettings(
  token: string,
  items: Array<{ key: string; value: SiteSetting["value"] }>,
) {
  const response = await fetch(`${API_BASE_URL}/admin/settings`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items }),
  });

  return parseJsonResponse<SiteSetting[]>(response);
}

export type PageSeoStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type PageSeoItem = {
  id: string;
  path: string;
  label: string;
  title: string;
  description: string;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  canonicalUrl: string | null;
  status: PageSeoStatus;
  createdAt: string;
  updatedAt: string;
};

export async function getAdminPageSeoItems(token: string) {
  const response = await fetch(`${API_BASE_URL}/admin/page-seo`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return parseJsonResponse<PageSeoItem[]>(response);
}

export async function updateAdminPageSeo(
  token: string,
  id: string,
  payload: Partial<
    Pick<
      PageSeoItem,
      | "label"
      | "title"
      | "description"
      | "ogTitle"
      | "ogDescription"
      | "ogImage"
      | "canonicalUrl"
      | "status"
    >
  >,
) {
  const response = await fetch(`${API_BASE_URL}/admin/page-seo/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<PageSeoItem>(response);
}

export async function seedAdminPageSeoDefaults(token: string) {
  const response = await fetch(`${API_BASE_URL}/admin/page-seo/seed-defaults`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseJsonResponse<PageSeoItem[]>(response);
}

export type PopupType = "ANNOUNCEMENT" | "PROMOTION" | "ALERT" | "INFORMATION";
export type PopupLayout =
  "IMAGE_LEFT" | "IMAGE_RIGHT" | "IMAGE_TOP" | "TEXT_ONLY";
export type PopupFrequency = "ONCE_PER_SESSION" | "ONCE_PER_DAY" | "ALWAYS";

export type PopupItem = {
  id: string;
  title: string;
  description: string | null;
  buttonLabel: string | null;
  buttonUrl: string | null;
  imageUrl: string | null;
  type: PopupType;
  status: PageSeoStatus;
  placementPages: string[];
  frequency: PopupFrequency;
  layout: PopupLayout;
  startsAt: string | null;
  endsAt: string | null;
  priority: number;
  createdAt: string;
  updatedAt: string;
};

export type PopupPayload = {
  title: string;
  description?: string | null;
  buttonLabel?: string | null;
  buttonUrl?: string | null;
  imageUrl?: string | null;
  type?: PopupType;
  status?: PageSeoStatus;
  placementPages?: string[];
  frequency?: PopupFrequency;
  layout?: PopupLayout;
  startsAt?: string | null;
  endsAt?: string | null;
  priority?: number;
};

export async function getAdminPopups(token: string) {
  const response = await fetch(`${API_BASE_URL}/admin/popups`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return parseJsonResponse<PopupItem[]>(response);
}

export async function createAdminPopup(token: string, payload: PopupPayload) {
  const response = await fetch(`${API_BASE_URL}/admin/popups`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<PopupItem>(response);
}

export async function updateAdminPopup(
  token: string,
  id: string,
  payload: PopupPayload,
) {
  const response = await fetch(`${API_BASE_URL}/admin/popups/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<PopupItem>(response);
}

export async function archiveAdminPopup(token: string, id: string) {
  const response = await fetch(`${API_BASE_URL}/admin/popups/${id}/archive`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseJsonResponse<PopupItem>(response);
}

export async function uploadAdminPopupImage(token: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/admin/popups/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return parseJsonResponse<{
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
  }>(response);
}

export type CatalogueDownloadMode = "PUBLIC_DOWNLOAD" | "REQUEST_REQUIRED";

export type AdminCatalogueItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  serviceType: string | null;
  fileUrl: string | null;
  coverImage: string | null;
  downloadMode: CatalogueDownloadMode;
  status: PageSeoStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    requests: number;
  };
};

export type AdminCataloguePayload = {
  title: string;
  slug?: string;
  description?: string | null;
  serviceType?: string | null;
  fileUrl?: string | null;
  coverImage?: string | null;
  downloadMode?: CatalogueDownloadMode;
  status?: PageSeoStatus;
  sortOrder?: number;
};

export async function getAdminCatalogues(token: string) {
  const response = await fetch(`${API_BASE_URL}/admin/catalogues`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return parseJsonResponse<AdminCatalogueItem[]>(response);
}

export async function createAdminCatalogue(
  token: string,
  payload: AdminCataloguePayload,
) {
  const response = await fetch(`${API_BASE_URL}/admin/catalogues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<AdminCatalogueItem>(response);
}

export async function updateAdminCatalogue(
  token: string,
  id: string,
  payload: AdminCataloguePayload,
) {
  const response = await fetch(`${API_BASE_URL}/admin/catalogues/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<AdminCatalogueItem>(response);
}

export async function archiveAdminCatalogue(token: string, id: string) {
  const response = await fetch(
    `${API_BASE_URL}/admin/catalogues/${id}/archive`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return parseJsonResponse<AdminCatalogueItem>(response);
}

export async function uploadAdminCatalogueCover(token: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/admin/catalogues/upload-cover`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  );

  return parseJsonResponse<{
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
  }>(response);
}

export async function uploadAdminCatalogueFile(token: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/admin/catalogues/upload-file`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return parseJsonResponse<{
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
  }>(response);
}

export type AdminInsightItem = {
  id: string;

  titleEn: string | null;
  slugEn: string | null;
  excerptEn: string | null;
  contentEn: string | null;
  tagsEn: string[];
  seoTitleEn: string | null;
  metaDescriptionEn: string | null;

  titleId: string | null;
  slugId: string | null;
  excerptId: string | null;
  contentId: string | null;
  tagsId: string[];
  seoTitleId: string | null;
  metaDescriptionId: string | null;

  category: string;
  coverImage: string | null;
  status: PageSeoStatus;
  isFeatured: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminInsightPayload = {
  titleEn?: string | null;
  slugEn?: string | null;
  excerptEn?: string | null;
  contentEn?: string | null;
  tagsEn?: string[];
  seoTitleEn?: string | null;
  metaDescriptionEn?: string | null;

  titleId?: string | null;
  slugId?: string | null;
  excerptId?: string | null;
  contentId?: string | null;
  tagsId?: string[];
  seoTitleId?: string | null;
  metaDescriptionId?: string | null;

  category: string;
  coverImage?: string | null;
  status?: PageSeoStatus;
  isFeatured?: boolean;
  publishedAt?: string | null;
};

export async function getAdminInsights(token: string) {
  const response = await fetch(`${API_BASE_URL}/admin/insights`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return parseJsonResponse<AdminInsightItem[]>(response);
}

export async function createAdminInsight(
  token: string,
  payload: AdminInsightPayload,
) {
  const response = await fetch(`${API_BASE_URL}/admin/insights`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<AdminInsightItem>(response);
}

export async function updateAdminInsight(
  token: string,
  id: string,
  payload: AdminInsightPayload,
) {
  const response = await fetch(`${API_BASE_URL}/admin/insights/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<AdminInsightItem>(response);
}

export async function archiveAdminInsight(token: string, id: string) {
  const response = await fetch(`${API_BASE_URL}/admin/insights/${id}/archive`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseJsonResponse<AdminInsightItem>(response);
}

export async function uploadAdminInsightCover(token: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/admin/insights/upload-cover`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return parseJsonResponse<{
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
  }>(response);
}

export type HomepageFeatureItem = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  referenceId: string | null;
  imageUrl: string | null;
  buttonLabel: string | null;
  buttonUrl: string | null;
  status: PageSeoStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type HomepageFeaturePayload = {
  title: string;
  description?: string | null;
  type?: string;
  referenceId?: string | null;
  imageUrl?: string | null;
  buttonLabel?: string | null;
  buttonUrl?: string | null;
  status?: PageSeoStatus;
  sortOrder?: number;
};

export async function getAdminHomepageFeatures(token: string) {
  const response = await fetch(`${API_BASE_URL}/admin/homepage-features`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return parseJsonResponse<HomepageFeatureItem[]>(response);
}

export async function createAdminHomepageFeature(
  token: string,
  payload: HomepageFeaturePayload,
) {
  const response = await fetch(`${API_BASE_URL}/admin/homepage-features`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<HomepageFeatureItem>(response);
}

export async function updateAdminHomepageFeature(
  token: string,
  id: string,
  payload: HomepageFeaturePayload,
) {
  const response = await fetch(
    `${API_BASE_URL}/admin/homepage-features/${id}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  return parseJsonResponse<HomepageFeatureItem>(response);
}

export async function archiveAdminHomepageFeature(token: string, id: string) {
  const response = await fetch(
    `${API_BASE_URL}/admin/homepage-features/${id}/archive`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return parseJsonResponse<HomepageFeatureItem>(response);
}

export async function uploadAdminHomepageFeatureImage(
  token: string,
  file: File,
) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/admin/homepage-features/upload-image`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  );

  return parseJsonResponse<{
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
  }>(response);
}

export type MediaAssetType = "IMAGE" | "DOCUMENT" | "VIDEO" | "OTHER";

export type MediaAssetItem = {
  id: string;
  filename: string;
  originalName: string | null;
  mimeType: string | null;
  size: number | null;
  url: string;
  type: MediaAssetType;
  altText: string | null;
  caption: string | null;
  folder: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MediaAssetPayload = {
  altText?: string | null;
  caption?: string | null;
  folder?: string | null;
  type?: MediaAssetType;
};

export async function getAdminMediaAssets(token: string) {
  const response = await fetch(`${API_BASE_URL}/admin/media`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return parseJsonResponse<MediaAssetItem[]>(response);
}

export async function updateAdminMediaAsset(
  token: string,
  id: string,
  payload: MediaAssetPayload,
) {
  const response = await fetch(`${API_BASE_URL}/admin/media/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<MediaAssetItem>(response);
}

export async function deleteAdminMediaAsset(token: string, id: string) {
  const response = await fetch(`${API_BASE_URL}/admin/media/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseJsonResponse<{ success: boolean; message: string }>(response);
}

export async function uploadAdminMediaAsset(
  token: string,
  file: File,
  folder = "general",
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch(`${API_BASE_URL}/admin/media/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return parseJsonResponse<MediaAssetItem>(response);
}

export type AdminCareerItem = {
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
  status: PageSeoStatus;
  sortOrder: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminCareerPayload = {
  title: string;
  slug?: string;
  department?: string | null;
  location?: string | null;
  employmentType?: string | null;
  experienceLevel?: string | null;
  summary?: string | null;
  description?: string | null;
  responsibilities?: string | null;
  requirements?: string | null;
  benefits?: string | null;
  applyEmail?: string | null;
  applyUrl?: string | null;
  status?: PageSeoStatus;
  sortOrder?: number;
  publishedAt?: string | null;
};

export async function getAdminCareers(token: string) {
  const response = await fetch(`${API_BASE_URL}/admin/careers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return parseJsonResponse<AdminCareerItem[]>(response);
}

export async function createAdminCareer(
  token: string,
  payload: AdminCareerPayload,
) {
  const response = await fetch(`${API_BASE_URL}/admin/careers`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<AdminCareerItem>(response);
}

export async function updateAdminCareer(
  token: string,
  id: string,
  payload: AdminCareerPayload,
) {
  const response = await fetch(`${API_BASE_URL}/admin/careers/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<AdminCareerItem>(response);
}

export async function archiveAdminCareer(token: string, id: string) {
  const response = await fetch(`${API_BASE_URL}/admin/careers/${id}/archive`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseJsonResponse<AdminCareerItem>(response);
}


export type AdminFacilityItem = {
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
  gallery: unknown;

  pointsEn: string[];
  pointsId: string[];

  category: string;
  status: PageSeoStatus;
  sortOrder: number;

  createdAt: string;
  updatedAt: string;
};

export type AdminFacilityPayload = {
  key: string;

  titleEn: string;
  titleId?: string;

  eyebrowEn?: string;
  eyebrowId?: string;

  summaryEn?: string;
  summaryId?: string;

  contentEn?: string;
  contentId?: string;

  image?: string;
  gallery?: unknown;

  pointsEn?: string[];
  pointsId?: string[];

  category: string;
  status?: PageSeoStatus;
  sortOrder?: number;
};

export async function getAdminFacilities(token: string) {
  const response = await fetch(`${API_BASE_URL}/admin/facilities`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return parseJsonResponse<AdminFacilityItem[]>(response);
}

export async function createAdminFacility(
  token: string,
  payload: AdminFacilityPayload,
) {
  const response = await fetch(`${API_BASE_URL}/admin/facilities`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<AdminFacilityItem>(response);
}

export async function updateAdminFacility(
  token: string,
  id: string,
  payload: AdminFacilityPayload,
) {
  const response = await fetch(`${API_BASE_URL}/admin/facilities/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse<AdminFacilityItem>(response);
}

export async function archiveAdminFacility(
  token: string,
  id: string,
) {
  const response = await fetch(
    `${API_BASE_URL}/admin/facilities/${id}/archive`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return parseJsonResponse<AdminFacilityItem>(response);
}

export type HealthServiceCheck = {
  status: "ok" | "error";
  responseTimeMs: number;
};

export type ApiHealthResult = {
  status: "ok" | "error";
  service: string;
  environment: string;
  timestamp: string;
  uptimeSeconds: number;
  checks: {
    api: HealthServiceCheck;
    database: HealthServiceCheck;
    redis: HealthServiceCheck;
  };
};

export type ApiConfigurationStatus = {
  configured: boolean;
  baseUrl: string;
};

export function getApiConfigurationStatus(): ApiConfigurationStatus {
  return {
    configured: hasApiBaseUrl,
    baseUrl: API_BASE_URL,
  };
}

export async function getApiHealth() {
  if (!hasApiBaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not configured for this environment.",
    );
  }

  const token = getAdminToken();

  if (!token) {
    throw new Error("Admin session is not available.");
  }

  const response = await fetch(`${API_BASE_URL}/health`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseJsonResponse<ApiHealthResult>(response);
}
