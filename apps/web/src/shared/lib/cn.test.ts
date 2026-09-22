import { cn } from "@roll-and-call/ui";
import { describe, expect, it } from "vitest";

// tailwind-merge가 text-body4를 글자색으로 오해하면 크기가 통째로 사라진다.
// Text의 cva가 `text-body4 … text-gray-900`을 내므로 이게 깨지면 타이포가 전부 무력해진다.
describe("cn", () => {
  it("글자 크기와 글자색은 함께 남는다", () => {
    expect(cn("text-body4 font-normal", "text-gray-600")).toContain("text-body4");
    expect(cn("text-body4 font-normal", "text-gray-600")).toContain("text-gray-600");
    expect(cn("text-heading3", "text-current")).toContain("text-heading3");
  });

  it("글자 크기끼리는 뒤에 온 것이 이긴다", () => {
    expect(cn("text-body4", "text-body5")).toBe("text-body5");
    expect(cn("text-body2", "text-sm")).toBe("text-sm");
  });
});
