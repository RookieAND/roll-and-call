import { describe, expect, it } from "vitest";

import { canPickRulebook } from "./can-pick-rulebook";
import { CERT_STATE } from "./cert-state";

const NOW = new Date("2026-10-20T00:00:00+09:00");
const BEFORE = new Date("2026-10-21T00:00:00+09:00");
const AFTER = new Date("2026-10-19T00:00:00+09:00");

describe("canPickRulebook", () => {
  it("인증이 필요 없거나 인증했으면 언제든 고른다", () => {
    expect(canPickRulebook({ certRequired: false, state: null }, AFTER, NOW)).toBe(true);
    expect(canPickRulebook({ certRequired: true, state: CERT_STATE.certified }, AFTER, NOW)).toBe(
      true,
    );
  });

  it("인증이 필요한 룰북은 적용일 전이나 적용일이 없을 때만 고른다", () => {
    expect(canPickRulebook({ certRequired: true, state: CERT_STATE.pending }, BEFORE, NOW)).toBe(
      true,
    );
    expect(canPickRulebook({ certRequired: true, state: null }, null, NOW)).toBe(true);
    expect(canPickRulebook({ certRequired: true, state: CERT_STATE.pending }, AFTER, NOW)).toBe(
      false,
    );
    expect(canPickRulebook({ certRequired: true, state: null }, NOW, NOW)).toBe(false);
  });
});
