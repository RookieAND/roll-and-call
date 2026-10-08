import type { DiscordInteractionResponse } from "./interaction-types";

const DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 5;
const EPHEMERAL_FLAG = 64;

// 3초 안에 끝나지 않는 일은 먼저 이 응답으로 받아 두고, 끝난 뒤 editOriginalResponse로 결과를 채운다.
export function deferredEphemeralResponse(): DiscordInteractionResponse {
  return { type: DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE, data: { flags: EPHEMERAL_FLAG } };
}
