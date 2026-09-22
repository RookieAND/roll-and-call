import type { Game } from "@trpg/database";
import { sendDiscordMessage } from "@trpg/discord";

import { gameUrl } from "../game-url";

// url이 같은 embed는 디스코드가 갤러리(4장씩)로 묶는다.
// ponytail: 구인 수정으로 이미지가 바뀌어도 다시 보내지 않는다. 필요해지면 refreshRecruitPost에서 처리.
export async function sendGameImages(game: Game, threadId: string) {
  if (game.images.length === 0) return;
  const url = gameUrl(game.id) ?? game.images[0];
  await sendDiscordMessage(threadId, {
    embeds: game.images.map((image) => ({ url, image: { url: image } })),
  });
}
