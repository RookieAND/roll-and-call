import { formatDateWeekday } from "@roll-and-call/app-kit/date";
import { isNil } from "es-toolkit";

import type { GameRepeatRule } from "#db/schema";

import { clockTextLabel } from "./clock-text-label";

const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"] as const;
const REPEAT_WORD: Record<number, string> = { 1: "매주", 2: "격주" };

// 다회차 모집 공지·디스코드 신청 모달의 일정 한 줄. 한 번이면 null이다.
//   지정형 반복 「총 6회 · 매주 토 오후 12:00~4:00」
//   지정형 그 밖 「총 6회 · 첫 회 10월 24일 (토)」
//   조율형 「총 6회 · 회차마다 일정을 정합니다」
export function multiRoundNoticeLine(game: {
  roundCount: number;
  roundScheduleKind: "designated" | "coordinated";
  repeatRule: GameRepeatRule | null;
  confirmedAt: Date | string | null;
}): string | null {
  if (game.roundCount <= 1) return null;
  const total = `총 ${game.roundCount}회`;
  if (game.roundScheduleKind === "coordinated") return `${total} · 회차마다 일정을 정합니다`;
  const rule = game.repeatRule;
  const repeat = rule ? REPEAT_WORD[rule.intervalWeeks] : undefined;
  if (rule && repeat) {
    const startLabel = clockTextLabel(rule.startTime);
    const endLabel = clockTextLabel(rule.endTime);
    const sameMeridiem = startLabel.slice(0, 2) === endLabel.slice(0, 2);
    const range = `${startLabel}~${sameMeridiem ? endLabel.slice(3) : endLabel}`;
    return `${total} · ${repeat} ${WEEKDAY[rule.weekday]} ${range}`;
  }
  if (isNil(game.confirmedAt)) return total;
  return `${total} · 첫 회 ${formatDateWeekday(game.confirmedAt)}`;
}
