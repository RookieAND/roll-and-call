import type { Server } from "@roll-and-call/database";
import { DISCORD_CHANNEL_TYPE, getDiscordChannel } from "@roll-and-call/discord";

import { resolveRecruitTags, type RecruitTags } from "./resolve-recruit-tags";

export type RecruitTarget = { forum: boolean; tags: RecruitTags };

// 모집 채널이 포럼인지는 올릴 때마다 읽는다. 서버가 채널을 포럼으로 옮겨도 설정을 따로 고칠 필요가 없다.
export async function loadRecruitTarget(server: Server): Promise<RecruitTarget> {
  const channel = server.recruitChannelId
    ? await getDiscordChannel(server.recruitChannelId)
    : undefined;
  const forum = channel?.type === DISCORD_CHANNEL_TYPE.forum;
  const available = forum ? channel.availableTags : [];
  return { forum, tags: resolveRecruitTags({ saved: server.forumTags, available }) };
}

// 포럼 게시글의 첫 메시지는 게시글 안에 있고, 텍스트 채널의 모집 메시지는 모집 채널에 있다.
export function recruitMessageChannelId({
  server,
  target,
  threadId,
}: {
  server: Server;
  target: RecruitTarget;
  threadId: string;
}) {
  return target.forum ? threadId : server.recruitChannelId;
}
