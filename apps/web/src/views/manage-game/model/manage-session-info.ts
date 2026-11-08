import type { GameDetailData } from "@roll-and-call/database/games";
import { isNil } from "es-toolkit";

import { GAME_VISIBILITY, isSessionStarted } from "@/entities/game";
import { reviewWriteDeadline } from "@/entities/review";
import { formatDate } from "@/shared/lib";

export type ManageSessionInfo = {
  kindLabel: string;
  review: { count: number; deadlineLabel: string } | null;
};

export function manageSessionInfo({
  game,
  reviewCount,
  now = new Date(),
}: {
  game: GameDetailData;
  reviewCount: number;
  now?: Date;
}): ManageSessionInfo {
  const kindLabel = game.visibility === GAME_VISIBILITY.private ? "지정 구인" : "공개 구인";
  const deadline =
    isNil(game.cancelledAt) && isSessionStarted(game, now) ? reviewWriteDeadline(game) : null;
  if (!deadline) return { kindLabel, review: null };
  const open = deadline.getTime() > now.getTime();
  return {
    kindLabel,
    review: { count: reviewCount, deadlineLabel: open ? formatDate(deadline) : "마감됨" },
  };
}
