import { describe, expect, it } from "vitest";

import { monthlyAnnouncementText } from "./monthly-announcement-text";

const profileUrl = (userId: string) => `https://rollandcall.xyz/s/users/${userId}`;
const winner = (userId: string, nickname: string, sessionCount = 6) => ({
  userId,
  nickname,
  sessionCount,
});

describe("monthlyAnnouncementText", () => {
  it("GM·PL 둘 다 있으면 세 줄이다", () => {
    expect(
      monthlyAnnouncementText({
        month: "2026-09",
        gm: [winner("a", "한랑아", 5)],
        pl: [winner("b", "루키", 7)],
        profileUrl,
      }),
    ).toBe(
      [
        "**9월 이달의 GM·PL**",
        "🎖️ 이달의 GM: [한랑아](https://rollandcall.xyz/s/users/a) · 세션 5회 진행",
        "🏅 이달의 PL: [루키](https://rollandcall.xyz/s/users/b) · 세션 7회 참여",
      ].join("\n"),
    );
  });

  it("한쪽만 있으면 그 줄만 쓴다", () => {
    expect(
      monthlyAnnouncementText({ month: "2026-12", gm: [], pl: [winner("b", "루키")], profileUrl }),
    ).toBe(
      "**12월 이달의 GM·PL**\n🏅 이달의 PL: [루키](https://rollandcall.xyz/s/users/b) · 세션 6회 참여",
    );
  });

  it("공동 1위는 쉼표로 잇는다", () => {
    expect(
      monthlyAnnouncementText({
        month: "2026-09",
        gm: [winner("a", "가"), winner("b", "나")],
        pl: [],
        profileUrl,
      }),
    ).toContain(
      "[가](https://rollandcall.xyz/s/users/a), [나](https://rollandcall.xyz/s/users/b) · 세션 6회 진행",
    );
  });

  it("닉네임의 대괄호·별표·밑줄을 이스케이프한다", () => {
    expect(
      monthlyAnnouncementText({
        month: "2026-09",
        gm: [winner("a", "[GM]*별_")],
        pl: [],
        profileUrl,
      }),
    ).toContain("[\\[GM\\]\\*별\\_](");
  });
});
