import { describe, expect, it } from "vitest";

import { CERT_STATE } from "./cert-state";
import { editionSets } from "./edition-sets";
import { SUPPLEMENT_OPTION_STATE, supplementOptions } from "./supplement-options";
import type { MyRulebook } from "./to-my-rulebooks";

const book = (id: string, overrides: Partial<MyRulebook> = {}) =>
  ({
    id,
    name: id,
    shortName: id,
    categoryId: "shinobi",
    categoryName: "시노비가미",
    edition: "",
    kind: "supplement",
    certRequired: true,
    state: null,
    stateAt: null,
    latestApplication: null,
    unlockedBy: null,
    ...overrides,
  }) as MyRulebook;

describe("supplementOptions", () => {
  it("고를 수 있는 책을 위에 두고 심사 중·인증 필요 순으로 둔다", () => {
    const rulebooks = [
      book("코어", { kind: "core", state: CERT_STATE.certified }),
      book("히라사카 기관 유파북"),
      book("정인기", { state: CERT_STATE.pending }),
      book("인비전", { state: CERT_STATE.certified }),
      book("무료 책", { certRequired: false }),
      book("핸드북", { kind: "handbook", state: CERT_STATE.certified }),
    ];
    const [set] = editionSets(rulebooks);
    expect(supplementOptions(set!)).toEqual([
      { id: "무료 책", name: "무료 책", state: SUPPLEMENT_OPTION_STATE.open },
      { id: "인비전", name: "인비전", state: SUPPLEMENT_OPTION_STATE.open },
      { id: "정인기", name: "정인기", state: SUPPLEMENT_OPTION_STATE.pending },
      {
        id: "히라사카 기관 유파북",
        name: "히라사카 기관 유파북",
        state: SUPPLEMENT_OPTION_STATE.locked,
      },
    ]);
  });
});
