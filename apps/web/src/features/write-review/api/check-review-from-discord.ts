import "server-only";
import { getUserIdByDiscordId } from "@roll-and-call/database/profiles";
import { getActiveMembership, getServerByGuildId } from "@roll-and-call/database/servers";

import { getReviewDraftTarget } from "@/shared/server";

import {
  DISCORD_REVIEW_REFUSAL,
  DISCORD_REVIEW_REFUSAL_MESSAGE,
} from "../model/discord-review-refusal";
import { discordReviewRefusalOf } from "../model/discord-review-refusal-of";

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
  if (!server) return DISCORD_REVIEW_REFUSAL_MESSAGE[DISCORD_REVIEW_REFUSAL.serverNotFound];

  const userId = await getUserIdByDiscordId(discordId);
  if (!userId) return DISCORD_REVIEW_REFUSAL_MESSAGE[DISCORD_REVIEW_REFUSAL.notRegistered];
  const membership = await getActiveMembership({ serverId: server.id, userId });
  if (!membership) return DISCORD_REVIEW_REFUSAL_MESSAGE[DISCORD_REVIEW_REFUSAL.notServerMember];

  const target = await getReviewDraftTarget({ serverId: server.id, gameId, userId });
  const refusal = discordReviewRefusalOf(target);
  return refusal ? DISCORD_REVIEW_REFUSAL_MESSAGE[refusal] : null;
}
