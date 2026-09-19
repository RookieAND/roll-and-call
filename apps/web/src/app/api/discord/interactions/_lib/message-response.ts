import type { DiscordInteractionResponse } from "./interaction-types";

const CHANNEL_MESSAGE_WITH_SOURCE = 4;

export function messageResponse(content: string): DiscordInteractionResponse {
  // 유저 이름을 그대로 싣기 때문에 멘션은 전부 막는다.
  return { type: CHANNEL_MESSAGE_WITH_SOURCE, data: { content, allowed_mentions: { parse: [] } } };
}
