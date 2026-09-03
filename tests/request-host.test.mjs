import assert from "node:assert/strict";
import test from "node:test";

import {
  getAllowedRequestHosts,
  isRequestHostAllowed,
} from "../lib/request-host.ts";

test("builds the production allowlist from explicit runtime hosts", () => {
  const environment = {
    ALLOWED_HOSTS: "stg.pharmametriclabs.com, preview.example.com:8443",
    NODE_ENV: "production",
  };

  assert.deepEqual([...getAllowedRequestHosts(environment)], [
    "stg.pharmametriclabs.com",
    "preview.example.com:8443",
  ]);
});

test("rejects unknown and missing hosts when the allowlist is configured", () => {
  const environment = {
    ALLOWED_HOSTS: "stg.pharmametriclabs.com",
  };

  assert.equal(
    isRequestHostAllowed("stg.pharmametriclabs.com", environment),
    true,
  );
  assert.equal(isRequestHostAllowed("169.254.169.254", environment), false);
  assert.equal(isRequestHostAllowed(null, environment), false);
});

test("normalizes host case and a trailing DNS dot", () => {
  const environment = {
    ALLOWED_HOSTS: "stg.pharmametriclabs.com",
    NODE_ENV: "production",
  };

  assert.equal(
    isRequestHostAllowed("STG.PHARMAMETRICLABS.COM.", environment),
    true,
  );
});

test("preserves existing local behavior until an allowlist is configured", () => {
  assert.equal(isRequestHostAllowed("localhost:3000", {}), true);
});

test("uses NEXT_PUBLIC_SITE_URL only as a development convenience", () => {
  const environment = {
    NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
    NODE_ENV: "development",
  };

  assert.equal(isRequestHostAllowed("localhost:3000", environment), true);
});

test("fails closed in production without a runtime ALLOWED_HOSTS value", () => {
  const environment = {
    NEXT_PUBLIC_SITE_URL: "https://stg.pharmametriclabs.com",
    NODE_ENV: "production",
  };

  assert.equal(
    isRequestHostAllowed("stg.pharmametriclabs.com", environment),
    false,
  );
});
