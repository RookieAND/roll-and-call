import { describe, expect, it } from "vitest";

import { relativeDay } from "./relative-day";

describe("relativeDay", () => {
  it("열흘까지는 우리말 날수, 그 뒤는 D-n", () => {
    expect(relativeDay(-1)).toBeNull();
    expect(relativeDay(2)).toBe("모레");
    expect(relativeDay(3)).toBe("사흘 뒤");
    expect(relativeDay(10)).toBe("열흘 뒤");
    expect(relativeDay(11)).toBe("D-11");
  });
});
