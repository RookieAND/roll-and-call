import { isSessionStarted } from "@roll-and-call/database/games/model";
import { isNil } from "es-toolkit";

export const CALENDAR_VIEWER_ROLE = {
  gm: "gm",
  confirmed: "confirmed",
  other: "other",
} as const;
export type CalendarViewerRole = (typeof CALENDAR_VIEWER_ROLE)[keyof typeof CALENDAR_VIEWER_ROLE];

// 세션 시각이 정해진 뒤부터 시작 전까지, GM과 확정 참여자만 개인 캘린더에 넣는다(D268).
export function canAddToCalendar({
  game,
  viewerRole,
  now = new Date(),
}: {
  game: { cancelledAt: Date | null; confirmedAt: Date | null };
  viewerRole: CalendarViewerRole;
  now?: Date;
}): boolean {
  if (viewerRole === CALENDAR_VIEWER_ROLE.other) return false;
  if (!isNil(game.cancelledAt) || isNil(game.confirmedAt)) return false;
  return !isSessionStarted(game, now);
}
