import { describe, expect, it } from "vitest";

import type { MyRulebook } from "@/entities/rulebook";

import { bulkBookLabel } from "./bulk-book-label";

const book = (shortName: string, edition: string) => ({ shortName, edition }) as MyRulebook;

describe("bulkBookLabel", () => {
  it("판본을 제목 뒤에 붙인다", () => {
    expect(bulkBookLabel(book("D&D", "5판 (2014)"))).toBe("D&D 5판 (2014)");
  });

  it("제목에 판본이 이미 있으면 한 번만 쓴다", () => {
    expect(bulkBookLabel(book("건독 리바이스드", "리바이스드"))).toBe("건독 리바이스드");
  });

  it("판본이 비어 있으면 제목만 쓴다", () => {
    expect(bulkBookLabel(book("극락왕생", ""))).toBe("극락왕생");
  });
});
