# Pharma Metric Labs — Security Remediation and Full Code-Flow Audit

Assessment date: 2026-09-03  
Repositories: `pml-website-frontend`, `pml-website-backend`  
Deployment action: none  
Production/staging data changes: none

The companion [normalized inventory](./2026-09-03-normalized-finding-inventory.md) records the reports, confidence, occurrences, classification, root cause, and owner before remediation. This document records the completed audit, code changes, validation, and residual risk.

## A. Executive Summary

### Frontend

- Supplied SAST: 61 code smells, seven security-detector findings, zero bugs, zero detected secrets, 10.6% duplication, and scanner coverage of 0%.
- Four of seven security-detector instances are resolved: the super-linear rich-text expression and three writable-runtime-copy findings. The two `Math.random()` findings are false positives because the values are transient UI identifiers. The recursive builder COPY is mitigated by a restrictive `.dockerignore` and does not reach the runtime image.
- One of 61 code-smell instances is resolved by converting the Docker healthcheck to exec form. The other 60 are maintainability/accessibility or reproducible-build debt, not demonstrated security vulnerabilities, and were intentionally not mixed into this security patch.
- The reported `sanitize-html` vulnerability and the separately discovered TipTap and Browserslist advisories are upgraded. A fresh `npm audit` reports zero vulnerabilities.
- Principal risks before this patch were an overly broad CSP, an XSS-adjacent rich-text dependency/regex path, ambiguous Host handling before framework redirects, private-media redirects to CSP-unlisted provider origins, and cache semantics on the public admin shell. Those code-owned items are remediated or staged as described below.

### Backend

- Supplied SAST: 10 code smells, five security-detector findings, zero bugs, zero detected secrets, 9.9% duplication, and scanner coverage of 0%.
- Two detector instances are resolved: the root runtime container and the synthetic cleartext parser base. The test password is a false positive, the role-key expression is bounded/anchored and not attacker-amplifiable, and recursive COPY is builder-only with a restrictive `.dockerignore`.
- The reported `deepmerge-ts` vulnerability plus separately discovered `fast-uri`, `qs`, and Browserslist advisories are pinned to patched versions. A fresh `npm audit` reports zero vulnerabilities.
- Code-flow review found and fixed additional issues not in the supplied scanner list: unauthenticated deployment fingerprinting, MIME-only upload validation, missing AWS object disposition metadata, absent login throttling, incomplete public catalogue field bounds, private-response cache policy, and undeclared proxy-hop handling.

### DAST

- Neither High alert was confirmed as the named vulnerability. The metadata alert showed only a Next 308 relative redirect and no metadata body/outbound access. The file-inclusion alert showed Next Image rejecting `/image` with HTTP 400 and no source content.
- The matching twelve missing-CSP, missing-HSTS, and server-version instances were all AWS ALB-generated 502 responses. These are one infrastructure availability/error-response cluster, not 36 application defects.
- The 113 Proxy Disclosure instances reduce to AWS ALB/Envoy identity on method/error responses. The 481 User Agent Fuzzer results were normal-response observations without crashes, stack traces, reflection, or authorization changes.
- Final verdict: **PARTIALLY REMEDIATED — INFRA CHANGES REQUIRED**. Code is ready for an application rescan after deployment to a non-production environment, but edge host allowlisting, trusted-proxy configuration, error-page headers, proxy disclosure, and the 502 burst require infrastructure owners.

## B. Architecture and Code Flow

```text
Public browser / Admin browser
        │  HTTPS — untrusted Host, path, query, headers, form/file bodies
        ▼
AWS ALB / Huawei or Envoy reverse-proxy layer        TRUST BOUNDARY 1
        │  routing, TLS, method policy, forwarded headers, edge errors
        ▼
Next.js 16 frontend
        ├─ next.config.ts: CSP and response security headers
        ├─ proxy.ts: runtime Host allowlist, trailing-slash canonicalization, locale redirects
        ├─ /internal/health: minimal no-store liveness behind the same Host check
        ├─ Server Components: public settings/SEO/legal/content fetches
        ├─ Client Components: public forms, status, popup and admin requests
        └─ Next Image/static assets
        │
        │ HTTPS to NEXT_PUBLIC_API_URL                  TRUST BOUNDARY 2
        ▼
NestJS `/api`
        ├─ bootstrap middleware: headers, CORS, validation, cache policy
        ├─ public controllers: published content, forms, public health, media read
        ├─ admin auth: email/password → bcrypt → signed JWT
        ├─ JwtAuthGuard: Bearer validation + current active-user reload
        └─ PermissionsGuard: per-route RBAC permissions
        │                                                TRUST BOUNDARY 3
        ├─ Prisma parameterized queries → PostgreSQL
        ├─ ioredis → Redis cache/rate-limit state
        └─ normalized object key → AWS S3 or Huawei OBS private object
                    └─ short-lived signed read redirect / configured private CDN

External browser destinations: Google Tag Manager/Analytics and configured Google Maps frames.
```

### Request classes

- Public paths: localized marketing pages; published settings, SEO, legal pages, popups, catalogues, insights, homepage features, careers, facilities; proposal/catalogue request submission; `/api/health/public`; and signed media-read initiation.
- Authenticated admin paths: the `/admin/*` frontend is a public client shell with no server-rendered private data. Every data operation goes to `/api/admin/*`. All such API controllers are guarded except login; mutations additionally use route permissions. Detailed health and version endpoints now require the JWT guard.
- File/media paths: admin-only multipart uploads use memory storage, size/MIME gates, central content-signature validation, generated filenames and normalized allowed key prefixes. Reads accept only an allowed object key, check existence, and redirect to a short-lived provider URL. No arbitrary filesystem send/read route was found.
- Server-side requests: public Server Components fetch settings, SEO, legal and content data from the configured API origin. The request host is not used to choose an outbound destination.
- Client-side requests: public forms/status/popups call the configured API. Admin calls read the JWT from local storage and explicitly set `Authorization: Bearer`; no ambient auth cookie is present.
- Redirects: Next locale and trailing-slash canonicalization, root `/en`, and backend media-to-signed-storage redirects. After this patch, Host validation runs before application canonical redirects.
- Rewrites/proxying: no application URL rewrite or generic forward-proxy implementation was found. Next Image fetches only origins allowed by `remotePatterns`; local-IP optimization is disabled in production.

### Environment-controlled behavior

- Frontend build time: `NEXT_PUBLIC_SITE_URL`, API origin, media origin/CDN, `CSP_MEDIA_ORIGINS`, Vercel mode, and production mode influence SSR/API destinations, image configuration, CSP, and container output. The final private S3/OBS redirect origins must be supplied as exact HTTPS origins in `CSP_MEDIA_ORIGINS` for each deployment build.
- Frontend runtime: `ALLOWED_HOSTS` is injected into the standalone runner and is the only production Host authorization input. Production fails closed when it is absent. `NEXT_PUBLIC_SITE_URL` is intentionally not used as a production authorization fallback because public variables are frozen at build time and were confirmed absent from the tested runner environment.
- Backend: database/Redis URLs, CORS origins, JWT secret/expiry, storage provider/bucket/region/OBS endpoint and credentials, signed URL TTL, optional delivery base, cache TTL, runtime fingerprint, port, and `TRUST_PROXY_HOPS` influence trust boundaries.
- No client bundle reference to backend database, Redis, JWT, AWS, or Huawei credentials was found.

## C. High-Risk Findings

### DAST High: Cloud Metadata Potentially Exposed

Evidence: the scanner sent `GET /latest/meta-data/` with `Host: 169.154.169.254` (the report itself uses `169.154`, not the well-known `169.254` address). The response was HTTP 308 with relative `Location: /latest/meta-data` and a short redirect body. There was no metadata content, absolute host reflection, or evidence of an outbound connection.

Actual code flow: Next handled trailing-slash normalization before the application proxy. No frontend or backend code builds an outbound URL from `Host`, `X-Forwarded-Host`, or request headers. AWS SDK and Huawei clients use environment-controlled endpoints; media reads sign normalized object keys.

Classification: scanner false positive for metadata exposure, with a real Host-boundary defense opportunity. Actual severity is Low before a trusted edge is considered, because the observed effect was only same-site relative redirect behavior.

Fix: Next built-in pre-proxy canonicalization is disabled; canonicalization now happens after an allowlist check. Production accepts only runtime `ALLOWED_HOSTS`; `NEXT_PUBLIC_SITE_URL` is a development convenience and cannot authorize production requests. Container validation proved an untrusted metadata-style Host receives 421 while an approved Host follows normal routing.

The container healthcheck now requests the exact `/internal/health` liveness route over loopback while presenting the first configured approved Host. That route bypasses locale transformation only after Host validation. It returns minimal JSON with `Cache-Control: no-store`; no IP or localhost Host exception was added.

Infrastructure requirement: reject unknown Host values at the public listener before forwarding and rebuild inbound forwarding headers. Application defense is not a substitute for edge routing policy. Verify with a controlled canary hostname, never a metadata endpoint.

### DAST High: Source Code Disclosure / File Inclusion

Evidence: the baseline was `/_next/image?...url=%2Fimages%2FLOGO-PML.png`; the attack changed the optimizer `url` to `/image`. Next returned HTTP 400 and `The requested resource isn't a valid image.` No source fragment, file bytes, path traversal, or server file was returned.

Additional safe staging checks for `/.env`, `/package.json`, `/Dockerfile`, `/.git/config`, and `/BitKeeper` ended in ordinary HTML 404s. Production browser source maps are not enabled. `.dockerignore` excludes environment files, Git metadata, credentials, dependency trees, and build output.

Classification: false positive / framework-generated input rejection. No code patch was made to pretend this was file inclusion. Retain the Next patch cadence and rescan with the exact evidence attached as an exception.

## D. Medium Findings

- CSP wildcard directives: confirmed. Scheme-wide production `https:`, `ws:`, and `wss:` sources and production localhost sources were removed. The allowlist is now derived from configured API/media origins plus exact Google destinations. Vercel Live is allowed only on Vercel.
- Private signed-media redirects: fixed. CSP Level 3 evaluates image requests against the current/final response URL after redirects, so allowing only the CMS origin was insufficient. `CSP_MEDIA_ORIGINS` now adds exact per-deployment HTTPS S3/OBS origins to `img-src` without exposing credentials, persisting signed URLs, making storage public, or adding provider logic to UI components.
- CSP inline script/style: confirmed hardening debt, not safely removable in this pass. GTM currently injects an inline bootstrap and React/Next/application styles use inline attributes. Next 16 nonce CSP requires per-request dynamic rendering, disabling static optimization/ISR and partial prerendering. Preserve the current `unsafe-inline` values for now; stage a nonce migration with performance, GTM, maps, hydration, CMS and media regression testing.
- Missing CSP: infrastructure issue. All twelve instances are matching AWS ALB 502 pages, so Next cannot add headers to them.
- Anti-CSRF alerts: not applicable to admin authorization. Authentication is a manually attached Bearer token; there is no auth cookie. Public forms intentionally accept anonymous posts. Login/public-form rate limiting, strict body validation and CORS are the relevant defenses. Reassess CSRF if authentication ever moves to cookies.
- Proxy Disclosure: one duplicated infrastructure root cause. TRACE receives an AWS ALB 405; CMS responses also expose Envoy identifiers/timing. Disable TRACE/TRACK at the edge, preserve OPTIONS for CORS, and suppress headers/customize errors where supported.
- Upload content: fixed. JPEG, PNG, WebP, PDF, and MP4 bodies must match their declared type before every upload path can store them.
- Deployment fingerprint: fixed. `/api/health/version` and detailed `/api/health` now require Bearer authentication; only minimal `/api/health/public` remains public.
- Login abuse: fixed in code with Redis-backed per-IP-and-normalized-email hashing, ten attempts per 15 minutes, without storing raw identity data. It fails open for availability when Redis is down; edge throttling is still recommended.
- Trusted client IP: configuration/infra. `TRUST_PROXY_HOPS` is range-validated but intentionally unset by default. Infrastructure must document the ALB/Envoy chain before enabling it.

## E. Low and Informational Findings

- Big Redirect: framework-generated RSC/HTML redirect representation; targets were same-site and relative. Custom post-Host canonicalization now emits small controlled responses for trailing slashes.
- Server disclosure: application `X-Powered-By` is disabled. AWS ALB and Envoy disclosure remains infrastructure-owned.
- Missing HSTS: all reported instances were ALB 502s. Healthy frontend and CMS responses carried HSTS. Edge-generated errors still need the policy.
- Timestamp disclosure: matched public business/statistical content; no session, token, object-key or internal clock secret was demonstrated.
- Missing Content-Type: empty framework 308 responses. Custom canonical redirects now carry the global security policy; 421 carries explicit plain text. A bodyless redirect content type is not itself exploitable.
- Suspicious comments: public text/framework chunks matched heuristics; no secret or source content was found.
- Modern Web Application: informational technology detection.
- User Agent Fuzzer: 481 observations collapsed to one scanner-noise cluster. Representative malformed agents produced normal responses with no 5xx, stack traces, auth changes, reflection, or parser failures.

## F. False Positives

- Next Image file inclusion: rejected non-image, no disclosure.
- Metadata exposure: relative redirect only, no server-side request or metadata response.
- CSRF token absence: admin authorization is non-cookie Bearer; public submissions require no authorization.
- `/BitKeeper`: locale routing then 404, no VCS file.
- Hardcoded password: `passwordHash: 'hash'` is a unit-test fixture, not a credential or connection secret.
- `Math.random()`: transient client UI IDs only.
- Backend parser base URL: synthetic and never contacted; changed to reserved `https://storage.invalid` for scanner clarity.
- Role-key boundary regex: anchored and applied after normalization to a short role name; no unbounded remote input path. It can be cleaned up later but is not a practical ReDoS.

## G. Infrastructure Findings

| Layer | Required action | Why code cannot complete it |
|---|---|---|
| AWS ALB / public listener | Exact host rules; fixed 400/421 default action | Prevents unknown Host routing before any framework code |
| AWS target group/origin | Investigate the single-time 502 burst across image/chunk requests | It caused all missing CSP/HSTS and server-version instances |
| AWS ALB error handling | Apply HSTS/security baseline to edge errors where supported, or place a controlled edge in front | Application middleware never sees ALB-generated 502s |
| Envoy / reverse proxy | Remove `Server` and upstream timing headers where operationally acceptable | Headers are injected after Nest responses |
| ALB/Envoy method policy | Reject TRACE and TRACK; keep OPTIONS | Scanner's 113 proxy-disclosure occurrences are method/error duplicates |
| Forwarded headers | Strip inbound forwarding headers and recreate them; document exact trusted hop count | Nest client-IP throttles are safe only with an exact trust model |
| Scanner configuration | Deduplicate by alert + response signature + edge status | Prevent 688 instances being managed as 688 defects |

Huawei requirements are configuration-only: keep OBS private, require an HTTPS endpoint, keep AK/SK in the secret store, preserve signed reads, and do not expose a public bucket origin.

## H. SAST Frontend Findings

Resolved:

- `docker:S7019` (one): exec-form healthcheck.
- `docker:S6504` (three): runtime application/static files are root-owned/read-only to `nextjs`; only `.next/cache` is writable.
- `typescript:S5852` (one): replaced the backtracking heading matcher with bounded index scanning and added a large-input test.

False positive / mitigated:

- `typescript:S2245` (two): non-security UI identifiers.
- `docker:S6470` (one): builder-only COPY with a restrictive `.dockerignore`; runtime image copies only standalone output/static/public files.

Remaining accepted technical debt (60 code-smell instances): eight cognitive-complexity, one deep nesting, nine selector-parameter, ten nested-ternary, eleven JSX spacing, four duplicate-CSS, seven unnecessary-assertion, one duplicated-literal, one nested-template, one array-index-key, two accessibility, two base-digest, and three minor configuration/Docker/style findings. They were reviewed for security-boundary impact; none implements authorization, path normalization, upload validation or permission checks. Refactor them separately with UI regression coverage.

## I. SAST Backend Findings

Resolved:

- `docker:S6471` (one): runner now uses the official unprivileged `node` user.
- `typescript:S5332` (one): synthetic URL base changed to reserved HTTPS.

False positive / mitigated:

- `typescript:S2068` (one): isolated test fixture.
- `typescript:S5852` (one): bounded anchored role-key cleanup.
- `docker:S6470` (one): builder-only COPY protected by `.dockerignore`; secrets are excluded and runtime copies are explicit.

Remaining accepted technical debt (10 code smells): two cognitive-complexity findings, four nested ternaries, three unpinned base-image occurrences, and one documentation-generator naming rule. The legacy media audit tool was not changed because its migration semantics need fixture-driven tests before refactoring.

## J. Dependency / SCA Findings

| Repository | Root package/advisory | Before | After | Relationship | Result |
|---|---|---:|---:|---|---|
| Frontend | `sanitize-html` CVE-2026-84371 | 2.17.6 | 2.17.7 | Direct | Patched |
| Frontend | TipTap DOM-attribute/prototype XSS advisory | 3.27.3 family | 3.30.4 family | Direct family + peers | Patched as one aligned set |
| Frontend | Browserslist advisories | <=4.28.6 | 4.28.7 override | Transitive build-time | Patched |
| Backend | `deepmerge-ts` CVE-2026-40345 | 7.1.5 | 8.0.0 override | Prisma → `@prisma/config` | Patched; Prisma generate/build/tests pass |
| Backend | `fast-uri` parsing/SSRF advisories | vulnerable 3.1.x | 3.1.6 override | Transitive | Patched |
| Backend | `qs` array-parsing DoS | <6.16.0 | 6.16.0 override | Express/Superagent transitive | Patched |
| Backend | Browserslist advisories | <=4.28.6 | 4.28.7 override | Transitive build-time | Patched |

No forced audit fix was used. Both fresh registry audits report zero known vulnerabilities.

## K. Docker Findings

- Frontend is multi-stage Alpine, runs as `nextjs`, now has read-only runtime code and a narrowly writable Next cache, excludes secrets via `.dockerignore`, and uses exec-form CMD/healthcheck. Remaining: pin both base stages to a reviewed multi-architecture digest in CI and refresh that digest through an explicit dependency process.
- Backend is multi-stage slim, installs only production dependencies in the runtime, uses object storage rather than local writable uploads, and now runs as `node`. Remaining: pin all three `node:22-slim` references to an approved digest and consider reducing duplicated OS-package layers.
- No secret is copied intentionally. Healthchecks use loopback HTTP inside the container; this does not cross a network trust boundary.

## L. Code-Flow Audit Findings

Security-positive controls verified:

- No raw command execution, eval/Function, arbitrary dynamic import, generic proxy, user-controlled server fetch, runtime filesystem download, or unparameterized attacker-controlled raw SQL was found.
- Global DTO transformation/allowlisting is now strict with `forbidNonWhitelisted`; DTOs carry type and length constraints on security-relevant public inputs.
- Storage keys are POSIX-normalized, limited to explicit prefixes/characters, and converted to provider-signed reads. Buckets remain private.
- JWT verification reloads the active admin and assigned role; permissions are evaluated at the API boundary. UI route visibility is not treated as authorization.
- Rich text is sanitized before `dangerouslySetInnerHTML`, link protocols are constrained, protocol-relative URLs are disabled, and new-tab links receive `noopener noreferrer`.

Architectural risks to track:

- Local-storage JWTs are exposed to any successful same-origin XSS. This is an accepted architecture tradeoff, not a CSRF problem. Keep token lifetimes short, prioritize CSP nonce migration, and consider an HttpOnly/secure/SameSite session design in a separate auth project.
- Logout is stateless and does not revoke already issued JWTs. Add token versioning or a short-lived access/rotating refresh design if immediate revocation is a requirement.
- Rate limiting fails open when Redis is unavailable. Add edge limits and monitoring; do not sacrifice login/form availability silently without an operational decision.
- `MEDIA_DELIVERY_BASE_URL` and Huawei endpoint are privileged deployment inputs. Restrict who can change them and require HTTPS; they are not user-controlled request data.
- Public status currently exposes only a minimal status/timestamp. If operational DB/cache detail is reintroduced, aggregate it and avoid service topology disclosure.

## M. Files Changed

Frontend:

- `.env.example`: documented runtime inbound Host allowlist and build-time final media-origin allowlist.
- `Dockerfile`: read-only runtime content, writable cache only, exec healthcheck.
- `next.config.ts`, `lib/security/csp.ts`: validated CSP generation, exact final S3/OBS image origins, narrowed CSP, COOP, admin no-store, application-owned canonical redirects.
- `proxy.ts`, `lib/request-host.ts`: fail-closed production Host validation and post-validation redirects.
- `app/internal/health/route.ts`, `lib/internal-health.ts`: minimal no-store liveness flow protected by the normal Host boundary.
- `lib/rich-text.ts`, `lib/rich-text-normalization.ts`: non-backtracking heading normalization.
- `package.json`, `package-lock.json`: minimal security upgrades/overrides.
- `tests/request-host.test.mjs`, `tests/csp.test.mjs`, `tests/internal-health.test.mjs`, `tests/rich-text-security.test.mjs`: focused security tests.
- `docs/security/*`: normalized evidence inventory and this audit.

Backend:

- `.env.example`: documented validated proxy-hop setting.
- `Dockerfile`: unprivileged runtime.
- `src/main.ts`: strict DTO rejection, private cache policy, permissions header, opt-in exact proxy trust.
- `src/app.controller.ts`, tests: protect detailed health/deployment fingerprint.
- `src/auth/auth.controller.ts`, new test: privacy-preserving login throttling.
- `src/catalogues/dto/create-catalogue-request.dto.ts`: explicit public-input bounds.
- `src/common/upload/upload-security.ts`, tests: file-content signatures.
- `src/storage/aws-s3.provider.ts`, new test: preserve content disposition in S3.
- `src/storage/storage.service.ts`: reserved HTTPS parser base.
- `package.json`, `package-lock.json`: transitive security overrides.
- `test/app.e2e-spec.ts`: deployment fingerprint authorization assertion.

## N. Tests Added

- Host allowlist construction, normalization, unknown/missing Host rejection, and unconfigured local fallback.
- Production fail-closed behavior without runtime `ALLOWED_HOSTS`; public build-time site URL cannot authorize a production Host.
- Exact health path routing plus minimal 200/no-store response.
- AWS and Huawei final signed-media origins in `img-src`, preserved Google/static/data/blob sources, and rejection of wildcard, cleartext, credentialed or path-bearing CSP origins.
- Large malformed rich-text heading handling without pathological regex behavior.
- Valid JPEG/PNG/WebP/PDF/MP4 signatures and MIME/content mismatch rejection.
- Login threshold behavior and HTTP 429 above the limit.
- AWS S3 content-disposition propagation.
- Unauthenticated deployment fingerprint rejection in the end-to-end suite.

## O. Validation Results

| Check | Result |
|---|---|
| Frontend `npm run lint` | Pass |
| Frontend `npx tsc --noEmit` | Pass |
| Frontend `npm test` | Pass: 22/22 |
| Frontend production build | Pass with `next build --webpack`, 77 pages generated |
| Frontend default Turbopack build in this execution sandbox | Environment-limited: Turbopack worker could not bind a local port; no code/compiler error. Webpack production build passed |
| Frontend `npm audit` | Pass: zero known vulnerabilities |
| Frontend `git diff --check` | Pass |
| Backend `npm run lint:check` | Pass |
| Backend `npm run build` | Pass |
| Backend `npm test -- --runInBand` | Pass: 93/93, 17 suites |
| Backend `npm run prisma:generate` | Pass with Prisma 6.19.3 and `deepmerge-ts` override |
| Backend `npm audit` | Pass: zero known vulnerabilities |
| Backend `git diff --check` | Pass |
| Backend database/Redis end-to-end suite | Not run: the suite upserts/deletes records and flushes Redis; no isolated disposable services were supplied, so running it would violate the no-data-mutation constraint |
| Frontend/backend Dockerfile static validation | Pass: no warnings for either file |
| Frontend full Docker build | Pass; the image's exact `npm run build` Turbopack build compiled and generated all 77 routes |
| Frontend container healthcheck | Pass: Docker reported `running healthy` with repeated exit code 0 checks |
| Container production response validation | Approved Host normal 307; unknown Host 421; `/internal/health` 200/no-store; CSP/HSTS/nosniff/referrer/permissions/COOP present |
| Standalone runtime environment validation | `ALLOWED_HOSTS` present from `docker run -e`; `NEXT_PUBLIC_SITE_URL` absent, proving Host authorization is not relying on build-time public-variable behavior |
| Staging safe-path validation | Healthy HTML/image/API headers checked; known sensitive/static paths returned 404; invalid Host did not reflect an absolute host; TRACE returned edge 405 |

The repository's exact frontend `npm run build` command invokes Turbopack and cannot complete in this restricted execution environment because Turbopack attempts to bind an internal worker port. The supported webpack production path compiled the same application successfully. This limitation must not be represented as a product failure.

## P. Remaining Risk

1. Edge-generated 4xx/5xx responses still need security headers and reduced proxy identity disclosure.
2. The origin of the scan-time 502 burst is unknown and requires ALB/target telemetry.
3. Runtime `ALLOWED_HOSTS` must be configured in each deployment; absence intentionally makes the production container unhealthy and rejects requests. The edge must independently enforce the same hosts.
4. Each AWS/Huawei build must set exact final provider/CDN origins in `CSP_MEDIA_ORIGINS`. A missing provider origin blocks redirected media by design.
5. `TRUST_PROXY_HOPS` must remain unset until the exact hop chain is proven, then be deployed together with forwarding-header sanitation.
6. CSP still contains `script-src 'unsafe-inline'` and `style-src 'unsafe-inline'`. Both are **REMAINING** staged findings; nonce migration is a separate architecture/performance change and needs report-only telemetry first.
7. Docker base-image digests are not pinned. Select a platform-appropriate, reviewed digest in the build pipeline rather than committing an unverified hash.
8. Local-storage JWT theft remains possible after any future same-origin XSS; token revocation is not immediate.
9. The 60 frontend and 10 backend code-smell instances remain tracked technical debt; none is claimed fixed.
10. Scanner “0% coverage” means no LCOV/Jest coverage artifact was supplied to the scan. Tests exist and pass. Add frontend coverage instrumentation and publish frontend/backend LCOV paths in CI; set incremental targets before enforcing 80%.

## Q. Recommended Rescan Checklist

1. Deploy only to staging after code review; inject exact runtime `ALLOWED_HOSTS` and build with exact `CSP_MEDIA_ORIGINS`; do not alter private bucket policies.
2. Apply edge host/method/forwarded-header/error-response rules and resolve the 502 source.
3. Confirm `/`, localized HTML, `/admin`, `/admin/`, 404, 500 test route, valid/invalid Next Image, static JS/CSS, API JSON, API 401/404, media 302, and edge 4xx/5xx each have the intended headers.
4. Repeat the Host canary test against a controlled domain/IP that cannot reach metadata. Expect fixed 400/421, no absolute reflection, and no canary DNS/HTTP callback.
5. Repeat the exact image-optimizer evidence. Expect HTTP 400 without source bytes; mark the original High as false positive if unchanged.
6. Recheck `/.env`, `/package.json`, `/Dockerfile`, `/.git/config`, `/BitKeeper`, source-map suffixes, encoded traversal, and known public assets using read-only requests.
7. Verify admin login/me/mutations with Bearer auth, no auth cookies, unauthorized 401s, per-permission 403s, and login 429 threshold from an approved test identity.
8. Upload one valid sample of each allowed type and one mismatched signature per type to a disposable staging context; confirm rejection occurs before storage. Do not use active/malicious payloads.
9. Verify S3 and OBS signed URLs stay private, expire as configured, PDFs download as attachments, and images render inline. Confirm the final provider origins appear in the deployed `img-src` without signed query strings.
10. Run dependency/SAST scans with the new locks, deduplicate DAST by root cause, and attach CI LCOV reports.
11. Run CSP in report-only nonce mode in a performance test environment before removing either inline allowance.

## R. Final Verdict

**PARTIALLY REMEDIATED — INFRA CHANGES REQUIRED**

All confirmed, safely code-owned security issues identified in this pass were remediated and verified locally. No supplied High DAST alert was demonstrated as an exploitable High application vulnerability. A staging rescan should follow code review and deployment, but closure cannot be claimed until infrastructure owners enforce the host/proxy boundary, correct edge-generated error responses, and explain the 502 cluster.
