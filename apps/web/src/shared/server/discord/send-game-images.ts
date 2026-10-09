import type { Game } from "@roll-and-call/database";
import { sendDiscordFile, sendDiscordMessage } from "@roll-and-call/discord";
import { attachRecruitThumbnail, gameUrl } from "@roll-and-call/game-notices";

const SPOILER_FILE_PREFIX = "SPOILER_";

// url이 같은 embed는 디스코드가 갤러리(4장씩)로 묶는다.
// 포럼은 썸네일을 첫 메시지 첨부로 올린다(스포일러는 SPOILER_ 이름). 텍스트 채널은 일반 썸네일을 모집 글 임베드에 싣고, 스포일러만 스레드의 새 메시지로 올린다.
// ponytail: 구인 수정으로 이미지가 바뀌어도 다시 보내지 않는다. 필요해지면 refreshRecruitPost에서 처리.
export async function sendGameImages({
  slug,
  game,
  threadId,
  forum,
}: {
  slug: string;
  game: Game;
  threadId: string;
  forum: boolean;
}) {
  if (forum) await attachRecruitThumbnail({ game, threadId });
  else if (game.thumbnailUrl && game.thumbnailSpoiler) {
    const extension = new URL(game.thumbnailUrl).pathname.match(/\.\w+$/)?.[0] ?? ".jpg";
    await sendDiscordFile({
      channelId: threadId,
      url: game.thumbnailUrl,
      name: `${SPOILER_FILE_PREFIX}thumbnail${extension}`,
    });
  }
  if (game.images.length === 0) return;
  const url = gameUrl({ slug, gameId: game.id }) ?? game.images[0];
  await sendDiscordMessage({
    channelId: threadId,
    input: {
      embeds: game.images.map((image) => ({ url, image: { url: image } })),
    },
  });
}
