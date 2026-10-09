import "server-only";
import { getUserIdByDiscordId } from "@roll-and-call/database/profiles";
import { getActiveMembership, getServerByGuildId } from "@roll-and-call/database/servers";

import { getReviewDraftTarget } from "@/shared/server";

import { blockMessage } from "../model/block-message";
import { REVIEW_BLOCK } from "../model/review-block";
import { reviewBlockOf } from "../model/review-block-of";

// 후기 버튼을 눌렀을 때 모달을 열기 전에 거르는 검사. 막히면 이유를, 쓸 수 있으면 null을 준다. 제출 때도 write-review-from-discord가 다시 검사한다.
export async function checkReviewFromDiscord({
  guildId,
  discordId,
  gameId,
}: {
  guildId: string;
  discordId: string;
  gameId: string;
}): Promise<string | null> {
  const server = await getServerByGuildId(guildId);
  if (!server) return "이 서버에서는 후기를 쓸 수 없습니다.";

  const userId = await getUserIdByDiscordId(discordId);
  const membership = userId && (await getActiveMembership({ serverId: server.id, userId }));
  if (!userId || !membership) return "아직 가입하지 않았습니다. 가입한 뒤 후기를 써 주세요.";

  const target = await getReviewDraftTarget({ serverId: server.id, gameId, userId });
  if (!target) return blockMessage(REVIEW_BLOCK.unavailable);
  if (target.review) return blockMessage(REVIEW_BLOCK.alreadyWritten);
  const block = reviewBlockOf(target);
  return block ? blockMessage(block) : null;
}
