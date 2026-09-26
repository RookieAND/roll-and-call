import { describe, expect, it } from "vitest";

import { CERT_STATE, type MyRulebook } from "@/entities/rulebook";

import { togglePick } from "./toggle-pick";

const book = (id: string, overrides: Partial<MyRulebook> = {}) =>
  ({
    id,
    shortName: id,
    categoryId: "dx",
    categoryName: "더블크로스",
    edition: "3rd",
    kind: "core",
    certRequired: true,
    state: null,
    stateAt: null,
    latestApplication: null,
    unlockedBy: null,
    ...overrides,
  }) as MyRulebook;

describe("togglePick", () => {
  const first = book("1권");
  const second = book("2권");
  const advanced = book("상급", { kind: "supplement" });
  const all = [first, second, advanced];

  it("서플리먼트는 기본 룰북을 모두 담아야 담긴다", () => {
    expect(togglePick(["1권"], "상급", all)).toEqual(["1권"]);
    expect(togglePick(["1권", "2권"], "상급", all)).toEqual(["1권", "2권", "상급"]);
  });

  it("기본 룰북을 빼면 기대던 서플리먼트도 빠진다", () => {
    expect(togglePick(["1권", "2권", "상급"], "2권", all)).toEqual(["1권"]);
  });

  it("기본 룰북이 심사 중이면 서플리먼트만 담을 수 있다", () => {
    const pending = [
      book("1권", { state: CERT_STATE.pending, stateAt: new Date() }),
      book("2권", { state: CERT_STATE.certified, stateAt: new Date() }),
      advanced,
    ];
    expect(togglePick([], "상급", pending)).toEqual(["상급"]);
  });
});
