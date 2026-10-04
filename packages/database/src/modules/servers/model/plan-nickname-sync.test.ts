import { describe, expect, it } from "vitest";

import { planNicknameSync } from "./plan-nickname-sync";

const member = (userId: string, nickname: string, hasAccount = true) => ({
  userId,
  nickname,
  hasAccount,
});

describe("planNicknameSync", () => {
  it("디스코드 닉네임이 같으면 먼저 가입한 사람이 원래 이름을 갖는다", () => {
    const { changes, kept } = planNicknameSync({
      members: [member("a", "old-a"), member("b", "old-b")],
      guildNames: new Map([
        ["a", "달빛토끼"],
        ["b", "달빛토끼"],
      ]),
    });
    expect(kept).toBe(0);
    expect(changes).toEqual([
      { userId: "a", from: "old-a", to: "달빛토끼", suffixBase: null },
      { userId: "b", from: "old-b", to: "달빛토끼2", suffixBase: "달빛토끼" },
    ]);
  });

  it("미리 만든 프로필과 조회 실패는 지금 닉네임을 유지한다", () => {
    const { changes, kept } = planNicknameSync({
      members: [member("a", "미리", false), member("b", "모름")],
      guildNames: new Map([
        ["a", "디스코드이름"],
        ["b", null],
      ]),
    });
    expect(changes).toEqual([]);
    expect(kept).toBe(2);
  });

  it("이름을 맞바꿔도 겹치지 않는다", () => {
    const { changes } = planNicknameSync({
      members: [member("a", "A"), member("b", "B")],
      guildNames: new Map([
        ["a", "B"],
        ["b", "A"],
      ]),
    });
    expect(changes).toEqual([
      { userId: "a", from: "A", to: "B", suffixBase: null },
      { userId: "b", from: "B", to: "A", suffixBase: null },
    ]);
  });

  it("대소문자만 다른 이름도 겹친 것으로 보고, 앞사람 이름이 디스코드 이름을 막는다", () => {
    const { changes } = planNicknameSync({
      members: [member("a", "Rookie"), member("b", "other")],
      guildNames: new Map([
        ["a", null],
        ["b", "rookie"],
      ]),
    });
    expect(changes).toEqual([{ userId: "b", from: "other", to: "rookie2", suffixBase: "rookie" }]);
  });
});
