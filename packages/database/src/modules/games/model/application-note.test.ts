import { describe, expect, it } from "vitest";

import { normalizeApplicationNote } from "./application-note";

describe("normalizeApplicationNote", () => {
  it("빈 글과 공백뿐인 글은 거부한다", () => {
    expect(normalizeApplicationNote(undefined)).toBeNull();
    expect(normalizeApplicationNote("")).toBeNull();
    expect(normalizeApplicationNote(" \n\t ")).toBeNull();
  });

  it("1자는 통과하고 앞뒤 공백은 자른다", () => {
    expect(normalizeApplicationNote("가")).toBe("가");
    expect(normalizeApplicationNote("  안녕 \n")).toBe("안녕");
  });

  it("500자는 통과하고 501자는 거부한다", () => {
    expect(normalizeApplicationNote("a".repeat(500))).toHaveLength(500);
    expect(normalizeApplicationNote("a".repeat(501))).toBeNull();
  });
});
