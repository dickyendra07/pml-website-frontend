import assert from "node:assert/strict";
import test from "node:test";

import {
  buildContentSecurityPolicy,
  parseTrustedOrigins,
} from "../lib/security/csp.ts";

const cmsOrigin = "https://stg-cms.pharmametriclabs.com";
const awsOrigin =
  "https://private-bucket.s3.ap-southeast-3.amazonaws.com";
const huaweiOrigin =
  "https://private-bucket.obs.ap-southeast-3.myhuaweicloud.com";

function imageSources(policy) {
  const directive = policy
    .split("; ")
    .find((value) => value.startsWith("img-src "));

  assert.ok(directive);
  return directive.split(" ").slice(1);
}

test("permits the configured AWS signed-media final origin", () => {
  const policy = buildContentSecurityPolicy({
    additionalImageOrigins: awsOrigin,
    isProduction: true,
    isVercel: false,
    mediaOrigins: [cmsOrigin],
  });

  assert.equal(imageSources(policy).includes(cmsOrigin), true);
  assert.equal(imageSources(policy).includes(awsOrigin), true);
  assert.equal(imageSources(policy).includes("https:"), false);
});

test("permits the configured Huawei signed-media final origin", () => {
  const policy = buildContentSecurityPolicy({
    additionalImageOrigins: huaweiOrigin,
    isProduction: true,
    isVercel: false,
    mediaOrigins: [cmsOrigin],
  });

  assert.equal(imageSources(policy).includes(cmsOrigin), true);
  assert.equal(imageSources(policy).includes(huaweiOrigin), true);
  assert.equal(imageSources(policy).includes("https:"), false);
});

test("preserves analytics, tag manager, maps, data, blob, and self sources", () => {
  const policy = buildContentSecurityPolicy({
    additionalImageOrigins: `${awsOrigin},${huaweiOrigin}`,
    isProduction: true,
    isVercel: false,
    mediaOrigins: [cmsOrigin],
  });

  assert.match(policy, /script-src[^;]*https:\/\/www\.googletagmanager\.com/);
  assert.match(policy, /img-src 'self' data: blob:/);
  assert.match(policy, /img-src[^;]*https:\/\/www\.google-analytics\.com/);
  assert.match(policy, /frame-src[^;]*https:\/\/www\.google\.com/);
  assert.match(policy, /frame-src[^;]*https:\/\/maps\.google\.com/);
});

test("rejects wildcard, cleartext, credentialed, and path-bearing origins", () => {
  for (const value of [
    "https://*.amazonaws.com",
    "http://bucket.example.com",
    "https://user:password@bucket.example.com",
    "https://bucket.example.com/private",
  ]) {
    assert.throws(() =>
      parseTrustedOrigins(value, {
        allowHttp: false,
        variableName: "CSP_MEDIA_ORIGINS",
      }),
    );
  }
});
