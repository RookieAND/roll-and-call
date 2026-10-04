import { describe, expect, it } from "vitest";

import { sanctionNoticeLines } from "./sanction-notice-lines";

describe("sanctionNoticeLines", () => {
  it("기간이 있으면 끝나는 날까지", () => {
    expect(
      sanctionNoticeLines({ reason: "반복된 불참", until: new Date("2026-10-31T12:00:00+09:00") }),
    ).toEqual([
      "사유: 반복된 불참",
      "기간: 10월 31일까지",
      "정지 기간에는 참가 신청·구인 개설·룰북 인증 신청을 할 수 없습니다.",
    ]);
  });

  it("기간이 없으면 해제될 때까지", () => {
    expect(sanctionNoticeLines({ reason: "반복된 불참", until: null })[1]).toBe(
      "기간: 해제될 때까지",
    );
  });
});
