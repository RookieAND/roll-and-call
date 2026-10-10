import type { Game } from "@roll-and-call/database";
import { addFileToMessage } from "@roll-and-call/discord";

import { defaultBannerUrl } from "./default-banner-url";

const SPOILER_FILE_PREFIX = "SPOILER_";

// 포럼 모집 글의 첫 메시지에 썸네일을 첨부한다. 스포일러는 파일 이름으로 디스코드가 가린다.
// 썸네일이 없으면 기본 배너를 첨부한다(주소를 알 수 없으면 아무것도 첨부하지 않는다).
export async function attachRecruitThumbnail({ game, threadId }: { game: Game; threadId: string }) {
  const sourceUrl = game.thumbnailUrl ?? defaultBannerUrl();
  if (!sourceUrl) return;
  const extension = new URL(sourceUrl).pathname.match(/\.\w+$/)?.[0] ?? ".jpg";
  const prefix = game.thumbnailUrl && game.thumbnailSpoiler ? SPOILER_FILE_PREFIX : "";
  await addFileToMessage({
    channelId: threadId,
    messageId: threadId,
    url: sourceUrl,
    name: `${prefix}thumbnail${extension}`,
  });
}
