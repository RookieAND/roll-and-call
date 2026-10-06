import "server-only";
import { DISCORD_CHANNEL_TYPE, getDiscordChannel } from "@roll-and-call/discord";

// 모집 채널이 포럼이면 구인 개설 글이 평문으로, 텍스트 채널이면 임베드로 나간다. 못 읽으면 텍스트 채널로 본다.
export async function loadRecruitForum(recruitChannelId: string | null) {
  if (!recruitChannelId) return false;
  const channel = await getDiscordChannel(recruitChannelId);
  return channel?.type === DISCORD_CHANNEL_TYPE.forum;
}
