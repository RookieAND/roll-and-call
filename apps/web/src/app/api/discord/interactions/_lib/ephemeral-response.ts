import type { DiscordInteractionResponse } from "./interaction-types";

const CHANNEL_MESSAGE_WITH_SOURCE = 4;
const EPHEMERAL_FLAG = 64;

// 누른 사람에게만 보이는 답. 신청 결과는 채널에 남기지 않는다.
export function ephemeralResponse(content: string): DiscordInteractionResponse {
  return {
    type: CHANNEL_MESSAGE_WITH_SOURCE,
    data: { content, flags: EPHEMERAL_FLAG, allowed_mentions: { parse: [] } },
  };
}
