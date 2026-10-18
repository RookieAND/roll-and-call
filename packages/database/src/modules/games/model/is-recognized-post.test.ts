import { describe, expect, it } from "vitest";

import { isRecognizedPost } from "./is-recognized-post";

const now = new Date("2026-10-01T00:00:00Z");
const ended = { memberIds: ["a"], endsAt: new Date("2026-09-30T00:00:00Z") };

describe("isRecognizedPost", () => {
  it("끝났고 참여자가 있으면 인정", () => expect(isRecognizedPost(ended, now)).toBe(true));
  it("끝나지 않았거나 종료 시각이 없으면 아님", () => {
    expect(isRecognizedPost({ ...ended, endsAt: new Date("2026-10-02T00:00:00Z") }, now)).toBe(
      false,
    );
    expect(isRecognizedPost({ ...ended, endsAt: null }, now)).toBe(false);
  });
  it("참여자 없음·취소·숨김은 아님", () => {
    expect(isRecognizedPost({ ...ended, memberIds: [] }, now)).toBe(false);
    expect(isRecognizedPost({ ...ended, cancelled: true }, now)).toBe(false);
    expect(isRecognizedPost({ ...ended, hidden: {} }, now)).toBe(false);
  });
});
