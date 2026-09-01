import assert from "node:assert/strict";
import test from "node:test";

import {
  resolveMediaUrl,
  shouldBypassImageOptimization,
} from "../lib/media.ts";

const aws = {
  apiBaseUrl: "https://stg-cms.pharmametriclabs.com/api",
  legacyMediaBaseUrl: "https://stg-cms.pharmametriclabs.com",
};

const huawei = {
  apiBaseUrl: "https://poc-cms.pharmametriclabs.com/api",
  legacyMediaBaseUrl: "https://poc-cms.pharmametriclabs.com",
};

test("resolves object-storage references against the AWS CMS origin", () => {
  const reference = "/api/media/read?key=media%2Finsights%2Fcover.webp";

  assert.equal(
    resolveMediaUrl(reference, aws),
    `https://stg-cms.pharmametriclabs.com${reference}`,
  );
});

test("resolves object-storage references against the Huawei CMS origin", () => {
  const reference = "/api/media/read?key=media%2Fgeneral%2Fphoto.png";

  assert.equal(
    resolveMediaUrl(reference, huawei),
    `https://poc-cms.pharmametriclabs.com${reference}`,
  );
});

test("resolves legacy uploads against the configured legacy media origin", () => {
  assert.equal(
    resolveMediaUrl("/uploads/media/legacy.webp", aws),
    "https://stg-cms.pharmametriclabs.com/uploads/media/legacy.webp",
  );
});

test("leaves frontend static images unchanged", () => {
  assert.equal(
    resolveMediaUrl("/images/pml/hero.png", aws),
    "/images/pml/hero.png",
  );
});

test("leaves absolute HTTPS URLs unchanged", () => {
  const url = "https://cdn.example.com/media/image.webp?version=2";
  assert.equal(resolveMediaUrl(url, aws), url);
});

test("returns an empty string for null media", () => {
  assert.equal(resolveMediaUrl(null, aws), "");
});

test("preserves query parameters and encoded object keys exactly", () => {
  const reference =
    "/api/media/read?key=media%2Fgeneral%2Fa%2520b.webp&download=1";

  assert.equal(
    resolveMediaUrl(reference, huawei),
    `https://poc-cms.pharmametriclabs.com${reference}`,
  );
  assert.equal(resolveMediaUrl(reference, huawei).includes("%25252F"), false);
});

test("bypasses optimization only for backend media, legacy uploads, and signed URLs", () => {
  assert.equal(
    shouldBypassImageOptimization(
      "https://cms.example.com/api/media/read?key=media%2Fa.webp",
    ),
    true,
  );
  assert.equal(
    shouldBypassImageOptimization(
      "https://cms.example.com/uploads/media/legacy.webp",
    ),
    true,
  );
  assert.equal(
    shouldBypassImageOptimization(
      "https://storage.example.com/object?X-Amz-Signature=redacted",
    ),
    true,
  );
  assert.equal(
    shouldBypassImageOptimization("https://cdn.example.com/public.webp"),
    false,
  );
  assert.equal(shouldBypassImageOptimization("/images/pml/hero.png"), false);
});
