import { describe, expect, it } from "vitest";

import { pickDiscordLinkTargets } from "./pick-discord-link-targets";

const GUILD_ID = "100";

function noticeOf(...hrefs: string[]) {
  return JSON.stringify({
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: hrefs.map((href) => ({
          type: "text",
          text: href,
          marks: [{ type: "link", attrs: { href } }],
        })),
      },
    ],
  });
}

const channelUrl = (channelId: string, messageId?: string) =>
  `https://discord.com/channels/${GUILD_ID}/${channelId}${messageId ? `/${messageId}` : ""}`;

describe("pickDiscordLinkTargets", () => {
  it("이 서버의 채널 링크만 고른다", () => {
    const notice = noticeOf(channelUrl("1"), "https://discord.com/channels/999/2");
    expect(pickDiscordLinkTargets({ notice, guildId: GUILD_ID })).toEqual([
      { href: channelUrl("1"), channelId: "1" },
    ]);
  });

  it("같은 채널의 다른 메시지 링크는 채널 한 개로 세고 모두 담는다", () => {
    const notice = noticeOf(channelUrl("1", "10"), channelUrl("1", "11"));
    const targets = pickDiscordLinkTargets({ notice, guildId: GUILD_ID, limit: 1 });
    expect(targets.map((target) => target.href)).toEqual([
      channelUrl("1", "10"),
      channelUrl("1", "11"),
    ]);
  });

  it("서로 다른 채널은 한도까지만 담는다", () => {
    const notice = noticeOf(channelUrl("1"), channelUrl("2"), channelUrl("3"));
    const targets = pickDiscordLinkTargets({ notice, guildId: GUILD_ID, limit: 2 });
    expect(targets.map((target) => target.channelId)).toEqual(["1", "2"]);
  });

  it("디스코드 링크가 없으면 빈 목록이다", () => {
    expect(
      pickDiscordLinkTargets({ notice: noticeOf("https://notion.so/a"), guildId: GUILD_ID }),
    ).toEqual([]);
    expect(pickDiscordLinkTargets({ notice: "평문 주의 사항", guildId: GUILD_ID })).toEqual([]);
  });
});
