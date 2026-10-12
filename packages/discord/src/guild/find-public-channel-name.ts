import { DISCORD_CHANNEL_TYPE } from "../permission/discord-permission";
import { isEveryoneViewable } from "../permission/is-everyone-viewable";
import { getChannelSummary } from "./get-channel-summary";
import type { DiscordGuildChannel } from "./get-guild-channels";
import type { DiscordRole } from "./get-guild-roles";

const NAMED_CHANNEL_TYPES: number[] = [
  DISCORD_CHANNEL_TYPE.text,
  DISCORD_CHANNEL_TYPE.voice,
  DISCORD_CHANNEL_TYPE.announcement,
  DISCORD_CHANNEL_TYPE.forum,
];

// 서버 누구나 볼 수 있는 채널일 때만 이름을 돌려준다. 비공개 채널의 이름이 글을 읽는 모두에게 새면 안 된다.
// 스레드(포럼 글 포함)는 채널 목록에 없고 부모 채널의 공개 여부를 따른다. 비공개 스레드는 이름을 가져오지 않는다.
export async function findPublicChannelName({
  guildId,
  roles,
  channelById,
  channelId,
}: {
  guildId: string;
  roles: DiscordRole[];
  channelById: Map<string, DiscordGuildChannel>;
  channelId: string;
}): Promise<string | undefined> {
  const listed = channelById.get(channelId);
  if (listed) {
    const isNamed = NAMED_CHANNEL_TYPES.includes(listed.type);
    return isNamed && isEveryoneViewable({ guildId, roles, channel: listed })
      ? listed.name
      : undefined;
  }

  const thread = await getChannelSummary({ channelId });
  if (thread.guildId !== guildId || thread.type !== DISCORD_CHANNEL_TYPE.publicThread)
    return undefined;
  const parent = thread.parentId ? channelById.get(thread.parentId) : undefined;
  if (!thread.name || !parent) return undefined;
  return isEveryoneViewable({ guildId, roles, channel: parent }) ? thread.name : undefined;
}
