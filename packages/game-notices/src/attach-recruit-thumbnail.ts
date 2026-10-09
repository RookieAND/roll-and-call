import type { Game } from "@roll-and-call/database";
import { addFileToMessage } from "@roll-and-call/discord";

const SPOILER_FILE_PREFIX = "SPOILER_";

// 포럼 모집 글의 첫 메시지에 썸네일을 첨부한다. 스포일러는 파일 이름으로 디스코드가 가린다.
// ponytail: 썸네일을 지운 경우 기존 첨부는 남는다.
export async function attachRecruitThumbnail({ game, threadId }: { game: Game; threadId: string }) {
  if (!game.thumbnailUrl) return;
  const extension = new URL(game.thumbnailUrl).pathname.match(/\.\w+$/)?.[0] ?? ".jpg";
  const prefix = game.thumbnailSpoiler ? SPOILER_FILE_PREFIX : "";
  await addFileToMessage({
    channelId: threadId,
    messageId: threadId,
    url: game.thumbnailUrl,
    name: `${prefix}thumbnail${extension}`,
  });
}
