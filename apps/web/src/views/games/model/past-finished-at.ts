import { isNil } from "es-toolkit";

import { sessionEndAt } from "@/entities/game";

type FinishedGame = Parameters<typeof sessionEndAt>[0] & {
  cancelledAt: Date | null;
  endDate: Date;
};

// 지난 구인의 끝난 날짜: 취소한 날, 세션 종료, 모집 마감 순으로 본다(서버 정렬 finishedAt과 같다).
export function pastFinishedAt(game: FinishedGame): Date {
  if (!isNil(game.cancelledAt)) return game.cancelledAt;
  return sessionEndAt(game) ?? game.endDate;
}
