import { findPublicChannelName } from "./find-public-channel-name";
import { getGuildChannels } from "./get-guild-channels";
import { getGuildRoles } from "./get-guild-roles";

// 채널 id → 이름. 공개 채널만 담고, 조회에 실패한 채널은 빠진다(호출하는 쪽은 기본 라벨로 둔다).
// 서버 단위 호출 둘(역할·채널 목록)에 스레드마다 한 번이 들므로 id 개수는 호출하는 쪽이 줄여서 넘긴다.
export async function resolvePublicChannelNames({
  guildId,
  channelIds,
}: {
  guildId: string;
  channelIds: string[];
}): Promise<Record<string, string>> {
  if (channelIds.length === 0) return {};

  try {
    const [roles, channels] = await Promise.all([
      getGuildRoles({ guildId }),
      getGuildChannels({ guildId }),
    ]);
    const channelById = new Map(channels.map((channel) => [channel.id, channel]));
    const names: Record<string, string> = {};
    await Promise.all(
      channelIds.map(async (channelId) => {
        try {
          const name = await findPublicChannelName({ guildId, roles, channelById, channelId });
          if (name) names[channelId] = name;
        } catch (error) {
          console.warn("Discord channel name fetch failed:", error);
        }
      }),
    );
    return names;
  } catch (error) {
    console.warn("Discord guild fetch failed:", error);
    return {};
  }
}
