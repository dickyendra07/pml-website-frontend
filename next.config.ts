import type { NextConfig } from "next";
import {
  buildContentSecurityPolicy,
  parseTrustedOrigins,
} from "./lib/security/csp";

const isProduction = process.env.NODE_ENV === "production";
const isVercel = process.env.VERCEL === "1";
const configuredApiOrigin = process.env.NEXT_PUBLIC_API_URL?.replace(
  /\/api\/?$/,
  "",
);
const mediaOrigins = [
  process.env.NEXT_PUBLIC_MEDIA_URL,
  process.env.NEXT_PUBLIC_MEDIA_DELIVERY_URL,
  configuredApiOrigin,
  ...(isProduction ? [] : ["http://localhost:4000"]),
]
  .filter((value): value is string => Boolean(value))
  .flatMap((value) =>
    parseTrustedOrigins(value, {
      allowHttp: !isProduction,
      variableName: "configured media origin",
    }),
  );

const remoteImagePatterns = [...new Set(mediaOrigins)].map(
  (origin) => new URL("/**", origin),
);

const contentSecurityPolicy = buildContentSecurityPolicy({
  additionalImageOrigins: process.env.CSP_MEDIA_ORIGINS,
  isProduction,
  isVercel,
  mediaOrigins,
});

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  ...(isProduction
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains; preload",
        },
      ]
    : []),
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin-allow-popups",
  },
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
];

const nextConfig: NextConfig = {
  // Vercel's Next.js adapter owns the deployment output on Vercel. Keep the
  // standalone bundle for the Docker image, where the generated server.js is
  // the runtime entrypoint.
  output: isVercel ? undefined : "standalone",
  poweredByHeader: false,
  // Host validation must run before canonical path redirects. Next's built-in
  // trailing-slash redirect runs ahead of proxy and would otherwise answer an
  // untrusted Host header before the allowlist can evaluate it.
  skipTrailingSlashRedirect: true,

  images: {
    remotePatterns: remoteImagePatterns,
    dangerouslyAllowLocalIP: !isProduction,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store, max-age=0",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
