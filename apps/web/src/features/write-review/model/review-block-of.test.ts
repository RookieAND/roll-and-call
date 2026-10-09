import { describe, expect, it } from "vitest";

import { PARTICIPANT_STATUS } from "@/entities/game";
import type { ReviewDraftTarget } from "@/shared/server";

import { REVIEW_BLOCK } from "./review-block";
import { reviewBlockOf } from "./review-block-of";

const NOW = new Date("2026-09-28T12:00:00+09:00");
const DAY = 24 * 60 * 60 * 1000;

const target = {
  game: {
    attendanceConfirmedAt: new Date(NOW.getTime() - 3 * DAY),
    attendanceFirstConfirmedAt: new Date(NOW.getTime() - 3 * DAY),
  },
  participant: { status: PARTICIPANT_STATUS.confirmed, absent: false, absenceCancelledAt: null },
  review: null,
  suspended: false,
  isGm: false,
  confirmedCount: 3,
} as unknown as ReviewDraftTarget;

const review = { createdAt: new Date(NOW.getTime() - DAY), hiddenAt: null, removedAt: null };

describe("reviewBlockOf", () => {
  it("출석 확정 뒤 7일 안의 참석자는 쓸 수 있다", () => {
    expect(reviewBlockOf(target, NOW)).toBeNull();
  });

  it("확정 참여자가 아니면 볼 수 없다", () => {
    expect(reviewBlockOf({ ...target, participant: null }, NOW)).toBe(REVIEW_BLOCK.unavailable);
  });

  it("아직 출석 미확정이면 기다리게 한다", () => {
    const pending = {
      ...target,
      game: { attendanceConfirmedAt: null, attendanceFirstConfirmedAt: null },
    } as ReviewDraftTarget;
    expect(reviewBlockOf(pending, NOW)).toBe(REVIEW_BLOCK.attendancePending);
  });

  it("불참이면 쓸 수 없고, 운영진이 취소한 불참은 쓸 수 있다", () => {
    const absent = { ...target.participant!, absent: true };
    expect(reviewBlockOf({ ...target, participant: absent }, NOW)).toBe(REVIEW_BLOCK.absent);
    const cancelled = { ...absent, absenceCancelledAt: NOW };
    expect(reviewBlockOf({ ...target, participant: cancelled }, NOW)).toBeNull();
  });

  it("출석 확정 7일이 지나면 작성 기간이 끝난다", () => {
    const late = new Date(NOW.getTime() + 4 * DAY);
    expect(reviewBlockOf(target, late)).toBe(REVIEW_BLOCK.writePeriodOver);
  });

  it("처음 확정 3일 뒤 다시 확정해도 작성 기한은 처음 확정 + 7일이다", () => {
    const reconfirmed = {
      ...target,
      game: {
        attendanceFirstConfirmedAt: new Date(NOW.getTime() - 6 * DAY),
        attendanceConfirmedAt: new Date(NOW.getTime() - 3 * DAY),
      },
    } as ReviewDraftTarget;
    expect(reviewBlockOf(reconfirmed, new Date(NOW.getTime() + DAY - 1))).toBeNull();
    expect(reviewBlockOf(reconfirmed, new Date(NOW.getTime() + DAY))).toBe(
      REVIEW_BLOCK.writePeriodOver,
    );
  });

  it("쓴 후기는 등록 7일 안에만 고치고, 지운 후기는 다시 열지 못한다", () => {
    const written = { ...target, review } as unknown as ReviewDraftTarget;
    expect(reviewBlockOf(written, NOW)).toBeNull();
    expect(reviewBlockOf(written, new Date(NOW.getTime() + 7 * DAY))).toBe(
      REVIEW_BLOCK.editPeriodOver,
    );
    const deleted = {
      ...target,
      review: { ...review, removedAt: NOW },
    } as unknown as ReviewDraftTarget;
    expect(reviewBlockOf(deleted, NOW)).toBe(REVIEW_BLOCK.unavailable);
  });

  it("활동 정지 중이면 새 후기를 막고, 이미 쓴 후기는 고칠 수 있다", () => {
    const suspended = { ...target, suspended: true };
    expect(reviewBlockOf(suspended, NOW)).toBe(REVIEW_BLOCK.suspended);
    const written = { ...suspended, review } as unknown as ReviewDraftTarget;
    expect(reviewBlockOf(written, NOW)).toBeNull();
  });

  it("출석 미확정·불참은 활동 정지보다 먼저 알린다", () => {
    const pending = {
      ...target,
      suspended: true,
      game: { attendanceConfirmedAt: null, attendanceFirstConfirmedAt: null },
    } as ReviewDraftTarget;
    expect(reviewBlockOf(pending, NOW)).toBe(REVIEW_BLOCK.attendancePending);
    const absent = { ...target.participant!, absent: true };
    expect(reviewBlockOf({ ...target, suspended: true, participant: absent }, NOW)).toBe(
      REVIEW_BLOCK.absent,
    );
  });

  it("활동 정지는 작성 기간 지남보다 먼저 알린다", () => {
    const late = new Date(NOW.getTime() + 4 * DAY);
    expect(reviewBlockOf({ ...target, suspended: true }, late)).toBe(REVIEW_BLOCK.suspended);
  });
});

describe("reviewBlockOf GM", () => {
  const gm = { ...target, participant: null, isGm: true } as ReviewDraftTarget;

  it("출석이 확정된 구인의 GM은 쓸 수 있다", () => {
    expect(reviewBlockOf(gm, NOW)).toBeNull();
  });

  it("출석 확정 전에는 막는다", () => {
    const pending = { ...gm, game: { ...gm.game, attendanceConfirmedAt: null } };
    expect(reviewBlockOf(pending, NOW)).toBe(REVIEW_BLOCK.attendancePending);
  });

  it("확정 참석자가 없으면 막는다", () => {
    expect(reviewBlockOf({ ...gm, confirmedCount: 0 }, NOW)).toBe(REVIEW_BLOCK.unavailable);
  });

  it("작성 기간이 지나면 막는다", () => {
    expect(reviewBlockOf(gm, new Date(NOW.getTime() + 5 * DAY))).toBe(REVIEW_BLOCK.writePeriodOver);
  });

  it("제재 중이면 막는다", () => {
    expect(reviewBlockOf({ ...gm, suspended: true }, NOW)).toBe(REVIEW_BLOCK.suspended);
  });

  it("쓴 GM 후기는 불참 보류 없이 고칠 수 있다", () => {
    expect(reviewBlockOf({ ...gm, review } as ReviewDraftTarget, NOW)).toBeNull();
  });
});
