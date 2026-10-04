import { describe, expect, it } from "vitest";

import { isRecognizedPost } from "./recognized-session";

const now = new Date("2026-09-30T12:00:00Z");
const ended = {
  memberIds: ["a"],
  hidden: undefined,
  cancelled: false,
  endsAt: new Date("2026-09-30T11:00:00Z"),
};

describe("isRecognizedPost", () => {
  it("끝났고 확정 참여자가 있으면 인정 세션이다", () => {
    expect(isRecognizedPost(ended, now)).toBe(true);
  });

  it("아직 끝나지 않았거나 일시가 없으면 아니다", () => {
    expect(isRecognizedPost({ ...ended, endsAt: new Date("2026-09-30T13:00:00Z") }, now)).toBe(
      false,
    );
    expect(isRecognizedPost({ ...ended, endsAt: null }, now)).toBe(false);
  });

  it("확정 참여자가 없거나 숨김·취소면 아니다", () => {
    expect(isRecognizedPost({ ...ended, memberIds: [] }, now)).toBe(false);
    expect(isRecognizedPost({ ...ended, cancelled: true }, now)).toBe(false);
    expect(isRecognizedPost({ ...ended, hidden: { reason: "", by: "", at: now } }, now)).toBe(
      false,
    );
  });
});
