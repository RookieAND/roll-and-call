import type { Game } from "@roll-and-call/database";

import { ROUND_REPEAT, type RoundRepeat } from "@/entities/game";

const REPEAT_OF_WEEKS: Record<number, RoundRepeat> = {
  1: ROUND_REPEAT.weekly,
  2: ROUND_REPEAT.biweekly,
};

// 저장된 반복 규칙이 없거나 매주·격주가 아니면 직접 입력이다.
export function roundRepeatOf(repeatRule: Game["repeatRule"] | undefined): RoundRepeat {
  return (repeatRule && REPEAT_OF_WEEKS[repeatRule.intervalWeeks]) || ROUND_REPEAT.custom;
}
