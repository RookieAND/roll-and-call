import { describe, expect, it } from "vitest";

import { auditTargetParts } from "./audit-target-parts";

describe("auditTargetParts", () => {
  it("기존 기록은 「 · 」 앞뒤로 나눈다", () => {
    expect(
      auditTargetParts({ action: "인증 승인", target: "달빛토끼 · 수호자 룰북 7판", reason: "" }),
    ).toEqual({ name: "달빛토끼", detail: "수호자 룰북 7판", reason: "" });
  });

  it("자작 룰 승인은 룰 이름과 제작자로 보인다", () => {
    expect(
      auditTargetParts({
        action: "자작 룰 승인",
        target: "달빛토끼 · 달그림자 연대기 1.0",
        reason: "",
      }),
    ).toEqual({ name: "달그림자 연대기 1.0", detail: "제작자 달빛토끼", reason: "" });
  });

  it("자작 룰 반려는 신청자로 보인다", () => {
    expect(
      auditTargetParts({
        action: "자작 룰 반려",
        target: "김코코 · 열두 번째 손님",
        reason: "다른 룰을 그대로 옮긴 것으로 보임",
      }),
    ).toEqual({
      name: "열두 번째 손님",
      detail: "신청자 김코코",
      reason: "다른 룰을 그대로 옮긴 것으로 보임",
    });
  });

  it("사용 범위 변경은 이전·이후를 세부로 올린다", () => {
    expect(
      auditTargetParts({
        action: "자작 룰 사용 범위 변경",
        target: "고양이 탐정 사무소 0.9",
        reason: "제작자만 사용에서 전체 사용으로",
      }),
    ).toEqual({
      name: "고양이 탐정 사무소 0.9",
      detail: "제작자만 사용에서 전체 사용으로",
      reason: "",
    });
  });

  it("자작 룰 숨김은 룰 이름만 있다", () => {
    expect(
      auditTargetParts({ action: "자작 룰 숨김", target: "잿빛 탑의 기록", reason: "운영 중단" }),
    ).toEqual({ name: "잿빛 탑의 기록", detail: undefined, reason: "운영 중단" });
  });
});
