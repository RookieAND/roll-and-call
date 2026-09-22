import type { DiscordEmbed } from "@roll-and-call/discord";

import type { DiscordInteractionResponse } from "./interaction-types";

const CHANNEL_MESSAGE_WITH_SOURCE = 4;

export function embedResponse(embed: DiscordEmbed): DiscordInteractionResponse {
  // 유저 이름을 그대로 싣기 때문에 멘션은 전부 막는다.
  return {
    type: CHANNEL_MESSAGE_WITH_SOURCE,
    data: { embeds: [embed], allowed_mentions: { parse: [] } },
  };
}
