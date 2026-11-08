import { plannedEndAt, type SessionGame } from "@/entities/game";
import { formatMonthDay, toKst } from "@/shared/lib";

import type { SessionFacts } from "./derive-session-facts";

const CLOCK_FORMAT = "HH:mm";

export function inProgressSchedule({ game, facts }: { game: SessionGame; facts: SessionFacts }) {
  const day = facts.sessionAgo === "오늘" ? "오늘" : formatMonthDay(game.confirmedAt!);
  const start = toKst(game.confirmedAt!).format(CLOCK_FORMAT);
  const end = toKst(plannedEndAt(game)!).format(CLOCK_FORMAT);
  return `${day} ${start} 시작 · ${end} 종료 예정`;
}
