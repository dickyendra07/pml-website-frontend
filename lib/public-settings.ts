export type PublicSettings = Record<string, string | number | boolean | null>;

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  (process.env.NODE_ENV === "development" ? "http://localhost:4000/api" : "");

const hasApiBaseUrl = API_BASE_URL.length > 0;

export const fallbackPublicSettings: PublicSettings = {
  "company.name": "PML",
  "company.description":
    "PML supports pharmaceutical and biotechnology companies with scientific CRO services for BA/BE study, clinical trial, contract analysis, and regulatory management.",
  "contact.address": "Gedung Indra Sentral Unit R & T, Jakarta Pusat, Indonesia",
  "contact.email": "info@pharmametriclabs.com",
  "contact.secondaryEmail": "",
  "contact.phone": "(021) 426 5310",
  "footer.copyright": "PML. All rights reserved.",
  "proposal.recipientEmail": "info@pharmametriclabs.com",
  "seo.defaultTitle": "Pharma Metric Labs | Contract Research Organization in Indonesia",
  "seo.defaultDescription": "Integrated CRO services for pharmaceutical development, including BA/BE study, clinical trial, contract analysis, and regulatory management.",
  "social.instagram": "https://www.instagram.com/pharmametriclabs/",
  "social.linkedin": "https://www.linkedin.com/company/pharma-metric-labs/",
};

export function getSettingValue(
  settings: PublicSettings,
  key: string,
  fallback = ""
) {
  const value = settings[key];

  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  return fallback;
}

export async function getPublicSettings() {
  if (!hasApiBaseUrl) {
    return fallbackPublicSettings;
  }

  const response = await fetch(`${API_BASE_URL}/settings/public`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load public settings.");
  }

  return (await response.json()) as PublicSettings;
}
