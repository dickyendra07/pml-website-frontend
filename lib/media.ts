const MEDIA_BASE_URL =
  (
    process.env.NEXT_PUBLIC_MEDIA_URL ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:4000"
      : "")
  ).replace(/\/$/, "");

export type MediaSource =
  | string
  | {
      url?: MediaSource;
      path?: MediaSource;
      src?: MediaSource;
    }
  | null
  | undefined;

function getMediaPath(
  value: MediaSource,
  visited = new Set<object>(),
): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (!value || typeof value !== "object" || visited.has(value)) {
    return "";
  }

  visited.add(value);

  for (const candidate of [value.url, value.path, value.src]) {
    const path = getMediaPath(candidate, visited);

    if (path) {
      return path;
    }
  }

  return "";
}

export function resolveMediaUrl(value: MediaSource) {
  const path = getMediaPath(value);

  if (!path) return "";

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (path === "/uploads" || path.startsWith("/uploads/")) {
    return MEDIA_BASE_URL
      ? `${MEDIA_BASE_URL}${path}`
      : path;
  }

  return path;
}
