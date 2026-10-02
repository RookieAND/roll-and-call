import { describe, expect, it } from "vitest";

import { checkSettingId } from "./check-setting-id";
import type { GuildSnapshot } from "./guild-snapshot";
import { settingCheckMessage } from "./setting-check-message";

const VIEW_AND_SEND = String((1n << 10n) | (1n << 11n));
const MANAGE_ROLES = String(1n << 28n);

const guild: GuildSnapshot = {
  guildId: "guild",
  botId: "bot",
  botRoleIds: ["bot-role"],
  roles: [
    { id: "guild", name: "@everyone", position: 0, permissions: VIEW_AND_SEND },
    { id: "bot-role", name: "Roll & Call", position: 5, permissions: MANAGE_ROLES },
    { id: "gm-low", name: "GM", position: 3, permissions: "0" },
    { id: "gm-high", name: "운영", position: 8, permissions: "0" },
  ],
  channels: [
    { id: "forum", name: "모집-게시판", type: 15 },
    { id: "text", name: "세션-완료", type: 0 },
    { id: "voice", name: "음성", type: 2 },
    {
      id: "locked",
      name: "운영-공지",
      type: 0,
      permission_overwrites: [{ id: "guild", type: 0, allow: "0", deny: String(1n << 11n) }],
    },
    {
      id: "unlocked",
      name: "봇-허용",
      type: 0,
      permission_overwrites: [
        { id: "guild", type: 0, allow: "0", deny: String(1n << 11n) },
        { id: "bot", type: 1, allow: String(1n << 11n), deny: "0" },
      ],
    },
  ],
};

describe("checkSettingId", () => {
  it("포럼 채널은 포럼으로 통과한다", () => {
    expect(checkSettingId({ field: "recruitChannelId", id: "forum", guild })).toEqual({
      status: "ok",
      kind: "forum",
      name: "모집-게시판",
    });
  });

  it("다른 서버의 채널이면 실패한다", () => {
    expect(checkSettingId({ field: "closedChannelId", id: "missing", guild })).toEqual({
      status: "fail",
      reason: "not-in-server",
    });
  });

  it("받지 않는 종류의 채널이면 실패한다", () => {
    expect(checkSettingId({ field: "reviewForumChannelId", id: "text", guild })).toMatchObject({
      reason: "wrong-type",
    });
    expect(checkSettingId({ field: "announceChannelId", id: "voice", guild })).toMatchObject({
      reason: "wrong-type",
    });
  });

  it("@everyone 덮어쓰기로 메시지 보내기가 막히면 실패하고, 봇 덮어쓰기가 다시 허용하면 통과한다", () => {
    expect(checkSettingId({ field: "announceChannelId", id: "locked", guild })).toMatchObject({
      reason: "cannot-post",
    });
    expect(checkSettingId({ field: "announceChannelId", id: "unlocked", guild })).toMatchObject({
      status: "ok",
    });
  });

  it("GM 역할이 봇 역할보다 위면 실패한다", () => {
    expect(checkSettingId({ field: "gmRoleId", id: "gm-high", guild })).toMatchObject({
      reason: "role-above-bot",
    });
    expect(checkSettingId({ field: "gmRoleId", id: "gm-low", guild })).toEqual({
      status: "ok",
      kind: "role",
      name: "GM",
    });
  });

  it("역할 관리 권한이 없거나 없는 역할이면 실패한다", () => {
    const withoutManage = {
      ...guild,
      roles: guild.roles.map((role) =>
        role.id === "bot-role" ? { ...role, permissions: "0" } : role,
      ),
    };
    expect(checkSettingId({ field: "gmRoleId", id: "gm-low", guild: withoutManage })).toMatchObject(
      { reason: "cannot-manage-roles" },
    );
    expect(checkSettingId({ field: "gmRoleId", id: "guild", guild })).toMatchObject({
      reason: "role-not-in-server",
    });
  });
});

describe("settingCheckMessage", () => {
  it("통과하면 실제 이름을 보여 준다", () => {
    expect(
      settingCheckMessage({
        check: { status: "ok", kind: "channel", name: "세션-완료" },
        serverName: "TRPIA",
      }),
    ).toBe("#세션-완료 채널을 확인했습니다");
    expect(
      settingCheckMessage({
        check: { status: "ok", kind: "role", name: "GM" },
        serverName: "TRPIA",
      }),
    ).toBe("@GM 역할을 확인했습니다");
  });

  it("실패 이유마다 다른 문구를 쓴다", () => {
    expect(
      settingCheckMessage({
        check: { status: "fail", reason: "not-in-server" },
        serverName: "TRPIA",
      }),
    ).toBe("이 서버의 채널이 아닙니다. TRPIA 서버에 있는 채널의 ID를 넣어 주세요.");
  });
});
