import { describe, expect, it } from "vitest";

import { submitErrorMessage } from "./submit-error-message";

const ruleError = { error: "룰을 다시 골라 주세요.", field: "rule" };

describe("submitErrorMessage", () => {
  it("자작 룰의 룰 칸 실패는 사용할 수 없다는 문구로 바꾼다", () => {
    expect(submitErrorMessage({ result: ruleError, homebrew: true })).toBe(
      "이 룰은 지금 사용할 수 없습니다.\n다른 룰을 골라 주세요.",
    );
  });
  it("일반 룰이거나 다른 칸의 실패는 그대로 둔다", () => {
    expect(submitErrorMessage({ result: ruleError, homebrew: false })).toBe(ruleError.error);
    expect(
      submitErrorMessage({ result: { error: "x", field: "supplements" }, homebrew: true }),
    ).toBe("x");
  });
});
