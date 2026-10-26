import { describe, expect, it } from "vitest";

import type { SessionGame } from "@/entities/game";

import { reviewNote } from "./review-note";
import { SESSION_ACTION_KIND, type SessionContext } from "./session-card-model";

const NOW = new Date("2026-09-28T12:00:00+09:00");
const DAY = 24 * 60 * 60 * 1000;
const game = {
  id: "game",
  confirmedAt: new Date(NOW.getTime() - 5 * DAY),
  playMinutes: 60,
  endedAt: null,
  attendanceConfirmedAt: new Date(NOW.getTime() - 5 * DAY),
} as SessionGame;
const context = (reviewed: [string, { createdAt: Date; removedAt: Date | null }][] = []) =>
  ({ viewerId: "me", now: NOW, reviewedGames: new Map(reviewed) }) as unknown as SessionContext;

describe("reviewNote", () => {
  it("출석 확인 전에도 마감 안이면 후기 쓰기를 단다", () => {
    const note = reviewNote({
      game: { ...game, attendanceConfirmedAt: null },
      context: context(),
    });
    expect(note.caption?.text).toBe("후기 마감 D-2");
    expect(note.action?.kind).toBe(SESSION_ACTION_KIND.writeReview);
  });

  it("아직 안 썼으면 마감 D-n과 후기 쓰기를 단다", () => {
    const note = reviewNote({ game, context: context() });
    expect(note.caption).toEqual({ text: "후기 마감 D-2", strong: true });
    expect(note.action?.kind).toBe(SESSION_ACTION_KIND.writeReview);
  });

  it("마감은 종료 판정 + 7일이라 출석 확정 시각과 무관하다", () => {
    const old = { ...game, confirmedAt: new Date(NOW.getTime() - 9 * DAY) };
    expect(reviewNote({ game: old, context: context() }).caption?.text).toBe("작성 기간 지남");
  });

  it("썼으면 수정 기한과 내 후기 보기를 단다", () => {
    const note = reviewNote({
      game,
      context: context([
        ["game", { createdAt: new Date(NOW.getTime() - 5 * DAY), removedAt: null }],
      ]),
    });
    expect(note.caption?.text).toBe("수정 가능 · D-2");
    expect(note.action?.kind).toBe(SESSION_ACTION_KIND.viewReview);
  });

  it("기한이 지났거나 남의 프로필이면 버튼이 없다", () => {
    const late = {
      ...game,
      confirmedAt: new Date(NOW.getTime() - 20 * DAY),
      attendanceConfirmedAt: new Date(NOW.getTime() - 20 * DAY),
    };
    expect(reviewNote({ game: late, context: context() }).caption?.text).toBe("작성 기간 지남");
    expect(reviewNote({ game, context: { ...context(), readOnly: true } }).caption).toBeNull();
  });
});
