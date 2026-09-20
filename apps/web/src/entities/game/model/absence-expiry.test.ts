import { describe, expect, it } from "vitest";

import { absenceExpiresAt } from "./absence-expiry";

describe("absenceExpiresAt", () => {
  it("세션 날짜로부터 3개월 뒤에 사라진다", () => {
    expect(absenceExpiresAt("2026-09-19T20:00:00+09:00").toISOString().slice(0, 10)).toBe(
      "2026-12-19",
    );
  });
});
