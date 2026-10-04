import { isNil } from "es-toolkit";

import { UNDO_END_SESSION_SECONDS } from "./end-session-block";

type Moment = Date | string | null;

export const UNDO_END_SESSION_BLOCK = {
  notGm: "notGm",
  notEnded: "notEnded",
  attendanceConfirmed: "attendanceConfirmed",
  windowOver: "windowOver",
} as const;

export type UndoEndSessionBlock =
  (typeof UNDO_END_SESSION_BLOCK)[keyof typeof UNDO_END_SESSION_BLOCK];

// 마친 직후 토스트 되돌리기만 받는다. 세션을 다시 여는 길은 따로 없다(D216).
export function undoEndSessionBlock({
  game,
  actorId,
  now,
}: {
  game: { gmId: string; endedAt: Moment; attendanceConfirmedAt: Moment };
  actorId: string;
  now: Date;
}): UndoEndSessionBlock | null {
  if (game.gmId !== actorId) return UNDO_END_SESSION_BLOCK.notGm;
  if (isNil(game.endedAt)) return UNDO_END_SESSION_BLOCK.notEnded;
  if (!isNil(game.attendanceConfirmedAt)) return UNDO_END_SESSION_BLOCK.attendanceConfirmed;
  const elapsed = now.getTime() - new Date(game.endedAt).getTime();
  if (elapsed > UNDO_END_SESSION_SECONDS * 1000) return UNDO_END_SESSION_BLOCK.windowOver;
  return null;
}
