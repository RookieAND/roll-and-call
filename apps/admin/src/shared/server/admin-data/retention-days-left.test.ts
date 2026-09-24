import { describe, expect, it } from "vitest";

import { retentionDaysLeft } from "./retention-days-left";

describe("retentionDaysLeft", () => {
  const now = new Date("2026-09-22T12:00:00+09:00");

  it("지우는 조치만 남은 날을 센다", () => {
    const at = new Date("2026-09-20T12:00:00+09:00");
    expect(retentionDaysLeft({ action: "안내 DM", at }, now)).toBe(28);
    expect(retentionDaysLeft({ action: "제재", at }, now)).toBeNull();
  });

  it("기한이 지나면 0일", () => {
    const at = new Date("2026-08-01T12:00:00+09:00");
    expect(retentionDaysLeft({ action: "룰북 수정", at }, now)).toBe(0);
  });
});
