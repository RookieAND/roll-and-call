import { describe, expect, it } from "vitest";

import { CERT_STATE } from "./cert-state";
import { editionSets } from "./edition-sets";
import type { MyRulebook } from "./to-my-rulebooks";

const book = (id: string, overrides: Partial<MyRulebook>) =>
  ({
    id,
    shortName: id,
    categoryId: "coc",
    categoryName: "크툴루의 부름",
    edition: "7판",
    kind: "core",
    certRequired: true,
    state: null,
    unlockedBy: null,
    ...overrides,
  }) as MyRulebook;

describe("editionSets", () => {
  it("신판 인증으로 열린 구판 세트를 표시하고, 신판 세트에는 함께 열리는 판본을 적는다", () => {
    const newer = book("7", { state: CERT_STATE.certified });
    const older = book("6", { edition: "6판", unlockedBy: newer });
    const sets = editionSets([older, newer, book("p", { kind: "supplement" })]);
    expect(sets.map((set) => [set.label, set.opened, set.unlockedBy, set.covers])).toEqual([
      ["크툴루의 부름 7판", true, null, ["6판"]],
      ["크툴루의 부름 6판", true, "7판", []],
    ]);
    expect(sets[0]!.extras.map((extra) => extra.id)).toEqual(["p"]);
  });

  it("기본 룰북이 여러 권이면 모두 열려야 세트가 열린다", () => {
    const [set] = editionSets([
      book("1", {
        categoryId: "dx",
        categoryName: "더블크로스",
        edition: "3rd",
        state: CERT_STATE.certified,
      }),
      book("2", { categoryId: "dx", categoryName: "더블크로스", edition: "3rd" }),
    ]);
    expect(set).toMatchObject({ label: "더블크로스 3rd", opened: false, earned: false });
  });

  it("무료 배포 세트는 열려 있지만 인증해서 연 세트는 아니다", () => {
    const [set] = editionSets([book("F", { edition: "F", certRequired: false })]);
    expect(set).toMatchObject({ free: true, opened: true, earned: false });
  });
});
