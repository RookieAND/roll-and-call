import { describe, expect, it } from "vitest";

import { windowEndOptions } from "./window-end-options";

describe("windowEndOptions", () => {
  it("시작 22면 23:00, 24:00, 01:00(+1)부터 21:00(+1)까지 23개다", () => {
    const options = windowEndOptions(22);
    expect(options).toHaveLength(23);
    expect(options.slice(0, 3)).toEqual([
      { value: "23", label: "23:00" },
      { value: "0", label: "24:00" },
      { value: "1", label: "01:00(+1)" },
    ]);
    expect(options.at(-1)).toEqual({ value: "21", label: "21:00(+1)" });
  });

  it("시작 0이면 01:00부터 23:00에서 끝난다", () => {
    const options = windowEndOptions(0);
    expect(options[0]).toEqual({ value: "1", label: "01:00" });
    expect(options.at(-1)).toEqual({ value: "23", label: "23:00" });
  });

  it("기본 12시 시작이면 24:00을 고를 수 있다", () => {
    expect(windowEndOptions(12)).toContainEqual({ value: "0", label: "24:00" });
  });
});
