import { describe, expect, it } from "vitest";

import { retentionDaysLeft } from "./retention-days-left";

describe("retentionDaysLeft", () => {
  const now = new Date("2026-09-22T12:00:00+09:00");
  const at = new Date("2026-09-20T12:00:00+09:00");

  it("룰북 수정·룰북 연결만 남은 날을 센다", () => {
    expect(retentionDaysLeft({ action: "룰북 수정", at }, now)).toBe(28);
    expect(retentionDaysLeft({ action: "룰북 연결", at }, now)).toBe(28);
  });

  it("운영진 메모와 나머지 조치는 계속 보관한다(보관 칸 비움)", () => {
    expect(retentionDaysLeft({ action: "운영진 메모", at }, now)).toBeNull();
    expect(retentionDaysLeft({ action: "안내 DM", at }, now)).toBeNull();
    expect(retentionDaysLeft({ action: "제재", at }, now)).toBeNull();
  });

  it("기한이 지나면 0일", () => {
    const old = new Date("2026-08-01T12:00:00+09:00");
    expect(retentionDaysLeft({ action: "룰북 수정", at: old }, now)).toBe(0);
  });
});
