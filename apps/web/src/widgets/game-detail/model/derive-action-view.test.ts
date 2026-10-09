import { describe, expect, it } from "vitest";

import { PARTICIPANT_STATUS, RECRUIT_METHOD, SCHEDULE_MODE } from "@/entities/game";

import { deriveActionView } from "./derive-action-view";
import { type ActionContext, GAME_ACTION_VIEW } from "./game-action-view";
import { REVIEW_STATUS } from "./review-status";

const NOW = new Date("2026-09-14T12:00:00+09:00");
const HOUR = 60 * 60 * 1000;
const at = (hours: number) => new Date(NOW.getTime() + hours * HOUR);

const firstCome: ActionContext["game"] = {
  scheduleMode: SCHEDULE_MODE.coordinate,
  recruitMethod: RECRUIT_METHOD.firstCome,
  confirmedAt: null,
  endDate: at(48),
  drawnAt: null,
  selectionFinishedAt: null,
  cancelledAt: null,
  cancelKind: null,
  cancelReason: null,
  playMinutes: 180,
  endedAt: null,
  attendanceConfirmedAt: null,
  attendanceFirstConfirmedAt: null,
  maxPlayers: 4,
  waitlistEnabled: true,
};
const lottery = { ...firstCome, recruitMethod: RECRUIT_METHOD.lottery };
const fixed = { ...firstCome, scheduleMode: SCHEDULE_MODE.fixed, confirmedAt: at(72) };
const outsider: ActionContext["viewer"] = {
  isGm: false,
  status: null,
  absent: false,
  absenceCancelledAt: null,
  waitlistRank: null,
};
const confirmed = { ...outsider, status: PARTICIPANT_STATUS.confirmed };
const waiting = { ...outsider, status: PARTICIPANT_STATUS.waiting, waitlistRank: 2 };
const gm = { ...outsider, isGm: true };

const view = (overrides: Partial<ActionContext>) =>
  deriveActionView({
    game: firstCome,
    viewer: outsider,
    confirmedCount: 2,
    waitingCount: 0,
    lotteryHeld: true,
    sanction: null,
    review: REVIEW_STATUS.unavailable,
    now: NOW,
    ...overrides,
  });

describe("추첨 없이 확정된 구인", () => {
  it("추첨을 적용한 글이어도 굴린 추첨이 없으면 [결과 보러 가기]를 두지 않고 일정 조율 입구를 둔다", () => {
    const skipped = { ...lottery, scheduleMode: SCHEDULE_MODE.coordinate, drawnAt: at(-1) };
    expect(
      view({
        game: { ...skipped, confirmedAt: at(24) },
        viewer: confirmed,
        lotteryHeld: false,
      }),
    ).toMatchObject({ resultLink: false, scheduleLink: true });
    expect(
      view({
        game: { ...skipped, confirmedAt: at(24) },
        viewer: confirmed,
        lotteryHeld: true,
      }),
    ).toMatchObject({ resultLink: true, scheduleLink: false });
  });

  it("추첨 없이 확정된 구인의 확정자 잠금 상태에도 결과 입구가 없다", () => {
    expect(
      view({
        game: { ...fixed, recruitMethod: RECRUIT_METHOD.lottery, drawnAt: at(-1) },
        viewer: confirmed,
        confirmedCount: 4,
        lotteryHeld: false,
      }),
    ).toMatchObject({ resultLink: false });
  });
});

describe("deriveActionView", () => {
  it("(1) 취소됨: GM 취소 사유, 운영진·자동 취소, GM과 비GM", () => {
    const cancelled = { ...firstCome, cancelledAt: at(-1), cancelKind: "gm" as const };
    expect(view({ game: { ...cancelled, cancelReason: "일정" }, viewer: gm })).toEqual({
      kind: GAME_ACTION_VIEW.cancelled,
      cancelKind: "gm",
      reason: "일정",
      isGm: true,
    });
    expect(view({ game: { ...cancelled, cancelKind: "staff" }, viewer: confirmed })).toMatchObject({
      kind: GAME_ACTION_VIEW.cancelled,
      cancelKind: "staff",
      isGm: false,
    });
    expect(view({ game: { ...cancelled, cancelKind: "auto" } })).toMatchObject({
      cancelKind: "auto",
    });
  });

  it("GM은 마스터링 후기를 쓸 수 있을 때만 마감까지 남은 일수를 받는다", () => {
    const recorded = {
      ...firstCome,
      confirmedAt: at(-5),
      attendanceConfirmedAt: at(-1),
      attendanceFirstConfirmedAt: at(-1),
    };
    expect(view({ game: recorded, viewer: gm, review: REVIEW_STATUS.writable })).toMatchObject({
      review: REVIEW_STATUS.writable,
      reviewDaysLeft: 7,
    });
    expect(view({ game: recorded, viewer: gm, review: REVIEW_STATUS.written })).toMatchObject({
      reviewDaysLeft: null,
    });
  });

  it("(2) GM 세션 끝남: 출석 할 일, 기록, 확정 0명", () => {
    const ended = { ...firstCome, confirmedAt: at(-5) };
    expect(view({ game: ended, viewer: gm })).toEqual({
      kind: GAME_ACTION_VIEW.gmEnded,
      attendanceDue: true,
      attendanceRecorded: false,
      endedOn: ended.confirmedAt,
      review: REVIEW_STATUS.unavailable,
      reviewDaysLeft: null,
    });
    expect(view({ game: { ...ended, attendanceConfirmedAt: at(-1) }, viewer: gm })).toMatchObject({
      attendanceDue: false,
      attendanceRecorded: true,
    });
    expect(view({ game: { ...ended, confirmedAt: at(-24 * 9) }, viewer: gm })).toMatchObject({
      attendanceDue: false,
      attendanceRecorded: true,
    });
    expect(view({ game: ended, viewer: gm, confirmedCount: 0 })).toMatchObject({
      attendanceDue: false,
      attendanceRecorded: false,
    });
  });

  it("(3) GM 진행 중", () => {
    expect(view({ game: { ...firstCome, confirmedAt: at(-1) }, viewer: gm })).toEqual({
      kind: GAME_ACTION_VIEW.gmLive,
      attendanceExpected: true,
    });
    expect(
      view({ game: { ...firstCome, confirmedAt: at(-1) }, viewer: gm, confirmedCount: 0 }),
    ).toEqual({ kind: GAME_ACTION_VIEW.gmLive, attendanceExpected: false });
  });

  it("(4) GM 시작 전: 시각이 있으면 캘린더", () => {
    expect(view({ game: fixed, viewer: gm })).toEqual({
      kind: GAME_ACTION_VIEW.gmUpcoming,
      calendar: true,
    });
    expect(view({ viewer: gm })).toEqual({ kind: GAME_ACTION_VIEW.gmUpcoming, calendar: false });
  });

  it("(5) 불참 기록: removed 진행 중, 출석에서 불참, 불참 취소는 아님", () => {
    const live = { ...firstCome, confirmedAt: at(-1) };
    const removed = { ...outsider, status: PARTICIPANT_STATUS.removed };
    expect(view({ game: live, viewer: removed })).toEqual({ kind: GAME_ACTION_VIEW.absent });
    const ended = { ...firstCome, confirmedAt: at(-5) };
    expect(view({ game: ended, viewer: { ...confirmed, absent: true } })).toEqual({
      kind: GAME_ACTION_VIEW.absent,
    });
    expect(
      view({ game: ended, viewer: { ...confirmed, absent: true, absenceCancelledAt: at(-1) } }),
    ).toMatchObject({ kind: GAME_ACTION_VIEW.endedParticipant });
  });

  it("(6) 종료 참여자: 출석 확정 여부와 후기 상태", () => {
    const ended = { ...firstCome, confirmedAt: at(-5) };
    expect(view({ game: ended, viewer: confirmed })).toEqual({
      kind: GAME_ACTION_VIEW.endedParticipant,
      endedOn: at(-5),
      attendanceConfirmed: false,
      review: REVIEW_STATUS.unavailable,
    });
    expect(
      view({
        game: { ...ended, attendanceConfirmedAt: at(-1) },
        viewer: confirmed,
        review: REVIEW_STATUS.writable,
      }),
    ).toMatchObject({ attendanceConfirmed: true, review: REVIEW_STATUS.writable });
  });

  it("(7) 종료 그 밖: 끝난 세션의 대기자와 비참여자", () => {
    const ended = { ...firstCome, confirmedAt: at(-5) };
    expect(view({ game: ended, viewer: waiting })).toEqual({ kind: GAME_ACTION_VIEW.endedOther });
    expect(view({ game: ended })).toEqual({ kind: GAME_ACTION_VIEW.endedOther });
  });

  it("(8) 추첨 신청함: 마감 전과 마감 뒤", () => {
    const applicant = { ...outsider, status: PARTICIPANT_STATUS.waiting, waitlistRank: 1 };
    expect(view({ game: lottery, viewer: applicant })).toEqual({
      kind: GAME_ACTION_VIEW.lotteryApplied,
      endDate: at(48),
      closed: false,
      confirmsAll: false,
    });
    expect(view({ game: { ...lottery, endDate: at(-1) }, viewer: applicant })).toMatchObject({
      closed: true,
    });
    expect(
      view({
        game: { ...lottery, endDate: at(-1) },
        viewer: applicant,
        confirmedCount: 0,
        waitingCount: 1,
      }),
    ).toMatchObject({ confirmsAll: true });
  });

  it("(9) 대기 중: 선착순 대기, 추첨 뒤 대기", () => {
    expect(view({ viewer: waiting })).toEqual({
      kind: GAME_ACTION_VIEW.waiting,
      rank: 2,
      resultLink: false,
      selection: false,
    });
    expect(view({ game: { ...lottery, drawnAt: at(-1) }, viewer: waiting })).toMatchObject({
      resultLink: true,
    });
  });

  it("(10) 일정 확정 참여자: 시작 전과 진행 중", () => {
    const scheduled = { ...firstCome, confirmedAt: at(24) };
    expect(view({ game: scheduled, viewer: confirmed })).toEqual({
      kind: GAME_ACTION_VIEW.scheduled,
      confirmedAt: at(24),
      live: false,
      resultLink: false,
      scheduleLink: true,
      calendar: true,
    });
    expect(
      view({ game: { ...lottery, confirmedAt: at(24), drawnAt: at(-1) }, viewer: confirmed }),
    ).toMatchObject({ resultLink: true, scheduleLink: false });
    expect(view({ game: { ...fixed, confirmedAt: at(-1) }, viewer: confirmed })).toMatchObject({
      kind: GAME_ACTION_VIEW.scheduled,
      live: true,
      scheduleLink: false,
      calendar: false,
    });
  });

  it("(11) 확정·취소 가능: 자리 남음, 정원 참이어도 대기 있음, 추첨 글 직접 확정자", () => {
    expect(view({ viewer: confirmed })).toMatchObject({
      kind: GAME_ACTION_VIEW.confirmedOpen,
      scheduleLink: true,
      calendar: false,
    });
    expect(view({ viewer: confirmed, confirmedCount: 4, waitingCount: 1 })).toMatchObject({
      kind: GAME_ACTION_VIEW.confirmedOpen,
    });
    expect(view({ game: lottery, viewer: confirmed, confirmedCount: 4 })).toMatchObject({
      kind: GAME_ACTION_VIEW.confirmedOpen,
    });
    expect(view({ game: fixed, viewer: confirmed })).toMatchObject({
      kind: GAME_ACTION_VIEW.confirmedOpen,
      scheduleLink: false,
      calendar: true,
    });
  });

  it("(12) 확정·취소 불가: 정원 참·마감·추첨 뒤", () => {
    expect(view({ viewer: confirmed, confirmedCount: 4 })).toMatchObject({
      kind: GAME_ACTION_VIEW.confirmedLocked,
      block: "full",
    });
    expect(view({ game: { ...firstCome, endDate: at(-1) }, viewer: confirmed })).toMatchObject({
      block: "expired",
    });
    expect(
      view({
        game: { ...fixed, recruitMethod: RECRUIT_METHOD.lottery, drawnAt: at(-1) },
        viewer: confirmed,
      }),
    ).toMatchObject({ block: "drawn", resultLink: true, scheduleLink: false, calendar: true });
  });

  it("(13) 비참여자 · 조율형 일정 확정", () => {
    expect(view({ game: { ...firstCome, confirmedAt: at(24) } })).toEqual({
      kind: GAME_ACTION_VIEW.closedScheduled,
      confirmedAt: at(24),
    });
  });

  it("(14) 비참여자 · 모집 끝: 마감 지남, 대기 끈 정원 참, 일시 지정형 시작", () => {
    const closed = { kind: GAME_ACTION_VIEW.closed };
    expect(view({ game: { ...firstCome, endDate: at(-1) } })).toEqual(closed);
    expect(view({ game: { ...firstCome, waitlistEnabled: false }, confirmedCount: 4 })).toEqual(
      closed,
    );
    expect(view({ game: { ...fixed, confirmedAt: at(-1) } })).toEqual(closed);
  });

  it("(15) 제재 중: 모집이 열려 있을 때만", () => {
    const sanction = { reason: "반복된 불참", until: null };
    expect(view({ sanction })).toEqual({ kind: GAME_ACTION_VIEW.sanctioned, ...sanction });
    expect(view({ sanction, game: { ...firstCome, endDate: at(-1) } })).toEqual({
      kind: GAME_ACTION_VIEW.closed,
    });
  });

  it("(16) 대기로 신청 · (17) 신청 · (18) 추첨 신청", () => {
    expect(view({ confirmedCount: 4, waitingCount: 1 })).toEqual({
      kind: GAME_ACTION_VIEW.joinWaitlist,
      nextRank: 2,
    });
    expect(view({})).toEqual({ kind: GAME_ACTION_VIEW.join });
    expect(view({ game: lottery, confirmedCount: 9 })).toEqual({
      kind: GAME_ACTION_VIEW.joinLottery,
      endDate: at(48),
    });
  });
});

describe("선발 구인", () => {
  const selection = { ...firstCome, recruitMethod: RECRUIT_METHOD.selection };

  it("신청 전에는 신청 입구, 마감 뒤에는 모집 끝 안내", () => {
    expect(view({ game: selection })).toMatchObject({ kind: GAME_ACTION_VIEW.joinSelection });
    expect(view({ game: { ...selection, endDate: at(-1) } })).toMatchObject({
      kind: GAME_ACTION_VIEW.closed,
    });
  });

  it("선발 전 신청자는 마감 전 취소 입구, 마감 뒤 안내만", () => {
    expect(view({ game: selection, viewer: waiting })).toMatchObject({
      kind: GAME_ACTION_VIEW.selectionApplied,
      closed: false,
    });
    expect(view({ game: { ...selection, endDate: at(-1) }, viewer: waiting })).toMatchObject({
      kind: GAME_ACTION_VIEW.selectionApplied,
      closed: true,
    });
  });

  it("선발을 마친 뒤 대기자는 대기 번호와 결과 입구 없음", () => {
    const finished = { ...selection, endDate: at(-1), selectionFinishedAt: at(-1) };
    expect(view({ game: finished, viewer: waiting, waitingCount: 3 })).toMatchObject({
      kind: GAME_ACTION_VIEW.waiting,
      rank: 2,
      resultLink: false,
    });
  });
});
