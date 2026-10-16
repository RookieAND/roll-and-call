import type { Game } from "@roll-and-call/database";
import { createFileMessage } from "@roll-and-call/discord";
import { attachRecruitThumbnail } from "@roll-and-call/game-notices";
import { chunk } from "es-toolkit";

// 디스코드는 메시지 하나에 파일을 10개까지 받는다.
const FILES_PER_MESSAGE = 10;

// 썸네일은 첫 메시지 첨부로 올리고(스포일러는 SPOILER_ 이름), 추가 이미지는 파일로 첨부한 메시지로 스레드에 보낸다.
// 외부 이미지 임베드는 디스코드가 크기를 못 읽으면 빈 메시지로 보여서 파일로 올린다.
// ponytail: 구인 수정으로 이미지가 바뀌어도 다시 보내지 않는다. 필요해지면 refreshRecruitPost에서 처리.
export async function sendGameImages({ game, threadId }: { game: Game; threadId: string }) {
  await attachRecruitThumbnail({ game, threadId });
  const files = (
    await Promise.all(
      game.images.map(async (image, index) => {
        try {
          const response = await fetch(image, { signal: AbortSignal.timeout(15000) });
          if (!response.ok) throw new Error(`image fetch ${response.status}`);
          const extension = new URL(image).pathname.match(/\.\w+$/)?.[0] ?? ".jpg";
          return { name: `image-${index + 1}${extension}`, blob: await response.blob() };
        } catch (error) {
          console.error("Discord game image fetch failed:", { threadId, image }, error);
        }
      }),
    )
  ).filter((file) => file !== undefined);
  for (const group of chunk(files, FILES_PER_MESSAGE))
    await createFileMessage({ channelId: threadId, content: "", files: group });
}
