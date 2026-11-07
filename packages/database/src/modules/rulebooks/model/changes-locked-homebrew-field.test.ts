import { describe, expect, it } from "vitest";

import { changesLockedHomebrewField } from "./changes-locked-homebrew-field";
import type { RulebookFields } from "./rulebook-fields";

const current = {
  name: "달그림자",
  edition: "1.0",
  category: "달그림자",
  kind: "core" as const,
  supersedesId: null,
  certRequired: false,
};
const fields: RulebookFields = {
  ...current,
  categoryAlias: null,
  includedSupplementIds: [],
  aliases: [],
};

describe("changesLockedHomebrewField", () => {
  it("다른 이름만 바꾸면 통과한다", () => {
    expect(changesLockedHomebrewField({ current, fields: { ...fields, aliases: ["달"] } })).toBe(
      false,
    );
  });

  it("이름·판본·종류·인증 정책·구판 연결은 막는다", () => {
    for (const change of [
      { name: "새 이름" },
      { edition: "2.0" },
      { category: "다른 분류" },
      { kind: "supplement" as const },
      { certRequired: true },
      { supersedesId: "old" },
      { includedSupplementIds: ["s"] },
    ]) {
      expect(changesLockedHomebrewField({ current, fields: { ...fields, ...change } })).toBe(true);
    }
  });
});
