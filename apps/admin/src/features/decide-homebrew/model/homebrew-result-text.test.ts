import { describe, expect, it } from "vitest";

import { homebrewDoneText } from "./homebrew-done-text";
import { homebrewFailureText } from "./homebrew-failure-text";

describe("homebrewDoneText", () => {
  it("룰 이름과 처리 결과를 적는다", () => {
    expect(homebrewDoneText({ name: "달그림자 연대기", decision: "approve" })).toBe(
      "달그림자 연대기 자작 룰을 승인했습니다",
    );
    expect(homebrewDoneText({ name: "달그림자 연대기", decision: "reject" })).toBe(
      "달그림자 연대기 자작 룰을 반려했습니다",
    );
  });
});

describe("homebrewFailureText", () => {
  it("막힌 이유는 그대로 보인다", () => {
    expect(homebrewFailureText({ ok: false, blocked: "같은 이름" })).toBe("같은 이름");
  });

  it("거둔 신청은 토스트를 띄우지 않는다", () => {
    expect(
      homebrewFailureText({
        ok: false,
        conflict: { status: "withdrawn", by: "달빛토끼", at: new Date() },
      }),
    ).toBeNull();
  });

  it("먼저 처리한 운영진과 시각을 알린다", () => {
    expect(
      homebrewFailureText({
        ok: false,
        conflict: { status: "approved", by: "새벽세시", at: new Date("2026-11-03T14:42:00Z") },
      }),
    ).toBe("다른 운영진(새벽세시)이 23:42에 먼저 처리했습니다");
  });
});
