import { describe, expect, it } from "vitest";

import { auditSubject } from "./audit-subject";

describe("auditSubject", () => {
  it("유저 조치는 유저 상세와 targetUser", () => {
    expect(
      auditSubject({ action: "불참 취소", target: "김코코", targetUserId: "u", targetGameId: "g" }),
    ).toEqual({ kind: "user", openPath: "/users/u", sameTarget: { targetUserId: "u" } });
  });

  it("구인 조치는 구인 상세와 targetGame", () => {
    expect(
      auditSubject({ action: "구인 숨김", target: "등대 · GM 새벽", targetGameId: "g" }),
    ).toEqual({ kind: "game", openPath: "/posts/g", sameTarget: { targetGameId: "g" } });
  });

  it("후기 조치는 후기 상세(ID가 있을 때)와 작성자·구인 둘 다", () => {
    const review = {
      action: "후기 숨김",
      target: "김코코의 후기 · 등대",
      targetUserId: "u",
      targetGameId: "g",
    } as const;
    expect(auditSubject({ ...review, reviewId: "r" }).openPath).toBe("/reviews/r");
    expect(auditSubject(review)).toEqual({
      kind: "review",
      openPath: undefined,
      sameTarget: { targetUserId: "u", targetGameId: "g" },
    });
  });

  it("룰북·설정처럼 ID가 없는 대상은 이름으로", () => {
    expect(auditSubject({ action: "룰북 수정", target: "인세인", rulebookId: "b" })).toEqual({
      kind: "rulebook",
      openPath: "/rules/b",
      sameTarget: { target: "인세인" },
    });
    expect(auditSubject({ action: "서버 설정 변경", target: "TRPIA · 공지 채널" })).toEqual({
      kind: "other",
      sameTarget: { target: "TRPIA" },
    });
  });
});
