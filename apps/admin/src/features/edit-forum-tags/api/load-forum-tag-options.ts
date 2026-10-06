import "server-only";
import { DISCORD_CHANNEL_TYPE, getDiscordChannel } from "@roll-and-call/discord";

import type { ForumTagOptions } from "../model/forum-tag-form";

export async function loadForumTagOptions(
  recruitChannelId: string | null,
): Promise<ForumTagOptions> {
  if (!recruitChannelId) return { status: "notForum" };
  const channel = await getDiscordChannel(recruitChannelId);
  if (!channel) return { status: "unreachable" };
  if (channel.type !== DISCORD_CHANNEL_TYPE.forum) return { status: "notForum" };
  return { status: "forum", tags: channel.availableTags };
}
