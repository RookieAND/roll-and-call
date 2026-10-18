import type { Server } from "@roll-and-call/database";
import { DISCORD_CHANNEL_TYPE, getDiscordChannel } from "@roll-and-call/discord";

import { resolveRecruitTags, type RecruitTags } from "./resolve-recruit-tags";

export type RecruitTarget = { tags: RecruitTags };

// 모집 채널은 포럼만 지원한다. 채널이 없거나 포럼이 아니거나 읽지 못하면 undefined라, 부르는 쪽이 모집 글을 올리지 않는다.
// 포럼인지는 올릴 때마다 읽어 태그 구성이 바뀌어도 설정을 따로 고칠 필요가 없다.
export async function loadRecruitTarget(server: Server): Promise<RecruitTarget | undefined> {
  if (!server.recruitChannelId) return undefined;
  const channel = await getDiscordChannel(server.recruitChannelId);
  if (channel?.type !== DISCORD_CHANNEL_TYPE.forum) return undefined;
  return {
    tags: resolveRecruitTags({ saved: server.forumTags, available: channel.availableTags }),
  };
}
