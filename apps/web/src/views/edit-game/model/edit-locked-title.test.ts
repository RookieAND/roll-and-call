import { describe, expect, it } from "vitest";

import { editLockedTitle } from "./edit-locked-title";

const now = new Date("2026-09-10T10:00:00Z");
const started = new Date("2026-09-09T10:00:00Z");
const base = { cancelledAt: null, confirmedAt: started, roundCount: 1, finishedAt: null };

describe("editLockedTitle", () => {
  it("단발은 시작하면 잠근다", () => {
    expect(editLockedTitle(base, now)).toBe("시작한 세션은 고칠 수 없습니다");
    expect(editLockedTitle({ ...base, confirmedAt: null }, now)).toBeNull();
  });

  it("다회차는 시작한 뒤에도 열고 구인이 끝나면 잠근다", () => {
    expect(editLockedTitle({ ...base, roundCount: 3 }, now)).toBeNull();
    expect(editLockedTitle({ ...base, roundCount: 3, finishedAt: now }, now)).toBe(
      "시작한 세션은 고칠 수 없습니다",
    );
  });

  it("취소한 구인은 다회차여도 잠근다", () => {
    expect(editLockedTitle({ ...base, roundCount: 3, cancelledAt: now }, now)).toBe(
      "취소한 구인은 고칠 수 없습니다",
    );
  });
});
