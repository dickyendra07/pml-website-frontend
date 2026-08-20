const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL = (
  configuredSiteUrl ||
  (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "")
).replace(/\/$/, "");

if (!SITE_URL) {
  throw new Error("NEXT_PUBLIC_SITE_URL is required in production.");
}
