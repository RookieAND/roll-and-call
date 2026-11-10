import type { Game } from "@roll-and-call/database";
import {
  deriveGameStatus,
  formatPlayRange,
  GAME_VISIBILITY,
  isSessionEnded,
  type GameStatus,
} from "@roll-and-call/database/games/model";
import { compact, isNil } from "es-toolkit";

import { formatDate, OG_IMAGE } from "@/shared/lib";

import { countConfirmed, type ParticipantStatus } from "./participant";
import { scheduleLine } from "./schedule-line";

type PastGame = Game & { participants: { userId: string; status: ParticipantStatus }[] };

export interface PastGameCardView {
  // 회색 배지 글자. null이면 구인 상태 배지(status)를 그린다.
  grayBadge: "취소됨" | "종료" | null;
  status: GameStatus;
  meta: string;
  isPrivate: boolean;
  schedule: string;
  confirmedCount: number;
  // null이면 스포일러라 회색 빈 칸을 그린다.
  thumbnailUrl: string | null;
}

// 취소를 세션 종료보다 먼저 본다(취소된 구인에 「종료」를 붙이지 않는다). 썸네일이 없으면 공유 미리보기 기본 이미지(D61).
export function pastGameCardView(game: PastGame, now: Date = new Date()): PastGameCardView {
  const count = countConfirmed(game.participants);
  const isPrivate = game.visibility === GAME_VISIBILITY.private;
  const status = deriveGameStatus({
    maxPlayers: game.maxPlayers,
    endDate: game.endDate,
    participantCount: count,
    waitlistEnabled: game.waitlistEnabled,
    scheduleMode: game.scheduleMode,
    confirmedAt: game.confirmedAt,
    cancelledAt: game.cancelledAt,
  });
  const thumbnailUrl = game.thumbnailSpoiler ? null : (game.thumbnailUrl ?? OG_IMAGE.url);
  const meta = compact([game.rule, formatPlayRange(game.playMinutesMin, game.playMinutes)]).join(
    " · ",
  );

  if (!isNil(game.cancelledAt)) {
    return {
      grayBadge: "취소됨",
      status,
      meta,
      schedule: `${formatDate(game.cancelledAt)} 취소`,
      confirmedCount: count,
      isPrivate,
      thumbnailUrl,
    };
  }

  const when = game.confirmedAt ? scheduleLine(game, now).text : `${formatDate(game.endDate)} 마감`;
  return {
    grayBadge: isSessionEnded(game, now) ? "종료" : null,
    status,
    meta,
    schedule: when,
    confirmedCount: count,
    isPrivate,
    thumbnailUrl,
  };
}
