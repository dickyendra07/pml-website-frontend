const DEVELOPMENT_API_BASE_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:4000/api" : "";

const CONFIGURED_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || DEVELOPMENT_API_BASE_URL;

const CONFIGURED_LEGACY_MEDIA_BASE_URL = process.env.NEXT_PUBLIC_MEDIA_URL;

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

export type MediaUrlOptions = {
  apiBaseUrl?: string;
  legacyMediaBaseUrl?: string;
};

function withoutTrailingSlash(value: string | undefined) {
  return (value || "").trim().replace(/\/$/, "");
}

function apiOrigin(value: string | undefined) {
  return withoutTrailingSlash(value).replace(/\/api\/?$/, "");
}

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

export function resolveMediaUrl(
  value: MediaSource,
  options: MediaUrlOptions = {},
) {
  const path = getMediaPath(value);

  if (!path) return "";

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (path.startsWith("/api/media/read?")) {
    const cmsOrigin = apiOrigin(
      options.apiBaseUrl ?? CONFIGURED_API_BASE_URL,
    );

    return cmsOrigin ? `${cmsOrigin}${path}` : path;
  }

  if (path === "/uploads" || path.startsWith("/uploads/")) {
    const legacyOrigin = withoutTrailingSlash(
      options.legacyMediaBaseUrl ??
        CONFIGURED_LEGACY_MEDIA_BASE_URL ??
        apiOrigin(options.apiBaseUrl ?? CONFIGURED_API_BASE_URL),
    );

    return legacyOrigin ? `${legacyOrigin}${path}` : path;
  }

  return path;
}

export function shouldBypassImageOptimization(value: MediaSource) {
  const url = resolveMediaUrl(value);
  if (!url) return false;

  // Browser delivery is the stable path for private backend redirects and
  // legacy files. It avoids coupling rendering to the optimizer's build-time
  // allowlist while preserving the backend's temporary signed URL security.
  if (
    url.startsWith("/api/media/read?") ||
    url === "/uploads" ||
    url.startsWith("/uploads/")
  ) {
    return true;
  }

  try {
    const parsed = new URL(url);

    if (
      parsed.pathname === "/api/media/read" ||
      parsed.pathname === "/uploads" ||
      parsed.pathname.startsWith("/uploads/")
    ) {
      return true;
    }
  } catch {
    // Non-absolute application paths are handled above.
  }

  return /[?&](X-Amz-Signature|Signature|AccessKeyId|AWSAccessKeyId)=/i.test(
    url,
  );
}
