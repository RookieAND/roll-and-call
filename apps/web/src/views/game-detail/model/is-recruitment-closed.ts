import { isNil } from "es-toolkit";

import { isApplicationClosed, RECRUIT_METHOD } from "@/entities/game";

import type { ActionGame } from "./game-action-view";

// 비참여자에게 신청 버튼이 닫힌 구인: 신청 닫힘(조율형 일시 확정·일시 지정형 시작), 마감 지남, 추첨 끝남, 대기를 끈 선착순 정원 참.
export function isRecruitmentClosed({
  game,
  confirmedCount,
  now = new Date(),
}: {
  game: Pick<
    ActionGame,
    | "scheduleMode"
    | "confirmedAt"
    | "endDate"
    | "drawnAt"
    | "recruitMethod"
    | "maxPlayers"
    | "waitlistEnabled"
  >;
  confirmedCount: number;
  now?: Date;
}): boolean {
  if (isApplicationClosed(game, now)) return true;
  if (game.endDate.getTime() <= now.getTime() || !isNil(game.drawnAt)) return true;
  const isFirstCome = game.recruitMethod === RECRUIT_METHOD.firstCome;
  return isFirstCome && confirmedCount >= game.maxPlayers && !game.waitlistEnabled;
}
