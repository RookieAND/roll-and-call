import type { Game } from "@roll-and-call/database";
import { sendDiscordMessage } from "@roll-and-call/discord";
import { attachRecruitThumbnail, gameUrl } from "@roll-and-call/game-notices";

// 썸네일은 첫 메시지 첨부로 올리고(스포일러는 SPOILER_ 이름), 추가 이미지는 같은 url의 임베드로 묶어 스레드에 보낸다.
// url이 같은 embed는 디스코드가 갤러리(4장씩)로 묶는다.
// ponytail: 구인 수정으로 이미지가 바뀌어도 다시 보내지 않는다. 필요해지면 refreshRecruitPost에서 처리.
export async function sendGameImages({
  slug,
  game,
  threadId,
}: {
  slug: string;
  game: Game;
  threadId: string;
}) {
  await attachRecruitThumbnail({ game, threadId });
  if (game.images.length === 0) return;
  const url = gameUrl({ slug, gameId: game.id }) ?? game.images[0];
  await sendDiscordMessage({
    channelId: threadId,
    input: {
      embeds: game.images.map((image) => ({ url, image: { url: image } })),
    },
  });
}
