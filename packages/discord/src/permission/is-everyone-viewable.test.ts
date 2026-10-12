import { describe, expect, it } from "vitest";

import type { DiscordGuildChannel } from "../guild/get-guild-channels";
import type { DiscordRole } from "../guild/get-guild-roles";
import { DISCORD_PERMISSION } from "./discord-permission";
import { isEveryoneViewable } from "./is-everyone-viewable";

const GUILD_ID = "100";
const VIEW = DISCORD_PERMISSION.viewChannel.toString();

const everyoneCanView: DiscordRole[] = [
  { id: GUILD_ID, name: "@everyone", position: 0, permissions: VIEW },
];
const everyoneCannotView: DiscordRole[] = [
  { id: GUILD_ID, name: "@everyone", position: 0, permissions: "0" },
];

function channelWith(permission_overwrites: DiscordGuildChannel["permission_overwrites"]) {
  return { id: "200", name: "하우스-룰", type: 0, permission_overwrites };
}

describe("isEveryoneViewable", () => {
  it("@everyone이 볼 수 있고 덮어쓰기가 없으면 공개 채널이다", () => {
    expect(
      isEveryoneViewable({ guildId: GUILD_ID, roles: everyoneCanView, channel: channelWith([]) }),
    ).toBe(true);
  });

  it("채널이 @everyone의 보기 권한을 막으면 비공개다", () => {
    const channel = channelWith([{ id: GUILD_ID, type: 0, allow: "0", deny: VIEW }]);
    expect(isEveryoneViewable({ guildId: GUILD_ID, roles: everyoneCanView, channel })).toBe(false);
  });

  it("특정 역할에만 보기를 열어 준 채널은 비공개다", () => {
    const channel = channelWith([
      { id: GUILD_ID, type: 0, allow: "0", deny: VIEW },
      { id: "300", type: 0, allow: VIEW, deny: "0" },
    ]);
    expect(isEveryoneViewable({ guildId: GUILD_ID, roles: everyoneCanView, channel })).toBe(false);
  });

  it("서버 기본 권한에 보기가 없으면 덮어쓰기가 없어도 비공개다", () => {
    expect(
      isEveryoneViewable({
        guildId: GUILD_ID,
        roles: everyoneCannotView,
        channel: channelWith([]),
      }),
    ).toBe(false);
  });

  it("@everyone에게 보기를 열어 준 채널은 기본 권한이 없어도 공개다", () => {
    const channel = channelWith([{ id: GUILD_ID, type: 0, allow: VIEW, deny: "0" }]);
    expect(isEveryoneViewable({ guildId: GUILD_ID, roles: everyoneCannotView, channel })).toBe(
      true,
    );
  });
});
