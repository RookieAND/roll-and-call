import type { Game } from "@roll-and-call/database";
import type { DiscordEmbedField } from "@roll-and-call/discord";

import { deriveGameStatus, gameStatusLabel } from "@/shared/lib";

// 웹 배지와 같은 규칙으로 상태를 적는다. 대기가 0명이어도 칸을 남겨 알림마다 줄 모양이 같다.
export function headcountFields(
  game: Pick<Game, "maxPlayers" | "endDate" | "waitlistEnabled">,
  confirmedCount: number,
  waitingCount: number,
): DiscordEmbedField[] {
  const status = deriveGameStatus({ ...game, participantCount: confirmedCount });
  return [
    { name: "📌 상태", value: gameStatusLabel[status], inline: true },
    { name: "👥 인원", value: `${confirmedCount}/${game.maxPlayers}명`, inline: true },
    { name: "⏳ 대기", value: `${waitingCount}명`, inline: true },
  ];
}
