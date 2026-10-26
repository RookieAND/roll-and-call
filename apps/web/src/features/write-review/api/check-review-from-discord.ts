import "server-only";
import { getUserIdByDiscordId } from "@roll-and-call/database/profiles";
import { getReviewDraftTarget } from "@roll-and-call/database/reviews";
import { getActiveMembership, getServerByGuildId } from "@roll-and-call/database/servers";

import { serverPath } from "@/shared/lib";
import { siteOrigin } from "@/shared/server";

import {
  DISCORD_REVIEW_REFUSAL,
  DISCORD_REVIEW_REFUSAL_MESSAGE,
} from "../model/discord-review-refusal";
import { discordReviewRefusalOf } from "../model/discord-review-refusal-of";

export interface DiscordReviewBlock {
  message: string;
  // 웹 후기 작성 화면 주소. GM이거나 이미 후기를 쓴 사람에게만 붙인다.
  webUrl: string | null;
}

const WEB_LINK_REFUSALS: readonly string[] = [
  DISCORD_REVIEW_REFUSAL.gmOnWeb,
  DISCORD_REVIEW_REFUSAL.alreadyWritten,
];

// 후기 버튼을 눌렀을 때 모달을 열기 전에 거르는 검사. 막히면 이유를, 쓸 수 있으면 null을 준다. 제출 때도 write-review-from-discord가 다시 검사한다.
export async function checkReviewFromDiscord({
  guildId,
  discordId,
  gameId,
}: {
  guildId: string;
  discordId: string;
  gameId: string;
}): Promise<DiscordReviewBlock | null> {
  const blocked = (
    refusal: keyof typeof DISCORD_REVIEW_REFUSAL_MESSAGE,
    webUrl: string | null = null,
  ): DiscordReviewBlock => ({
    message: DISCORD_REVIEW_REFUSAL_MESSAGE[refusal],
    webUrl,
  });
  const server = await getServerByGuildId(guildId);
  if (!server) return blocked(DISCORD_REVIEW_REFUSAL.serverNotFound);

  const userId = await getUserIdByDiscordId(discordId);
  if (!userId) return blocked(DISCORD_REVIEW_REFUSAL.notRegistered);
  const membership = await getActiveMembership({ serverId: server.id, userId });
  if (!membership) return blocked(DISCORD_REVIEW_REFUSAL.notServerMember);

  const target = await getReviewDraftTarget({ serverId: server.id, gameId, userId });
  const refusal = discordReviewRefusalOf(target);
  if (!refusal) return null;
  const origin = siteOrigin();
  const webUrl =
    origin && WEB_LINK_REFUSALS.includes(refusal)
      ? `${origin}${serverPath({ slug: server.slug, path: `/games/${gameId}/review` })}`
      : null;
  return blocked(refusal, webUrl);
}
