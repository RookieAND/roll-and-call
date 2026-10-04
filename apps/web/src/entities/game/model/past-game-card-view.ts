import {
  deriveGameStatus,
  isSessionEnded,
  type GameStatus,
} from "@roll-and-call/database/games/model";
import { compact, isNil } from "es-toolkit";

import { formatDate, OG_IMAGE } from "@/shared/lib";
import type { Game } from "@/shared/server";

import { countConfirmed, type ParticipantStatus } from "./participant";

type PastGame = Game & { participants: { userId: string; status: ParticipantStatus }[] };

export interface PastGameCardView {
  // 회색 배지 글자. null이면 구인 상태 배지(status)를 그린다.
  grayBadge: "취소됨" | "종료" | null;
  status: GameStatus;
  meta: string;
  // null이면 스포일러라 회색 빈 칸을 그린다.
  thumbnailUrl: string | null;
}

// 취소를 세션 종료보다 먼저 본다(취소된 구인에 「종료」를 붙이지 않는다). 썸네일이 없으면 공유 미리보기 기본 이미지(D61).
export function pastGameCardView(game: PastGame, now: Date = new Date()): PastGameCardView {
  const count = countConfirmed(game.participants);
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

  if (!isNil(game.cancelledAt)) {
    return {
      grayBadge: "취소됨",
      status,
      meta: compact([game.rule, `${formatDate(game.cancelledAt)} 취소`]).join(" · "),
      thumbnailUrl,
    };
  }

  const when = game.confirmedAt
    ? `${formatDate(game.confirmedAt)} 세션 · ${count}명`
    : `${formatDate(game.endDate)} 마감`;
  return {
    grayBadge: isSessionEnded(game, now) ? "종료" : null,
    status,
    meta: compact([game.rule, when]).join(" · "),
    thumbnailUrl,
  };
}
