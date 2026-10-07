import { describe, expect, it } from "vitest";

import { checkSettingId } from "./check-setting-id";
import type { GuildSnapshot } from "./guild-snapshot";
import { settingCheckMessage } from "./setting-check-message";

const VIEW_AND_SEND = String((1n << 10n) | (1n << 11n));

const guild: GuildSnapshot = {
  guildId: "guild",
  botId: "bot",
  botRoleIds: ["bot-role"],
  roles: [
    { id: "guild", name: "@everyone", position: 0, permissions: VIEW_AND_SEND },
    { id: "bot-role", name: "Roll & Call", position: 5, permissions: "0" },
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
    expect(checkSettingId({ field: "staffChannelId", id: "forum", guild })).toMatchObject({
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
});

describe("settingCheckMessage", () => {
  it("통과하면 실제 이름을 보여 준다", () => {
    expect(
      settingCheckMessage({
        check: { status: "ok", kind: "channel", name: "세션-완료" },
        serverName: "TRPIA",
      }),
    ).toEqual({ title: "#세션-완료 채널을 확인했습니다" });
  });

  it("실패 문구는 무엇이 문제인지와 어떻게 고치는지 두 줄이다", () => {
    expect(
      settingCheckMessage({
        check: { status: "fail", reason: "not-in-server" },
        serverName: "TRPIA",
      }),
    ).toEqual({
      title: "이 서버의 채널이 아닙니다.",
      description: "TRPIA 서버에 있는 채널의 ID를 넣어 주세요.",
    });
    expect(
      settingCheckMessage({
        check: { status: "fail", reason: "cannot-post" },
        serverName: "TRPIA",
      }),
    ).toEqual({
      title: "봇이 이 채널에 글을 쓸 수 없습니다.",
      description: "채널 권한에서 Roll & Call 봇에 메시지 보내기를 허용해 주세요.",
    });
  });
});
