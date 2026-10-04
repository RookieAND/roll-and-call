import { describe, expect, it } from "vitest";

import { GAME_CANCEL_KIND } from "#/modules/games/model/game-cancel-kind";

import { NOTIFICATION_KINDS } from "./is-notification-kind";
import {
  MONTHLY_AWARD_ROLE,
  NOTIFICATION_KIND,
  type NotificationPayload,
} from "./notification-kind";
import { notificationText } from "./notification-text";

const game = { gameId: "g1", gameTitle: "검은 산의 노래" };
const rulebook = { rulebookId: "r1", rulebookName: "인세인" };

function line(payload: NotificationPayload) {
  const text = notificationText(payload);
  return {
    line: `${text.pre}${text.strong ?? ""}${text.post}`,
    strong: text.strong,
    sub: text.sub,
  };
}

const CASES: [NotificationPayload, string, string | null][] = [
  [
    { kind: NOTIFICATION_KIND.participationConfirmed, params: game },
    "검은 산의 노래 참여가 확정되었습니다.",
    null,
  ],
  [
    { kind: NOTIFICATION_KIND.movedToWaitlist, params: { ...game, waitlistRank: 2 } },
    "검은 산의 노래에서 대기로 옮겨졌습니다.",
    "대기 2번",
  ],
  [
    { kind: NOTIFICATION_KIND.removedFromRoster, params: game },
    "검은 산의 노래 참여 목록에서 제외되었습니다.",
    null,
  ],
  [
    { kind: NOTIFICATION_KIND.seatOpened, params: game },
    "검은 산의 노래에 빈자리가 생겼습니다.",
    "GM이 대기 명단에서 확정합니다.",
  ],
  [
    { kind: NOTIFICATION_KIND.participantLeft, params: { ...game, nickname: "새벽별" } },
    "새벽별님이 검은 산의 노래 참여를 취소했습니다.",
    null,
  ],
  [
    { kind: NOTIFICATION_KIND.drawWon, params: game },
    "검은 산의 노래 추첨에 뽑혔습니다.",
    "참여가 확정되었습니다.",
  ],
  [
    { kind: NOTIFICATION_KIND.drawWaitlisted, params: { ...game, waitlistRank: 1 } },
    "검은 산의 노래 추첨 결과 대기 1번입니다.",
    "자리가 나면 GM이 대기 명단에서 확정합니다.",
  ],
  [
    { kind: NOTIFICATION_KIND.recruitmentClosedEmpty, params: game },
    "검은 산의 노래 신청자 없이 모집이 끝났습니다.",
    null,
  ],
  [
    {
      kind: NOTIFICATION_KIND.sessionTimeSet,
      params: { ...game, startsAt: "2026-09-27T11:00:00.000Z" },
    },
    "검은 산의 노래 세션 시간이 정해졌습니다.",
    "9월 27일 (일) 20:00",
  ],
  [
    {
      kind: NOTIFICATION_KIND.sessionTimeChanged,
      params: {
        ...game,
        previousStartsAt: "2026-09-27T11:00:00.000Z",
        startsAt: "2026-09-28T12:00:00.000Z",
      },
    },
    "검은 산의 노래 세션 시간이 바뀌었습니다.",
    "9월 27일 20:00 → 9월 28일 21:00",
  ],
  [
    {
      kind: NOTIFICATION_KIND.gameCancelled,
      params: { ...game, cancelKind: GAME_CANCEL_KIND.gm, reason: "개인 사정" },
    },
    "검은 산의 노래 구인이 취소되었습니다.",
    "사유: 개인 사정",
  ],
  [
    {
      kind: NOTIFICATION_KIND.gameCancelled,
      params: { ...game, cancelKind: GAME_CANCEL_KIND.gm, reason: null },
    },
    "검은 산의 노래 구인이 취소되었습니다.",
    null,
  ],
  [
    {
      kind: NOTIFICATION_KIND.gameCancelled,
      params: { ...game, cancelKind: GAME_CANCEL_KIND.staff, reason: "규칙 위반" },
    },
    "검은 산의 노래 구인이 취소되었습니다.",
    "운영진이 취소했습니다.",
  ],
  [
    {
      kind: NOTIFICATION_KIND.gameCancelled,
      params: { ...game, cancelKind: GAME_CANCEL_KIND.auto, reason: null },
    },
    "검은 산의 노래 구인이 취소되었습니다.",
    "GM이 서버를 나가 취소되었습니다.",
  ],
  [
    { kind: NOTIFICATION_KIND.gameHidden, params: { ...game, reason: "도배" } },
    "검은 산의 노래를 운영진이 숨겼습니다.",
    "사유: 도배",
  ],
  [{ kind: NOTIFICATION_KIND.gameUnhidden, params: game }, "검은 산의 노래가 다시 보입니다.", null],
  [
    { kind: NOTIFICATION_KIND.absenceRecorded, params: game },
    "검은 산의 노래 세션에 불참으로 기록되었습니다.",
    "이의가 있으면 운영진에게 문의해 주세요.",
  ],
  [
    { kind: NOTIFICATION_KIND.absenceAddedByStaff, params: game },
    "검은 산의 노래 세션에 불참으로 기록되었습니다.",
    "운영진이 기록했습니다.",
  ],
  [
    { kind: NOTIFICATION_KIND.absenceCancelled, params: game },
    "검은 산의 노래 불참 기록이 취소되었습니다.",
    null,
  ],
  [
    { kind: NOTIFICATION_KIND.absenceRestored, params: game },
    "검은 산의 노래 불참 기록이 다시 남았습니다.",
    null,
  ],
  [
    { kind: NOTIFICATION_KIND.attendanceAutoConfirmed, params: game },
    "검은 산의 노래 출석이 자동으로 확정되었습니다.",
    "세션이 끝나고 7일이 지났습니다.",
  ],
  [
    { kind: NOTIFICATION_KIND.reviewAvailable, params: game },
    "검은 산의 노래 후기를 남길 수 있습니다.",
    null,
  ],
  [
    { kind: NOTIFICATION_KIND.certApproved, params: rulebook },
    "인세인 인증이 승인되었습니다.",
    null,
  ],
  [
    {
      kind: NOTIFICATION_KIND.certRejected,
      params: { ...rulebook, rejectionSummary: "책등 사진이 흐립니다" },
    },
    "인세인 인증이 반려되었습니다.",
    "책등 사진이 흐립니다",
  ],
  [
    { kind: NOTIFICATION_KIND.certRevoked, params: { ...rulebook, cancelledGameCount: 2 } },
    "인세인 인증이 반려로 바뀌었습니다.",
    "열었던 구인 2개가 함께 취소되었습니다.",
  ],
  [
    { kind: NOTIFICATION_KIND.certRevoked, params: { ...rulebook, cancelledGameCount: 0 } },
    "인세인 인증이 반려로 바뀌었습니다.",
    null,
  ],
  [
    { kind: NOTIFICATION_KIND.certGranted, params: rulebook },
    "인세인 인증이 등록되었습니다.",
    "운영진이 직접 등록했습니다.",
  ],
  [
    { kind: NOTIFICATION_KIND.rulebookRequestAdded, params: { rulebookName: "인세인" } },
    "요청한 인세인을 추가했습니다.",
    null,
  ],
  [
    { kind: NOTIFICATION_KIND.rulebookRequestDeclined, params: { rulebookName: "인세인" } },
    "요청한 인세인은 추가하지 않았습니다.",
    null,
  ],
  [
    { kind: NOTIFICATION_KIND.reviewHidden, params: { ...game, reason: "스포일러" } },
    "검은 산의 노래 후기를 운영진이 숨겼습니다.",
    "사유: 스포일러",
  ],
  [
    { kind: NOTIFICATION_KIND.reviewUnhidden, params: game },
    "검은 산의 노래 후기가 다시 보입니다.",
    null,
  ],
  [
    { kind: NOTIFICATION_KIND.reviewDeleted, params: { ...game, reason: "비방" } },
    "검은 산의 노래 후기를 운영진이 삭제했습니다.",
    "사유: 비방",
  ],
  [
    {
      kind: NOTIFICATION_KIND.sanctioned,
      params: { reason: "노쇼 반복", until: "2026-10-10T15:00:00.000Z" },
    },
    "활동이 정지되었습니다.",
    "사유: 노쇼 반복 · 기간: 10월 11일까지",
  ],
  [
    { kind: NOTIFICATION_KIND.sanctioned, params: { reason: "노쇼 반복", until: null } },
    "활동이 정지되었습니다.",
    "사유: 노쇼 반복 · 기간: 해제될 때까지",
  ],
  [{ kind: NOTIFICATION_KIND.sanctionReleased, params: {} }, "활동 정지가 풀렸습니다.", null],
  [
    { kind: NOTIFICATION_KIND.nicknameChanged, params: { nickname: "새벽별", reason: "부적절" } },
    "운영진이 닉네임을 새벽별로 바꿨습니다.",
    "사유: 부적절",
  ],
  [{ kind: NOTIFICATION_KIND.staffAdded, params: {} }, "운영진이 되었습니다.", null],
  [{ kind: NOTIFICATION_KIND.staffRemoved, params: {} }, "운영진에서 빠졌습니다.", null],
  [
    {
      kind: NOTIFICATION_KIND.badgeEarned,
      params: { emoji: "🎒", name: "떠돌이", criterion: "세션 10회 참석" },
    },
    "새 업적 🎒 떠돌이를 받았습니다.",
    "세션 10회 참석",
  ],
  [
    {
      kind: NOTIFICATION_KIND.hiddenTitleEarned,
      params: { emoji: "🌙", name: "밤의 손님", description: "자정을 넘긴 세션" },
    },
    "새 업적 🌙 밤의 손님을 받았습니다.",
    "자정을 넘긴 세션",
  ],
  [
    { kind: NOTIFICATION_KIND.monthlyAward, params: { month: 9, role: MONTHLY_AWARD_ROLE.gm } },
    "9월의 GM으로 뽑혔습니다.",
    null,
  ],
  [
    { kind: NOTIFICATION_KIND.monthlyAward, params: { month: 9, role: MONTHLY_AWARD_ROLE.pl } },
    "9월의 PL로 뽑혔습니다.",
    null,
  ],
];

describe("notificationText", () => {
  it.each(CASES)("%o", (payload, expectedLine, expectedSub) => {
    const result = line(payload);
    expect(result.line).toBe(expectedLine);
    expect(result.sub).toBe(expectedSub);
  });

  it("모든 종류를 한 번 이상 확인한다", () => {
    const covered = new Set(CASES.map(([payload]) => payload.kind));
    expect(NOTIFICATION_KINDS.filter((kind) => !covered.has(kind))).toEqual([]);
  });

  it("구인 제목·룰북 이름·닉네임·업적 이름만 굵게", () => {
    expect(
      line({ kind: NOTIFICATION_KIND.participantLeft, params: { ...game, nickname: "새벽별" } })
        .strong,
    ).toBe("검은 산의 노래");
    expect(line({ kind: NOTIFICATION_KIND.sanctionReleased, params: {} }).strong).toBeNull();
  });

  it.each([
    ["물벼락", "물벼락을 운영진이 숨겼습니다.", "물벼락이 다시 보입니다."],
    ["붉은 실", "붉은 실을 운영진이 숨겼습니다.", "붉은 실이 다시 보입니다."],
    ["검은 산의 노래", "검은 산의 노래를 운영진이 숨겼습니다.", "검은 산의 노래가 다시 보입니다."],
    [
      "Call of Cthulhu",
      "Call of Cthulhu를 운영진이 숨겼습니다.",
      "Call of Cthulhu가 다시 보입니다.",
    ],
  ])("조사: %s", (gameTitle, hidden, unhidden) => {
    const params = { gameId: "g1", gameTitle };
    expect(
      line({ kind: NOTIFICATION_KIND.gameHidden, params: { ...params, reason: "x" } }).line,
    ).toBe(hidden);
    expect(line({ kind: NOTIFICATION_KIND.gameUnhidden, params }).line).toBe(unhidden);
  });

  it.each([
    ["새벽별", "운영진이 닉네임을 새벽별로 바꿨습니다."],
    ["달빛토끼3", "운영진이 닉네임을 달빛토끼3으로 바꿨습니다."],
    ["달빛토끼2", "운영진이 닉네임을 달빛토끼2로 바꿨습니다."],
    ["달빛토끼7", "운영진이 닉네임을 달빛토끼7로 바꿨습니다."],
  ])("방향 조사: %s", (nickname, expected) => {
    expect(
      line({ kind: NOTIFICATION_KIND.nicknameChanged, params: { nickname, reason: "x" } }).line,
    ).toBe(expected);
  });

  it("날짜는 KST 기준이다(UTC 15:00은 다음 날)", () => {
    expect(
      line({
        kind: NOTIFICATION_KIND.sessionTimeSet,
        params: { ...game, startsAt: "2026-09-26T15:00:00.000Z" },
      }).sub,
    ).toBe("9월 27일 (일) 00:00");
  });

  it("문구에 작은따옴표·엠대시·금지어가 없다", () => {
    for (const [payload] of CASES) {
      const text = notificationText(payload);
      const joined = [text.pre, text.post, text.sub ?? ""].join(" ");
      expect(joined).not.toMatch(/['‘’—]|자동 추첨|DM/);
    }
  });
});
