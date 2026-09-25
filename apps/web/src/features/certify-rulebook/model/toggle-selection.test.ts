import { describe, expect, it } from "vitest";

import type { MyRulebook } from "@/entities/rulebook";

import { toggleSelection } from "./toggle-selection";

const book = (id: string, overrides: Partial<MyRulebook> = {}) =>
  ({ id, categoryId: "dx", edition: "3rd", kind: "core", ...overrides }) as MyRulebook;

describe("toggleSelection", () => {
  it("같은 판본의 기본 룰북은 함께 고른다", () => {
    const [first, second] = [book("1"), book("2")];
    expect(toggleSelection([first], second)).toEqual([first, second]);
    expect(toggleSelection([first, second], first)).toEqual([second]);
  });

  it("서플리먼트나 다른 룰을 누르면 그 책 하나로 바꾼다", () => {
    const first = book("1");
    const advanced = book("s", { kind: "supplement" });
    expect(toggleSelection([first], advanced)).toEqual([advanced]);
    expect(toggleSelection([first], book("m", { categoryId: "magica" }))).toHaveLength(1);
  });
});
