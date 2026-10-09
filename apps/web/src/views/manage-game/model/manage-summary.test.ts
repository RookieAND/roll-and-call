import { describe, expect, it } from "vitest";

import {
  GAME_CANCEL_KIND,
  MANAGE_STAGE,
  PARTICIPANT_STATUS,
  RECRUIT_METHOD,
  SCHEDULE_MODE,
} from "@/entities/game";
import type { GameDetailData } from "@/shared/server";

import { manageSummary } from "./manage-summary";

const NOW = new Date("2026-09-20T12:00:00+09:00");
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const at = (milliseconds: number) => new Date(NOW.getTime() + milliseconds);

const member = ({
  userId,
  status = PARTICIPANT_STATUS.confirmed,
  absent = false,
  absenceCancelledAt = null,
}: {
  userId: string;
  status?: string;
  absent?: boolean;
  absenceCancelledAt?: Date | null;
}) => ({ userId, joinedAt: NOW, status, absent, absenceCancelledAt });

const base = {
  id: "game",
  selectionFinishedAt: null,
  rangeEnd: null,
  scheduleMode: SCHEDULE_MODE.coordinate,
  recruitMethod: RECRUIT_METHOD.firstCome,
  drawnAt: null,
  cancelledAt: null,
  cancelKind: null,
  cancelReason: null,
  confirmedAt: null,
  playMinutes: 120,
  endedAt: null,
  attendanceConfirmedAt: null,
  endDate: at(2 * DAY),
  maxPlayers: 4,
  participants: [
    member({ userId: "a" }),
    member({ userId: "b" }),
    member({ userId: "c", status: PARTICIPANT_STATUS.waiting }),
  ],
};

const summary = (patch: Record<string, unknown> = {}) =>
  manageSummary({
    game: { ...base, ...patch } as unknown as GameDetailData,
    responses: 1,
    now: NOW,
  });

const values = (patch: Record<string, unknown>) =>
  summary(patch).stats.map((stat) => `${stat.label} ${stat.value}`);

describe("manageSummary", () => {
  it("취소됨: GM 취소는 사유, 운영진·자동은 정해진 문구", () => {
    const gm = summary({
      cancelledAt: at(-HOUR),
      cancelKind: GAME_CANCEL_KIND.gm,
      cancelReason: "GM 사정",
    });
    expect(gm.stage).toBe(MANAGE_STAGE.cancelled);
    expect(gm.cancelNote).toBe("GM 사정");
    expect(summary({ cancelledAt: at(-HOUR), cancelKind: GAME_CANCEL_KIND.auto }).cancelNote).toBe(
      "운영진이 취소한 구인입니다",
    );
  });

  it("추첨 전: 모집 마감, 신청, 뽑을 인원", () => {
    expect(summary({ recruitMethod: RECRUIT_METHOD.lottery }).stage).toBe(MANAGE_STAGE.beforeDraw);
    expect(values({ recruitMethod: RECRUIT_METHOD.lottery })).toEqual([
      "모집 마감 9월 22일",
      "신청 1명",
      "뽑을 인원 2명",
    ]);
  });

  it("조율 중과 기한 지남", () => {
    expect(summary().stage).toBe(MANAGE_STAGE.coordinating);
    expect(values({})).toEqual([
      "조율 마감 9월 22일",
      "가능 시간 제출 1 / 2명",
      "확정 인원 2 / 4명",
    ]);
    const overdue = summary({ endDate: at(-DAY) });
    expect(overdue.stage).toBe(MANAGE_STAGE.overdue);
    expect(overdue.stats[0]).toMatchObject({ value: "9월 19일 지남", danger: true });
  });

  it("세션 확정은 시작 전, 셋째 칸은 대기", () => {
    expect(summary({ confirmedAt: at(DAY) }).stage).toBe(MANAGE_STAGE.confirmed);
    expect(values({ confirmedAt: at(DAY) })[2]).toBe("대기 1명");
  });

  it("진행 중은 예정 종료 시각을 보인다", () => {
    expect(summary({ confirmedAt: at(-HOUR) }).stage).toBe(MANAGE_STAGE.inProgress);
    expect(values({ confirmedAt: at(-HOUR) })[2]).toBe("예정 종료 13:00");
  });

  it("끝남: 출석 명단에 내보낸 사람을 넣고 운영진이 취소한 불참은 참석으로 센다", () => {
    const ended = {
      confirmedAt: at(-DAY),
      attendanceConfirmedAt: at(-HOUR),
      participants: [
        member({ userId: "a" }),
        member({ userId: "b", absent: true }),
        member({ userId: "c", absent: true, absenceCancelledAt: at(-HOUR) }),
        member({ userId: "d", status: PARTICIPANT_STATUS.removed, absent: true }),
        member({ userId: "e", status: PARTICIPANT_STATUS.waiting }),
      ],
    };
    expect(summary(ended).stage).toBe(MANAGE_STAGE.ended);
    expect(values(ended)[2]).toBe("출석 2 / 4명");
    expect(values({ ...ended, attendanceConfirmedAt: null })[2]).toBe("출석 0 / 4명");
  });

  describe("선발 글", () => {
    const selection = { recruitMethod: RECRUIT_METHOD.selection, scheduleMode: SCHEDULE_MODE.fixed };

    it("선발 전: 배지와 세 칸, 마감 전에는 기한 줄이 없다", () => {
      const result = summary({ ...selection, confirmedAt: at(20 * DAY) });
      expect(result.stage).toBe(MANAGE_STAGE.beforeSelection);
      expect(result.stats.map((stat) => stat.label)).toEqual(["모집 마감", "신청", "확정 인원"]);
      expect(result.deadlineNote).toBeUndefined();
    });

    it("마감 뒤에는 기한 줄이 생기고 기한 1일 전부터 강조한다", () => {
      const closed = { ...selection, confirmedAt: at(20 * DAY), endDate: at(-DAY) };
      expect(summary(closed).deadlineNote).toEqual({
        text: "9월 26일까지 선발을 마쳐 주세요.",
        urgent: false,
      });
      const urgent = summary({ ...closed, endDate: at(-6.5 * DAY) }).deadlineNote;
      expect(urgent).toMatchObject({ text: "9월 21일까지 선발을 마쳐 주세요.", urgent: true });
    });

    it("선발 기한 초과 취소는 고정 사유를 보인다", () => {
      const result = summary({
        ...selection,
        cancelledAt: at(-HOUR),
        cancelKind: GAME_CANCEL_KIND.selectionExpired,
      });
      expect(result.cancelNote).toBe("기한 안에 선발을 마치지 않아 취소되었습니다.");
    });

    it("선발을 마친 뒤에는 선발 전 단계가 아니다", () => {
      const finished = summary({ ...selection, selectionFinishedAt: at(-HOUR) });
      expect(finished.stage).not.toBe(MANAGE_STAGE.beforeSelection);
    });
  });
});
