import { isNull } from "es-toolkit";
import { describe, expect, it, vi } from "vitest";

import { isSessionEnded } from "#/modules/games/model/session-timing";

import { BADGE_ROLE } from "./badge-ladder";
import { countsAsAttended } from "./counts-as-attended";
import { countsForRanking } from "./counts-for-ranking";
import { recordAppearances } from "./record-appearances";
import { isRecordSession, type RecordGame } from "./record-session";

vi.mock("./counts-for-ranking", () => ({ countsForRanking: vi.fn(() => true) }));

const START = new Date("2026-09-10T11:00:00Z");
const HOUR_MS = 3_600_000;
const at = (hours: number) => new Date(START.getTime() + hours * HOUR_MS);

type Participant = RecordGame["participants"][number];

const player = (userId: string, overrides: Partial<Participant> = {}): Participant => ({
  userId,
  status: "confirmed",
  absent: false,
  absenceCancelledAt: null,
  ...overrides,
});

const game = (overrides: Partial<RecordGame> = {}): RecordGame => ({
  id: "g1",
  gmId: "gm",
  confirmedAt: START,
  playMinutes: 120,
  endedAt: null,
  hiddenAt: null,
  cancelledAt: null,
  participants: [player("p1")],
  ...overrides,
});

const isRecord = (target: RecordGame, now: Date) =>
  isRecordSession(
    {
      ...target,
      confirmedCount: target.participants.filter((row) => row.status === "confirmed").length,
    },
    now,
  );

describe("isRecordSession", () => {
  it("시작 시각 없음·숨김·취소·확정자 0명은 기록 세션이 아니다", () => {
    expect(isRecord(game({ confirmedAt: null }), at(10))).toBe(false);
    expect(isRecord(game({ hiddenAt: START }), at(10))).toBe(false);
    expect(isRecord(game({ cancelledAt: START }), at(10))).toBe(false);
    expect(isRecord(game({ participants: [] }), at(10))).toBe(false);
    expect(isRecord(game({ participants: [player("p1", { status: "waiting" })] }), at(10))).toBe(
      false,
    );
  });

  it("확정자가 removed 한 명뿐이면 기록 세션이 아니다", () => {
    expect(isRecord(game({ participants: [player("p1", { status: "removed" })] }), at(10))).toBe(
      false,
    );
  });

  it("ended_at이 없으면 시작 + 플레이타임이 지나야 기록 세션이다", () => {
    expect(isRecord(game(), at(1.9))).toBe(false);
    expect(isRecord(game(), at(2))).toBe(true);
  });

  it("ended_at이 있으면 그 시각이 지난 순간부터 기록 세션이다", () => {
    const early = game({ endedAt: at(0.5) });
    expect(isRecord(early, at(0.4))).toBe(false);
    expect(isRecord(early, at(0.5))).toBe(true);
  });

  it("출석 확인 전에도 기록 세션이다", () => {
    expect(isRecord(game({ participants: [player("p1", { absent: false })] }), at(3))).toBe(true);
  });
});

describe("recordAppearances", () => {
  it("불참·removed는 플레이어 출연에서 빠지고 운영진이 취소한 불참은 들어간다", () => {
    const appearances = recordAppearances(
      [
        game({
          participants: [
            player("present"),
            player("absent", { absent: true }),
            player("forgiven", { absent: true, absenceCancelledAt: at(5) }),
            player("removed", { status: "removed" }),
            player("waiting", { status: "waiting" }),
          ],
        }),
      ],
      at(10),
    );
    expect(appearances).toEqual([
      { userId: "gm", role: BADGE_ROLE.gm, startsAt: START },
      { userId: "present", role: BADGE_ROLE.player, startsAt: START },
      { userId: "forgiven", role: BADGE_ROLE.player, startsAt: START },
    ]);
  });

  it("countsForRanking이 false인 세션은 출연에서 빠진다", () => {
    vi.mocked(countsForRanking).mockReturnValueOnce(false);
    expect(recordAppearances([game()], at(10))).toEqual([]);
  });

  it("바꾸기 전 loadMonthlyAppearances(SQL 거름 + 종료 거름)와 같은 출연을 돌려준다", () => {
    const now = at(10);
    const games = [
      game({ id: "ended" }),
      game({ id: "running", gmId: "gm2", confirmedAt: at(9) }),
      game({
        id: "early",
        endedAt: at(0.5),
        participants: [player("p2"), player("p3", { absent: true })],
      }),
      game({ id: "hidden", hiddenAt: START }),
      game({ id: "cancelled", cancelledAt: START }),
      game({ id: "unscheduled", confirmedAt: null }),
      game({ id: "empty", participants: [player("p4", { status: "waiting" })] }),
    ];
    const hasConfirmed = (target: RecordGame) =>
      target.participants.some((row) => row.status === "confirmed");
    const legacy = games.filter(
      (target) =>
        !isNull(target.confirmedAt) &&
        isNull(target.hiddenAt) &&
        isNull(target.cancelledAt) &&
        hasConfirmed(target) &&
        isSessionEnded(target, now),
    );
    const expected = [
      ...legacy.map((target) => ({ userId: target.gmId, role: BADGE_ROLE.gm, startsAt: START })),
      ...legacy.flatMap((target) =>
        target.participants
          .filter(countsAsAttended)
          .map((row) => ({ userId: row.userId, role: BADGE_ROLE.player, startsAt: START })),
      ),
    ];
    const sortKey = (row: { userId: string; role: string }) => `${row.role}|${row.userId}`;
    const sorted = <Row extends { userId: string; role: string }>(rows: Row[]) =>
      rows.toSorted((left, right) => sortKey(left).localeCompare(sortKey(right)));
    expect(sorted(recordAppearances(games, now))).toEqual(sorted(expected));
  });
});
