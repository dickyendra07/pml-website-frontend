import assert from "node:assert/strict";
import test from "node:test";

import { normalizeHeadingMistakes } from "../lib/rich-text-normalization.ts";

test("downgrades oversized h3 blocks without a backtracking expression", () => {
  const content = "a".repeat(121);

  assert.equal(normalizeHeadingMistakes(`<h3>${content}</h3>`), `<p>${content}</p>`);
});

test("handles a large unterminated heading without pathological backtracking", () => {
  const content = `before<h3>${"a".repeat(100_000)}`;
  const startedAt = performance.now();
  const output = normalizeHeadingMistakes(content);

  assert.equal(output, content);
  assert.equal(performance.now() - startedAt < 1_000, true);
});
