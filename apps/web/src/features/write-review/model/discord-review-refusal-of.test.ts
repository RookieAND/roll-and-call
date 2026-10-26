import type { ReviewDraftTarget } from "@roll-and-call/database/reviews";
import { describe, expect, it } from "vitest";

import { PARTICIPANT_STATUS } from "@/entities/game";

import { DISCORD_REVIEW_REFUSAL } from "./discord-review-refusal";
import { discordReviewRefusalOf } from "./discord-review-refusal-of";

const NOW = new Date("2026-09-28T12:00:00+09:00");
const DAY = 24 * 60 * 60 * 1000;

const target = {
  game: {
    confirmedAt: new Date(NOW.getTime() - 3 * DAY),
    playMinutes: 180,
    endedAt: null,
    cancelledAt: null,
    attendanceConfirmedAt: new Date(NOW.getTime() - 3 * DAY),
  },
  participant: { status: PARTICIPANT_STATUS.confirmed, absent: false, absenceCancelledAt: null },
  review: null,
  suspended: false,
  isGm: false,
  confirmedCount: 3,
} as unknown as ReviewDraftTarget;

describe("discordReviewRefusalOf", () => {
  it("쓸 수 있으면 null이다", () => {
    expect(discordReviewRefusalOf(target, NOW)).toBeNull();
  });

  it("세션이 없으면 세션을 찾을 수 없다고 알린다", () => {
    expect(discordReviewRefusalOf(null, NOW)).toBe(DISCORD_REVIEW_REFUSAL.gameNotFound);
  });

  it("이미 쓴 후기가 있으면 이미 썼다고 알린다", () => {
    const written = { ...target, review: {} } as unknown as ReviewDraftTarget;
    expect(discordReviewRefusalOf(written, NOW)).toBe(DISCORD_REVIEW_REFUSAL.alreadyWritten);
  });

  it("참여 기록이 없는 사람과 확정되지 않은 사람, 제외된 사람을 나눈다", () => {
    expect(discordReviewRefusalOf({ ...target, participant: null }, NOW)).toBe(
      DISCORD_REVIEW_REFUSAL.notParticipant,
    );
    const waiting = { ...target.participant!, status: PARTICIPANT_STATUS.waiting };
    expect(discordReviewRefusalOf({ ...target, participant: waiting }, NOW)).toBe(
      DISCORD_REVIEW_REFUSAL.notConfirmed,
    );
    const removed = { ...target.participant!, status: PARTICIPANT_STATUS.removed };
    expect(discordReviewRefusalOf({ ...target, participant: removed }, NOW)).toBe(
      DISCORD_REVIEW_REFUSAL.removed,
    );
  });

  it("GM은 출석 확정 여부와 상관없이 웹에서 쓰게 안내한다", () => {
    const gm = { ...target, isGm: true, participant: null } as ReviewDraftTarget;
    expect(discordReviewRefusalOf(gm, NOW)).toBe(DISCORD_REVIEW_REFUSAL.gmOnWeb);
  });

  it("시작 전, 불참, 정지, 기간 지남은 웹과 같은 사유로 알린다", () => {
    const upcoming = {
      ...target,
      game: { ...target.game, confirmedAt: new Date(NOW.getTime() + DAY) },
    } as ReviewDraftTarget;
    expect(discordReviewRefusalOf(upcoming, NOW)).toBe(DISCORD_REVIEW_REFUSAL.notStarted);

    const absent = { ...target.participant!, absent: true };
    expect(discordReviewRefusalOf({ ...target, participant: absent }, NOW)).toBe(
      DISCORD_REVIEW_REFUSAL.absent,
    );

    expect(discordReviewRefusalOf({ ...target, suspended: true }, NOW)).toBe(
      DISCORD_REVIEW_REFUSAL.suspended,
    );

    const late = new Date(NOW.getTime() + 8 * DAY);
    expect(discordReviewRefusalOf(target, late)).toBe(DISCORD_REVIEW_REFUSAL.writePeriodOver);
  });
});
