export type LegalPageContent = {
  id: string;
  type: "PRIVACY_POLICY" | "COOKIE_POLICY";
  titleEn: string;
  contentEn: string;
  titleId?: string | null;
  contentId?: string | null;
  seoTitleEn?: string | null;
  metaDescriptionEn?: string | null;
  seoTitleId?: string | null;
  metaDescriptionId?: string | null;
  status: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:4000";

export async function getLegalPage(
  type: "PRIVACY_POLICY" | "COOKIE_POLICY",
): Promise<LegalPageContent | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/legal-pages/${type}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as LegalPageContent;
  } catch {
    return null;
  }
}
