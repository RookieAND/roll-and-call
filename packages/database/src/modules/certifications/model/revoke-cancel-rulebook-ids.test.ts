import { describe, expect, it } from "vitest";

import { revokeCancelRulebookIds } from "./revoke-cancel-rulebook-ids";

const book = (id: string, kind: string, edition = "7판", categoryId = "coc") => ({
  id,
  kind,
  categoryId,
  edition,
});

const rulebooks = [
  book("keeper", "core"),
  book("investigator", "core"),
  book("companion", "supplement"),
  book("handbook", "handbook"),
  book("keeper6", "core", "6판"),
  book("dx", "core", "3rd", "dx"),
];

describe("revokeCancelRulebookIds", () => {
  it("기본 룰북이면 같은 판본의 기본 룰북을 모두 돌려준다", () => {
    expect(revokeCancelRulebookIds({ rulebook: rulebooks[1]!, rulebooks })).toEqual([
      "keeper",
      "investigator",
    ]);
  });

  it("서플리먼트·플레이어 책은 구인 자격과 무관해 비어 있다", () => {
    expect(revokeCancelRulebookIds({ rulebook: rulebooks[2]!, rulebooks })).toEqual([]);
    expect(revokeCancelRulebookIds({ rulebook: rulebooks[3]!, rulebooks })).toEqual([]);
  });
});
