import { describe, expect, it } from "vitest";

import { CERT_STATE } from "./cert-state";
import { groupByCategory } from "./group-by-category";
import { missingCores } from "./missing-cores";
import type { MyRulebook } from "./to-my-rulebooks";

const book = (id: string, overrides: Partial<MyRulebook>) =>
  ({
    id,
    categoryId: "dx",
    categoryName: "더블크로스",
    edition: "3rd",
    kind: "core",
    certRequired: true,
    state: null,
    unlockedBy: null,
    ...overrides,
  }) as MyRulebook;

describe("missingCores", () => {
  it("같은 판본의 기본 룰북 중 아직 열리지 않은 것", () => {
    const first = book("1", { state: CERT_STATE.certified });
    const second = book("2", {});
    const advanced = book("s", { kind: "supplement" });
    expect(missingCores(advanced, [first, second, advanced])).toEqual([second]);
  });

  it("신판 인증으로 열린 구판은 빠진다", () => {
    const newer = book("7", { edition: "7판", state: CERT_STATE.certified });
    const older = book("6", { edition: "6판", unlockedBy: newer });
    expect(missingCores(older, [newer, older])).toEqual([]);
  });
});

describe("groupByCategory", () => {
  it("판본은 새것부터, 안에서는 기본 → 서플리먼트 → 핸드북", () => {
    const [category] = groupByCategory([
      book("h", { edition: "7판", kind: "handbook" }),
      book("6", { edition: "6판" }),
      book("7", { edition: "7판" }),
    ]);
    expect(
      category!.editions.map((edition) => edition.rulebooks.map((rulebook) => rulebook.id)),
    ).toEqual([["7", "h"], ["6"]]);
  });
});
