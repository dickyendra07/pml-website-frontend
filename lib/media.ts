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

export type MediaVariantName =
  | "original"
  | "hero"
  | "card"
  | "thumbnail"
  | "16-9"
  | "4-3"
  | "1-1"
  | "3-4";

export type MediaReference = {
  mediaId: string | null;
  url: string;
  variant: MediaVariantName;
};

export function createMediaReference(
  value: MediaSource,
  options?: {
    mediaId?: string | null;
    variant?: MediaVariantName;
  },
): MediaReference | null {
  const url = getMediaPath(value);

  if (!url) return null;

  return {
    mediaId: options?.mediaId || null,
    url,
    variant: options?.variant || "original",
  };
}

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
