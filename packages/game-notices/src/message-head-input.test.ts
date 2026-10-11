import { describe, expect, it, vi } from "vitest";

vi.mock("@roll-and-call/database/servers", async () => {
  const actual = await vi.importActual<object>("@roll-and-call/database/servers/model");
  return {
    ...actual,
    getMessageHeads: async () => ({
      time: { headLine: "📢 {구인 제목} 시간 확정", updatedAt: null },
      done: { headLine: "{GM 멘션} {참여자 멘션}", updatedAt: new Date() },
    }),
    roleMentionIds: () => [],
  };
});
vi.mock("./game-url", () => ({ gameUrl: () => undefined }));

import { messageHeadInput } from "./message-head-input";

describe("messageHeadInput alsoMention", () => {
  it("머리 줄에 없는 사람만 한 줄로 덧붙이고 알림 대상에 넣는다", async () => {
    const input = await messageHeadInput({
      serverId: "s",
      key: "time",
      values: { "구인 제목": "여관" },
      alsoMention: [{ id: "1" }, { id: "2" }],
    });
    expect(input.content).toBe("📢 여관 시간 확정\n<@1> <@2>");
    expect(input.userMentions).toEqual(["1", "2"]);
  });

  it("머리 줄이 이미 멘션한 사람은 다시 적지 않는다", async () => {
    const input = await messageHeadInput({
      serverId: "s",
      key: "done",
      values: { "GM 멘션": "<@9>", "참여자 멘션": "<@1> **손님**" },
      alsoMention: [{ id: "9" }, { id: "1" }, { id: null, fallback: "**손님**" }],
    });
    expect(input.content).toBe("<@9> <@1> **손님**");
    expect(input.userMentions).toEqual(["9", "1"]);
  });

  it("알릴 사람이 없으면 기존 동작 그대로다", async () => {
    const input = await messageHeadInput({
      serverId: "s",
      key: "time",
      values: { "구인 제목": "여관" },
    });
    expect(input.userMentions).toBeUndefined();
    expect(input.content).toBe("📢 여관 시간 확정");
  });
});
