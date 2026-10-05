import { describe, expect, it } from "vitest";

import { MESSAGE_CASES } from "./message-heads";
import {
  defaultMessageText,
  MESSAGE_TEXTS,
  messageTextsOfCase,
  messageTextVariables,
  validateMessageText,
} from "./message-texts";
import { renderMessageHead } from "./render-message-head";

describe("MESSAGE_TEXTS", () => {
  it("모든 문장은 있는 경우(MESSAGE_CASES)에 속한다", () => {
    const caseKeys = MESSAGE_CASES.map((messageCase) => messageCase.key) as string[];
    expect(MESSAGE_TEXTS.every((text) => caseKeys.includes(text.caseKey))).toBe(true);
  });

  it("기본 문장이 쓰는 변수는 모두 허용 변수다", () => {
    for (const text of MESSAGE_TEXTS) {
      expect(
        validateMessageText({ key: text.key, text: defaultMessageText(text.key) }),
      ).toBeUndefined();
    }
  });

  it("경우마다 문장 목록을 돌려준다", () => {
    expect(messageTextsOfCase("time").map((text) => text.key)).toEqual(["time", "time_changed"]);
    expect(messageTextsOfCase("open")).toEqual([]);
  });
});

describe("validateMessageText", () => {
  it("everyone, 없는 변수, 글자 수를 막고 빈 값은 허용한다", () => {
    expect(validateMessageText({ key: "apply", text: "@here" })).toBeDefined();
    expect(validateMessageText({ key: "apply", text: "{확정자}님" })).toContain("{확정자}");
    expect(validateMessageText({ key: "draw", text: "{확정 수}명" })).toBeUndefined();
    expect(validateMessageText({ key: "apply", text: "가".repeat(301) })).toBeDefined();
    expect(validateMessageText({ key: "apply", text: "" })).toBeUndefined();
  });

  it("경우마다 변수가 다르다", () => {
    expect(messageTextVariables("draw")).toContain("신청 수");
    expect(messageTextVariables("done")).not.toContain("신청 수");
  });

  it("렌더링은 변수 값을 채우고 줄바꿈은 지킨다", () => {
    expect(
      renderMessageHead({ template: "{참여자}님이\n참여했어요.", values: { 참여자: "<@1>" } }),
    ).toBe("<@1>님이\n참여했어요.");
  });
});
