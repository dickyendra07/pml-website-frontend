function normalizeHost(value: string) {
  return value.trim().toLowerCase().replace(/\.$/, "");
}

function hostFromUrl(value: string | undefined) {
  if (!value?.trim()) return undefined;

  try {
    return new URL(value).host.toLowerCase();
  } catch {
    return undefined;
  }
}

export function getAllowedRequestHosts(environment = process.env) {
  const configuredHosts = environment.ALLOWED_HOSTS?.split(",")
    .map(normalizeHost)
    .filter(Boolean);
  const developmentSiteHost =
    environment.NODE_ENV === "production"
      ? undefined
      : hostFromUrl(environment.NEXT_PUBLIC_SITE_URL);

  return new Set([
    ...(configuredHosts ?? []),
    ...(developmentSiteHost ? [developmentSiteHost] : []),
  ]);
}

export function isRequestHostAllowed(
  host: string | null,
  environment = process.env,
) {
  const allowedHosts = getAllowedRequestHosts(environment);

  // Production fails closed. ALLOWED_HOSTS is a server-runtime control and must
  // be injected into every container; NEXT_PUBLIC_SITE_URL is build-time public
  // configuration and is deliberately not an authorization fallback.
  if (allowedHosts.size === 0) return environment.NODE_ENV !== "production";
  if (!host) return false;

  return allowedHosts.has(normalizeHost(host));
}
