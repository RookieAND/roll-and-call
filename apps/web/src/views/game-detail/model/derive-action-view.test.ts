import { describe, expect, it } from "vitest";

import { deriveActionView, GAME_ACTION_VIEW } from "./derive-action-view";

const base = {
  isGm: false,
  isSignedIn: true,
  viewerConfirmed: false,
  viewerWaiting: false,
  isLottery: false,
  drawn: false,
  canLeave: true,
  sessionConfirmed: false,
  sessionEnded: false,
  isClosed: false,
  isFull: false,
};

describe("deriveActionView", () => {
  it("1 anon · 비로그인은 로그인부터 한다", () => {
    expect(deriveActionView({ ...base, isSignedIn: false })).toBe(GAME_ACTION_VIEW.anon);
  });

  it("2 joinable · 모집 중인 구인에는 신청 버튼이 선다", () => {
    expect(deriveActionView(base)).toBe(GAME_ACTION_VIEW.joinable);
  });

  it("3 full · 선착순만 정원 참 상태가 있다", () => {
    expect(deriveActionView({ ...base, isFull: true })).toBe(GAME_ACTION_VIEW.full);
    expect(deriveActionView({ ...base, isFull: true, isLottery: true })).toBe(
      GAME_ACTION_VIEW.joinable,
    );
  });

  it("4 applied · 선착순 확정자가 아직 취소할 수 있을 때, 추첨 발표 전 신청자", () => {
    expect(deriveActionView({ ...base, viewerConfirmed: true })).toBe(GAME_ACTION_VIEW.applied);
    expect(deriveActionView({ ...base, viewerWaiting: true, isLottery: true })).toBe(
      GAME_ACTION_VIEW.applied,
    );
  });

  it("5 waiting · 선착순 대기, 추첨 발표 뒤 대기", () => {
    expect(deriveActionView({ ...base, viewerWaiting: true })).toBe(GAME_ACTION_VIEW.waiting);
    expect(deriveActionView({ ...base, viewerWaiting: true, isLottery: true, drawn: true })).toBe(
      GAME_ACTION_VIEW.waiting,
    );
  });

  it("6 joined · 확정자가 더는 취소할 수 없으면 마감 뒤에도 자기 상태를 유지한다", () => {
    expect(
      deriveActionView({ ...base, viewerConfirmed: true, canLeave: false, isClosed: true }),
    ).toBe(GAME_ACTION_VIEW.joined);
  });

  it("7 scheduled · 일정이 확정되면 참여자는 확정 안내를 본다", () => {
    expect(deriveActionView({ ...base, viewerConfirmed: true, sessionConfirmed: true })).toBe(
      GAME_ACTION_VIEW.scheduled,
    );
  });

  it("8 outsider · 안 낀 사람에게 마감·확정된 글은 끝난 모집이다", () => {
    expect(deriveActionView({ ...base, isClosed: true })).toBe(GAME_ACTION_VIEW.outsider);
    expect(deriveActionView({ ...base, sessionConfirmed: true, isSignedIn: false })).toBe(
      GAME_ACTION_VIEW.outsider,
    );
  });

  it("확정 뒤에도 대기자는 순번과 대기 취소를 유지한다", () => {
    expect(deriveActionView({ ...base, viewerWaiting: true, sessionConfirmed: true })).toBe(
      GAME_ACTION_VIEW.waiting,
    );
  });

  it("9 gm · GM은 언제나 운영 관리 바를 본다", () => {
    expect(deriveActionView({ ...base, isGm: true, sessionConfirmed: true })).toBe(
      GAME_ACTION_VIEW.gm,
    );
  });

  it("10·11·12 · 세션이 끝나면 참여자·미참여자·GM이 각자의 종료 바를 본다", () => {
    const ended = { ...base, sessionConfirmed: true, sessionEnded: true, isClosed: true };
    expect(deriveActionView({ ...ended, viewerConfirmed: true, canLeave: false })).toBe(
      GAME_ACTION_VIEW.ended,
    );
    expect(deriveActionView({ ...ended, viewerWaiting: true })).toBe(
      GAME_ACTION_VIEW.endedOutsider,
    );
    expect(deriveActionView({ ...ended, isSignedIn: false })).toBe(GAME_ACTION_VIEW.endedOutsider);
    expect(deriveActionView({ ...ended, isGm: true })).toBe(GAME_ACTION_VIEW.endedGm);
  });
});
