import { describe, expect, it } from "vitest";

import { deriveActionView, GAME_ACTION_VIEW } from "./derive-action-view";

const base = {
  sessionConfirmed: false,
  isGm: false,
  isWaiting: false,
  isClosed: false,
  isSignedIn: true,
  viewerConfirmed: false,
};

describe("deriveActionView", () => {
  it("모집 중인 구인에는 신청 버튼이 선다", () => {
    expect(deriveActionView(base)).toBe(GAME_ACTION_VIEW.joinable);
  });

  it("비로그인은 로그인부터 한다", () => {
    expect(deriveActionView({ ...base, isSignedIn: false })).toBe(GAME_ACTION_VIEW.anon);
  });

  it("마감된 구인은 신청을 받지 않는다", () => {
    expect(deriveActionView({ ...base, isClosed: true })).toBe(GAME_ACTION_VIEW.closed);
  });

  it("마감 뒤에도 참여자·대기자는 자기 상태를 유지한다", () => {
    expect(deriveActionView({ ...base, isClosed: true, viewerConfirmed: true })).toBe(
      GAME_ACTION_VIEW.joined,
    );
    expect(deriveActionView({ ...base, isClosed: true, isWaiting: true })).toBe(
      GAME_ACTION_VIEW.waiting,
    );
  });

  // 확정 안내는 그 세션에 낀 사람의 것이다.
  it("확정된 세션이라도 안 낀 사람에게는 닫힌 글이다", () => {
    expect(deriveActionView({ ...base, sessionConfirmed: true })).toBe(GAME_ACTION_VIEW.closed);
    expect(deriveActionView({ ...base, sessionConfirmed: true, isSignedIn: false })).toBe(
      GAME_ACTION_VIEW.closed,
    );
  });

  it("확정 뒤에도 대기자는 순번과 대기 취소를 유지한다", () => {
    expect(deriveActionView({ ...base, sessionConfirmed: true, viewerConfirmed: true })).toBe(
      GAME_ACTION_VIEW.confirmed,
    );
    expect(deriveActionView({ ...base, sessionConfirmed: true, isWaiting: true })).toBe(
      GAME_ACTION_VIEW.confirmedWaiting,
    );
  });

  it("GM은 모집 중이든 확정 뒤든 같은 운영 관리 바를 본다", () => {
    expect(deriveActionView({ ...base, isGm: true })).toBe(GAME_ACTION_VIEW.gm);
    expect(deriveActionView({ ...base, isGm: true, isClosed: true })).toBe(GAME_ACTION_VIEW.gm);
    expect(deriveActionView({ ...base, isGm: true, sessionConfirmed: true })).toBe(
      GAME_ACTION_VIEW.gm,
    );
  });
});
