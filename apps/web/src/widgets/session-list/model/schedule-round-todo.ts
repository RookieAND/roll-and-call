import { STALE_ROUND_DAYS } from "@roll-and-call/database/games/model";
import { isNil, isNull } from "es-toolkit";

import type { SessionGame } from "@/entities/game";

import { SESSION_ACTION_KIND, type SessionTodo } from "./session-card-model";

const DAY_MS = 86_400_000;
const WARNING_DAYS = 7;

// 조율형 다회차에서 일정 있는 회차가 모두 끝났고 아직 안 정한 회차가 있으면 다음 회차 일정을 잡으라고 한다.
// 자동 마침까지 7일 이하로 남으면 경고로 올린다.
export function scheduleRoundTodo({
  game,
  now,
}: {
  game: SessionGame;
  now: Date;
}): SessionTodo | null {
  const { nextUnscheduledRoundNo, lastRoundEndAt } = game;
  if (
    game.roundScheduleKind !== "coordinated" ||
    game.roundCount < 2 ||
    !isNull(game.finishedAt) ||
    isNil(nextUnscheduledRoundNo) ||
    isNil(lastRoundEndAt)
  ) {
    return null;
  }
  const lastEnd = new Date(lastRoundEndAt).getTime();
  if (lastEnd > now.getTime()) return null;

  // 자동 마침 시각이 지났어도 크론이 마치기 전까지는 1일로 보인다.
  const daysLeft = Math.max(
    1,
    Math.ceil((lastEnd + STALE_ROUND_DAYS * DAY_MS - now.getTime()) / DAY_MS),
  );
  const urgent = daysLeft <= WARNING_DAYS;
  return {
    kind: SESSION_ACTION_KIND.scheduleRound,
    label: `${nextUnscheduledRoundNo}회차 일정을 잡아 주세요`,
    href: `/games/${game.id}/rounds/${nextUnscheduledRoundNo}/schedule`,
    blocked: urgent,
    sortAt: new Date(lastEnd).toISOString(),
    lines: urgent
      ? [game.title, `정하지 않으면 ${daysLeft}일 뒤 자동으로 마칩니다.`]
      : [game.title],
  };
}
