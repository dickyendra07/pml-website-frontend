const MEDIA_BASE_URL =
  (
    process.env.NEXT_PUBLIC_MEDIA_URL ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
    "http://localhost:4000"
  ).replace(/\/$/, "");

export function resolveMediaUrl(
  value?: string | null,
) {
  if (!value) return "";

  if (
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  if (value.startsWith("/uploads")) {
    return `${MEDIA_BASE_URL}${value}`;
  }

  return value;
}
