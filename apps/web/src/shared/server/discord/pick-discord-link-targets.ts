import { listRichTextChipLinks, parseDiscordChannelLink } from "@roll-and-call/tiptap/links";

// 글 하나에서 채널명을 가져올 서로 다른 채널의 최대 개수. 넘는 링크는 기본 라벨로 둔다.
export const DISCORD_LINK_LOOKUP_LIMIT = 5;

export interface DiscordLinkTarget {
  href: string;
  channelId: string;
}

// 이름을 가져올 링크만 고른다. 이 서버의 채널만 대상이고, 다른 서버 채널은 봇이 들어 있지 않아 조회할 수 없다.
export function pickDiscordLinkTargets({
  notice,
  guildId,
  limit = DISCORD_LINK_LOOKUP_LIMIT,
}: {
  notice: string;
  guildId: string;
  limit?: number;
}): DiscordLinkTarget[] {
  const targets: DiscordLinkTarget[] = [];
  const channelIds = new Set<string>();

  for (const href of listRichTextChipLinks(notice)) {
    const link = parseDiscordChannelLink(href);
    if (!link || link.guildId !== guildId) continue;
    if (!channelIds.has(link.channelId) && channelIds.size >= limit) continue;
    channelIds.add(link.channelId);
    targets.push({ href, channelId: link.channelId });
  }
  return targets;
}
