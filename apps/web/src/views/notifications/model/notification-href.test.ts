import { GAME_CANCEL_KIND } from "@roll-and-call/database/games/model";
import {
  MONTHLY_AWARD_ROLE,
  NOTIFICATION_KIND,
  NOTIFICATION_KINDS,
  type NotificationPayload,
} from "@roll-and-call/database/notifications/model";
import { describe, expect, it } from "vitest";

import { notificationHref } from "./notification-href";

const game = { gameId: "g1", gameTitle: "물벼락" };
const rulebook = { rulebookId: "r1", rulebookName: "인세인" };

const CASES: [NotificationPayload, string | null][] = [
  [{ kind: NOTIFICATION_KIND.participationConfirmed, params: game }, "/games/g1"],
  [{ kind: NOTIFICATION_KIND.movedToWaitlist, params: { ...game, waitlistRank: 1 } }, "/games/g1"],
  [{ kind: NOTIFICATION_KIND.removedFromRoster, params: game }, "/games/g1"],
  [{ kind: NOTIFICATION_KIND.seatOpened, params: game }, "/games/g1"],
  [
    { kind: NOTIFICATION_KIND.participantLeft, params: { ...game, nickname: "새벽별" } },
    "/games/g1/participants",
  ],
  [{ kind: NOTIFICATION_KIND.lotteryScheduleConfirmed, params: game }, "/games/g1"],
  [{ kind: NOTIFICATION_KIND.lotteryParticipationConfirmed, params: game }, "/games/g1"],
  [{ kind: NOTIFICATION_KIND.drawWon, params: game }, "/games/g1/draw"],
  [
    { kind: NOTIFICATION_KIND.drawWaitlisted, params: { ...game, waitlistRank: 2 } },
    "/games/g1/draw",
  ],
  [{ kind: NOTIFICATION_KIND.recruitmentClosedEmpty, params: game }, "/games/g1/manage"],
  [
    {
      kind: NOTIFICATION_KIND.sessionTimeSet,
      params: { ...game, startsAt: "2026-10-05T11:00:00Z" },
    },
    "/games/g1",
  ],
  [
    {
      kind: NOTIFICATION_KIND.sessionTimeChanged,
      params: {
        ...game,
        previousStartsAt: "2026-10-05T11:00:00Z",
        startsAt: "2026-10-06T11:00:00Z",
      },
    },
    "/games/g1",
  ],
  [
    {
      kind: NOTIFICATION_KIND.gameCancelled,
      params: { ...game, cancelKind: GAME_CANCEL_KIND.gm, reason: null },
    },
    "/games/g1",
  ],
  [{ kind: NOTIFICATION_KIND.gameHidden, params: { ...game, reason: "도배" } }, "/games/g1"],
  [{ kind: NOTIFICATION_KIND.gameUnhidden, params: game }, "/games/g1"],
  [{ kind: NOTIFICATION_KIND.absenceRecorded, params: game }, "/games/g1"],
  [{ kind: NOTIFICATION_KIND.absenceAddedByStaff, params: game }, "/games/g1"],
  [{ kind: NOTIFICATION_KIND.absenceCancelled, params: game }, "/games/g1"],
  [{ kind: NOTIFICATION_KIND.absenceRestored, params: game }, "/games/g1"],
  [{ kind: NOTIFICATION_KIND.attendanceAutoConfirmed, params: game }, "/games/g1"],
  [{ kind: NOTIFICATION_KIND.reviewAvailable, params: game }, "/games/g1/review"],
  [{ kind: NOTIFICATION_KIND.certApproved, params: rulebook }, "/me/rulebooks/r1"],
  [
    { kind: NOTIFICATION_KIND.certRejected, params: { ...rulebook, rejectionSummary: "x" } },
    "/me/rulebooks/r1",
  ],
  [
    { kind: NOTIFICATION_KIND.certRevoked, params: { ...rulebook, cancelledGameCount: 0 } },
    "/me/rulebooks/r1",
  ],
  [{ kind: NOTIFICATION_KIND.certGranted, params: rulebook }, "/me/rulebooks"],
  [
    { kind: NOTIFICATION_KIND.rulebookRequestAdded, params: { rulebookName: "인세인" } },
    "/me/rulebooks",
  ],
  [
    { kind: NOTIFICATION_KIND.rulebookRequestDeclined, params: { rulebookName: "인세인" } },
    "/me/rulebooks",
  ],
  [{ kind: NOTIFICATION_KIND.reviewHidden, params: { ...game, reason: "x" } }, "/me/reviews"],
  [{ kind: NOTIFICATION_KIND.reviewUnhidden, params: game }, "/me/reviews"],
  [{ kind: NOTIFICATION_KIND.reviewDeleted, params: { ...game, reason: "x" } }, "/me/reviews"],
  [{ kind: NOTIFICATION_KIND.sanctioned, params: { reason: "x", until: null } }, "/me"],
  [{ kind: NOTIFICATION_KIND.sanctionReleased, params: {} }, null],
  [
    { kind: NOTIFICATION_KIND.nicknameChanged, params: { nickname: "새벽별", reason: "x" } },
    "/me/edit",
  ],
  [{ kind: NOTIFICATION_KIND.staffAdded, params: {} }, null],
  [{ kind: NOTIFICATION_KIND.staffRemoved, params: {} }, null],
  [
    {
      kind: NOTIFICATION_KIND.badgeEarned,
      params: { emoji: "🎒", name: "떠돌이", criterion: "x" },
    },
    "/me/badges",
  ],
  [
    {
      kind: NOTIFICATION_KIND.hiddenTitleEarned,
      params: { emoji: "💥", name: "대성공", description: "x" },
    },
    "/me/badges",
  ],
  [
    { kind: NOTIFICATION_KIND.monthlyAward, params: { month: 9, role: MONTHLY_AWARD_ROLE.gm } },
    "/me/badges",
  ],
];

describe("notificationHref", () => {
  it.each(CASES)("%o", (payload, href) => {
    expect(notificationHref(payload)).toBe(href);
  });

  it("모든 종류를 확인한다", () => {
    const covered = new Set(CASES.map(([payload]) => payload.kind));
    expect(NOTIFICATION_KINDS.filter((kind) => !covered.has(kind))).toEqual([]);
  });
});
