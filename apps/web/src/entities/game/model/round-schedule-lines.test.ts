import { describe, expect, it } from "vitest";

import { roundScheduleLines, type RoundScheduleRound } from "./round-schedule-lines";

const dated = (
  roundNo: number,
  day: number,
  status: RoundScheduleRound["status"] = "scheduled",
) => ({
  roundNo,
  status,
  startAt: new Date(`2026-11-${String(day).padStart(2, "0")}T12:00:00+09:00`),
  plannedEndAt: new Date(`2026-11-${String(day).padStart(2, "0")}T16:00:00+09:00`),
  coordinationStart: null,
  coordinationEnd: null,
});
const undecided = (roundNo: number): RoundScheduleRound => ({
  roundNo,
  status: "unscheduled",
  startAt: null,
  plannedEndAt: null,
  coordinationStart: null,
  coordinationEnd: null,
});

describe("roundScheduleLines", () => {
  it("끝난 회차는 접고 남은 회차는 한 줄씩 보인다", () => {
    const result = roundScheduleLines([
      dated(1, 7, "finished"),
      dated(2, 14, "finished"),
      dated(3, 21, "in_progress"),
      dated(4, 28),
    ]);
    expect(result.finished).toEqual({
      label: "지난 회차 2개",
      detail: "1회차, 2회차가 끝났습니다.",
    });
    expect(result.lines.map(({ marker, text }) => `${marker} ${text}`)).toEqual([
      "▸ 3회차 · 11월 21일 (토) 오후 12:00~4:00",
      "○ 4회차 · 11월 28일 (토) 오후 12:00~4:00",
    ]);
  });

  it("끝난 회차가 많으면 범위로 줄인다", () => {
    const rounds = [1, 2, 3, 4].map((roundNo) => dated(roundNo, 7, "finished"));
    expect(roundScheduleLines(rounds).finished?.detail).toBe("1~4회차가 끝났습니다.");
  });

  it("정하지 않은 회차는 이어진 만큼 한 줄로 묶는다", () => {
    const result = roundScheduleLines([dated(1, 7), ...[2, 3, 4, 5, 6].map(undecided)]);
    expect(result.finished).toBeNull();
    expect(result.lines.map((line) => line.text)).toEqual([
      "1회차 · 11월 7일 (토) 오후 12:00~4:00",
      "2~6회차 · 한 회차씩 정합니다.",
    ]);
  });

  it("조율 중인 회차는 기간을 보이고 앞뒤 묶음을 가른다", () => {
    const result = roundScheduleLines([
      {
        ...undecided(1),
        status: "coordinating",
        coordinationStart: "2026-10-24",
        coordinationEnd: "2026-11-06",
      },
      undecided(2),
      undecided(3),
    ]);
    expect(result.lines.map((line) => line.text)).toEqual([
      "1회차 · 10월 24일 ~ 11월 6일 중 정합니다",
      "2~3회차 · 한 회차씩 정합니다.",
    ]);
  });

  it("떨어진 미정 회차는 따로 묶는다", () => {
    const result = roundScheduleLines([undecided(1), dated(2, 7), undecided(3)]);
    expect(result.lines.map((line) => line.text)).toEqual([
      "1회차 · 한 회차씩 정합니다.",
      "2회차 · 11월 7일 (토) 오후 12:00~4:00",
      "3회차 · 한 회차씩 정합니다.",
    ]);
  });
});
