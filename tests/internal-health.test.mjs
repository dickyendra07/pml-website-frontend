import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "../app/internal/health/route.ts";
import {
  INTERNAL_HEALTH_PATH,
  isInternalHealthPath,
} from "../lib/internal-health.ts";

test("the dedicated internal health path bypasses only locale routing", () => {
  assert.equal(INTERNAL_HEALTH_PATH, "/internal/health");
  assert.equal(isInternalHealthPath("/internal/health"), true);
  assert.equal(isInternalHealthPath("/internal/health/extra"), false);
  assert.equal(isInternalHealthPath("/"), false);
});

test("the internal health handler returns minimal uncached liveness", async () => {
  const response = GET();

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), { status: "ok" });
});
