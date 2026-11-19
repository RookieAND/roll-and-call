import type { GameRoundRow } from "@roll-and-call/database/games";
import { isNil } from "es-toolkit";

import { toKst } from "@/shared/lib";

import type { ManageStat } from "./manage-summary";

const NO_BREAK_SPACE = " ";
const KEPT_LABELS = ["확정 인원", "대기"];

// 다회차 요약 카드의 통계. 단발의 「세션 일시」는 1회차 일시라서 다음 회차 일시로 바꾼다.
export function multiRoundStats({
  stats,
  rounds,
  now,
}: {
  stats: readonly ManageStat[];
  rounds: readonly GameRoundRow[];
  now: Date;
}): ManageStat[] {
  const next = rounds.find((round) => !isNil(round.startAt) && round.startAt > now);
  const start = next?.startAt ? toKst(next.startAt) : null;
  const nextStat: ManageStat = {
    label: "다음 회차",
    value: start
      ? `${start.format("M월 D일 (dd)").replaceAll(" ", NO_BREAK_SPACE)} ${start.format("HH:mm")}`
      : "미정",
    wrap: true,
  };
  return [nextStat, ...stats.filter((stat) => KEPT_LABELS.includes(stat.label))];
}
