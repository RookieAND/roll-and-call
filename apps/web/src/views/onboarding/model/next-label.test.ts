import { describe, expect, it } from "vitest";

import { nextLabel } from "./next-label";

describe("nextLabel", () => {
  it.each([
    [{ welcome: true, last: false, fromHelp: false }, "둘러보기"],
    [{ welcome: true, last: false, fromHelp: true }, "둘러보기"],
    [{ welcome: false, last: false, fromHelp: false }, "다음"],
    [{ welcome: false, last: false, fromHelp: true }, "다음"],
    [{ welcome: false, last: true, fromHelp: false }, "구인 목록 보러 가기"],
    [{ welcome: false, last: true, fromHelp: true }, "도움말로 돌아가기"],
  ])("%o → %s", (input, label) => {
    expect(nextLabel(input)).toBe(label);
  });
});
