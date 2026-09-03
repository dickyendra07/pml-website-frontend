type BuildContentSecurityPolicyOptions = {
  additionalImageOrigins?: string;
  isProduction: boolean;
  isVercel: boolean;
  mediaOrigins: readonly string[];
};

function unique(values: readonly string[]) {
  return [...new Set(values)];
}

export function parseTrustedOrigins(
  rawValue: string | undefined,
  options: { allowHttp: boolean; variableName: string },
) {
  if (!rawValue?.trim()) return [];

  const values = rawValue.split(/[\s,]+/).filter(Boolean);

  if (values.length > 20) {
    throw new Error(`${options.variableName} accepts at most 20 origins.`);
  }

  return unique(
    values.map((value, index) => {
      let url: URL;

      try {
        url = new URL(value);
      } catch {
        throw new Error(
          `${options.variableName} entry ${index + 1} must be an absolute origin.`,
        );
      }

      const allowedProtocol =
        url.protocol === "https:" ||
        (options.allowHttp && url.protocol === "http:");

      if (
        !allowedProtocol ||
        url.username ||
        url.password ||
        url.pathname !== "/" ||
        url.search ||
        url.hash ||
        value.includes("*")
      ) {
        throw new Error(
          `${options.variableName} entry ${index + 1} must be a trusted ${
            options.allowHttp ? "HTTP(S)" : "HTTPS"
          } origin without credentials, wildcards, paths, queries, or fragments.`,
        );
      }

      return url.origin;
    }),
  );
}

export function buildContentSecurityPolicy({
  additionalImageOrigins,
  isProduction,
  isVercel,
  mediaOrigins,
}: BuildContentSecurityPolicyOptions) {
  const trustedStorageOrigins = parseTrustedOrigins(additionalImageOrigins, {
    allowHttp: !isProduction,
    variableName: "CSP_MEDIA_ORIGINS",
  });
  const scriptSources = [
    "'self'",
    "'unsafe-inline'",
    ...(isProduction ? [] : ["'unsafe-eval'"]),
    ...(isVercel ? ["https://vercel.live"] : []),
    "https://www.googletagmanager.com",
  ];
  const imageSources = unique([
    "'self'",
    "data:",
    "blob:",
    ...mediaOrigins,
    ...trustedStorageOrigins,
    "https://www.google-analytics.com",
    "https://www.googletagmanager.com",
  ]);
  const connectSources = unique([
    "'self'",
    ...mediaOrigins,
    "https://www.google-analytics.com",
    "https://region1.google-analytics.com",
    "https://www.googletagmanager.com",
    ...(isProduction
      ? []
      : ["http://127.0.0.1:4000", "ws:", "wss:"]),
  ]);
  const frameSources = [
    "'self'",
    ...(isVercel ? ["https://vercel.live"] : []),
    "https://www.google.com",
    "https://maps.google.com",
  ];

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    `script-src ${scriptSources.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src ${imageSources.join(" ")}`,
    "font-src 'self' data:",
    `connect-src ${connectSources.join(" ")}`,
    `frame-src ${frameSources.join(" ")}`,
    ...(isProduction ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
}
