import { isEqual, pick } from "es-toolkit";

import type { LockedGame } from "./edit-block-reason";
import type { toGameColumns } from "./to-game-columns";

const LOCKED_KEYS = [
  "title",
  "kind",
  "playType",
  "playMinutesMin",
  "playMinutes",
  "genres",
  "triggers",
  "platforms",
  "aiImage",
  "adultOnly",
  "maxPlayers",
  "minPlayers",
  "recruitMethod",
  "waitlistEnabled",
  "applicationNoteEnabled",
  "applicationQuestion",
  "minRulePlays",
  "requireRulebookCert",
] as const;

// 진행 중인 다회차에서 고칠 수 있는 칸(주의 사항, 시놉시스, 이미지)을 뺀 나머지가 달라졌는지 본다.
export function inProgressLockedChange(
  game: LockedGame,
  columns: ReturnType<typeof toGameColumns>,
): boolean {
  // 폼은 플레이타임 최대가 비면 최소로 채워 저장한다.
  const saved = {
    ...pick(game, LOCKED_KEYS),
    playMinutes: game.playMinutes ?? game.playMinutesMin,
  };
  return (
    !isEqual(saved, pick(columns, LOCKED_KEYS)) ||
    game.endDate.getTime() !== columns.endDate.getTime()
  );
}
