# PML Frontend — Production Regression Remediation

Date: 2026-09-03  
Scope: Host allowlist/container health and CSP/private signed media  
Deployment: none

## A. Root Cause

### Host allowlist versus Docker healthcheck

The previous healthcheck requested `http://127.0.0.1:3000/`, which presents `Host: 127.0.0.1:3000`. A production allowlist containing only public PML hostnames correctly rejects that request with 421, so Docker could mark a healthy process unhealthy.

The earlier allowlist also accepted `NEXT_PUBLIC_SITE_URL` as a fallback and allowed all Hosts when no list existed. That is unsafe as a production control: Next.js public variables are build-time values, whereas a standalone image may be promoted into a runtime with different hostnames.

### CSP versus signed private media

The browser starts an image request at the allowed CMS origin, but `/api/media/read` redirects it to a temporary private provider URL. CSP evaluates image fetches against the request's current/final URL after redirects. The provider origin therefore needs to match `img-src`; allowing only the CMS origin can block otherwise valid signed S3/OBS images.

## B. Files Changed

- `.env.example`: documents runtime `ALLOWED_HOSTS` and build-time `CSP_MEDIA_ORIGINS`.
- `Dockerfile`: requires the CSP media-origin build input and uses an approved runtime Host when probing `/internal/health`.
- `app/internal/health/route.ts`: minimal 200 JSON liveness with `Cache-Control: no-store`.
- `lib/internal-health.ts`: exact health-path predicate.
- `lib/request-host.ts`: production fails closed and no longer trusts `NEXT_PUBLIC_SITE_URL` for authorization.
- `lib/security/csp.ts`: validated, reusable CSP source generation.
- `next.config.ts`: integrates exact final media origins into `img-src`.
- `proxy.ts`: exempts only the exact health path from locale transformation, after Host validation.
- `tests/csp.test.mjs`, `tests/internal-health.test.mjs`, `tests/request-host.test.mjs`: regression coverage.
- Main security audit: corrected runtime, media, test, and remaining-risk statements.

## C. Host Allowlist Final Flow

```text
Runtime ALLOWED_HOSTS
        │
        ├─ absent in production → every request rejected; healthcheck fails
        │
        └─ present
             │
incoming Host ── not listed → 421
             │ listed
             ▼
       trailing-slash handling
             ▼
 exact /internal/health → no locale redirect → 200/no-store
 other path → normal locale/public/admin routing
```

`NEXT_PUBLIC_SITE_URL` remains a public build-time application value. It can ease local development, but it does not authorize production Hosts. The Docker image does not bake `ALLOWED_HOSTS`; deployment must inject it at runtime. Container inspection confirmed the test runner had `ALLOWED_HOSTS` while `NEXT_PUBLIC_SITE_URL` was absent.

## D. Docker Healthcheck Result

The full Docker image built successfully using the repository's exact Turbopack `npm run build`. The real embedded healthcheck ran against the standalone server and Docker reported `running healthy` with repeated exit code 0 results.

The healthcheck connects to loopback, selects the first runtime-approved Host, and requests `/internal/health`. It does not add localhost or an IP to the application's allowlist. An approved public Host returned normal routing, a malicious Host returned 421, and the health route returned 200 with no-store caching.

## E. CSP Media Final Flow

```text
Browser image URL: CMS /api/media/read?key=...
        │ allowed by configured CMS media origin
        ▼
302 temporary signed URL
        │ URL/query is neither stored nor added to CSP
        ▼
Exact final origin from CSP_MEDIA_ORIGINS
        ├─ AWS build: exact private bucket/CDN HTTPS origin
        └─ Huawei build: exact private OBS/CDN HTTPS origin
        ▼
img-src match → browser may load the private signed image
```

`CSP_MEDIA_ORIGINS` is architecture-neutral and build-time because CSP headers are compiled by `next.config.ts`. It accepts up to 20 exact origins and rejects production HTTP, credentials, wildcards, paths, queries, and fragments. AWS and Huawei deployments may provide different values. Private bucket policy and short-lived signed URLs remain unchanged; no UI component knows which provider is active.

Google Analytics, Google Tag Manager, Google Maps, `'self'`, `data:`, `blob:`, configured CMS/media origins, and normal static images remain permitted. Scheme-wide `https:` was not restored.

## F. Remaining CSP Findings

- **REMAINING:** `script-src 'unsafe-inline'` for the current GTM/Next execution model.
- **REMAINING:** `style-src 'unsafe-inline'` for current Next/React/application styling.

Nonce migration is explicitly out of scope. These findings are staged remediation, not fixed or closed.

## G. Tests

- `npm run lint`: pass.
- `npx tsc --noEmit`: pass.
- `npm test`: pass, 22/22.
- `npm run build`: exact command passes inside the full Docker build. On the host execution sandbox, production-safe configuration loads but Turbopack cannot bind its internal worker port; `next build --webpack` passes and generates 77 routes.
- Full Docker build: pass.
- Docker health status: `running healthy`.
- Approved Host: normal 307 to `/en`.
- Malicious Host: 421.
- Internal health with approved Host: 200, `Cache-Control: no-store`.
- AWS final CSP origin: present in `img-src`; no scheme-wide `https:`.
- Huawei final CSP origin: present in `img-src`; no scheme-wide `https:`.
- `git diff --check`: pass.

## H. Final Verdict

**FRONTEND REGRESSION RISKS REMEDIATED — READY FOR CODE REVIEW**

Deployment still requires two explicit values: runtime `ALLOWED_HOSTS` and build-time `CSP_MEDIA_ORIGINS`. Do not approve a production rollout until both are set to the deployment's exact public and final private-media origins.
