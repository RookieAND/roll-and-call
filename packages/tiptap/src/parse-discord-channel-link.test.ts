import { describe, expect, it } from "vitest";

import { parseDiscordChannelLink } from "./parse-discord-channel-link";

describe("parseDiscordChannelLink", () => {
  it("채널 링크에서 서버 id와 채널 id를 꺼낸다", () => {
    expect(parseDiscordChannelLink("https://discord.com/channels/111/222")).toEqual({
      guildId: "111",
      channelId: "222",
    });
  });

  it("메시지 링크도 채널로 본다", () => {
    expect(parseDiscordChannelLink("https://discordapp.com/channels/111/222/333")).toEqual({
      guildId: "111",
      channelId: "222",
    });
  });

  it("ptb·canary 주소를 받는다", () => {
    expect(parseDiscordChannelLink("https://ptb.discord.com/channels/1/2")).toBeDefined();
    expect(parseDiscordChannelLink("https://canary.discord.com/channels/1/2")).toBeDefined();
  });

  it("DM 링크와 채널 경로가 아닌 주소는 버린다", () => {
    expect(parseDiscordChannelLink("https://discord.com/channels/@me/222")).toBeUndefined();
    expect(parseDiscordChannelLink("https://discord.com/invite/abc")).toBeUndefined();
  });

  it("호스트가 비슷한 다른 주소와 http(s) 아닌 주소는 버린다", () => {
    expect(parseDiscordChannelLink("https://discord.com.evil.com/channels/1/2")).toBeUndefined();
    expect(parseDiscordChannelLink("https://evil.com/discord.com/channels/1/2")).toBeUndefined();
    expect(parseDiscordChannelLink("javascript:alert(1)")).toBeUndefined();
    expect(parseDiscordChannelLink("not a url")).toBeUndefined();
  });
});
