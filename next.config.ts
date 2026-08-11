import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";
const isVercel = process.env.VERCEL === "1";
const mediaOrigins = [
  process.env.NEXT_PUBLIC_MEDIA_URL,
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, ""),
  ...(isProduction ? [] : ["http://localhost:4000"]),
]
  .filter((value): value is string => Boolean(value))
  .map((value) => new URL(value).origin);

const remoteImagePatterns = [...new Set(mediaOrigins)].map(
  (origin) => new URL("/uploads/**", origin),
);

const scriptSources = [
  "'self'",
  "'unsafe-inline'",
  ...(isProduction ? [] : ["'unsafe-eval'"]),
  "https://vercel.live",
  "https://www.googletagmanager.com",
];

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  `script-src ${scriptSources.join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https: http://localhost:4000 http://127.0.0.1:4000",
  "font-src 'self' data:",
  "connect-src 'self' https: http://localhost:4000 http://127.0.0.1:4000 ws: wss:",
  "frame-src 'self' https://vercel.live https://www.google.com https://maps.google.com",
  ...(isProduction ? ["upgrade-insecure-requests"] : []),
].join("; ");

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
    ];
  },
};

export default nextConfig;
