import { describe, expect, it } from "vitest";

import { rulebookChanges } from "./rulebook-audit-changes";
import type { RulebookDescription } from "./rulebook-description";

const base: RulebookDescription = {
  name: "둘이서 수사",
  edition: "구판",
  category: "둘이서 수사",
  categoryAlias: null,
  kind: "core",
  supersedes: "",
  aliases: [],
  certRequired: true,
};

describe("rulebookChanges", () => {
  it("다른 이름만 바뀌면 그 칸만 남긴다", () => {
    expect(rulebookChanges(base, { ...base, aliases: ["둘이서 수사 구판"] })).toEqual([
      { field: "다른 이름", added: ["둘이서 수사 구판"] },
    ]);
  });

  it("여러 칸이 바뀌면 칸마다 전후를 남긴다", () => {
    const changes = rulebookChanges(base, {
      ...base,
      edition: "7판",
      certRequired: false,
      categoryAlias: "둘수",
    });
    expect(changes.map((change) => change.field)).toEqual(["판본", "분류 약어", "인증"]);
    expect(changes[2]).toEqual({ field: "인증", before: "인증 필요", after: "인증 불필요" });
  });

  it("바뀐 칸이 없으면 빈 목록이다", () => {
    expect(rulebookChanges(base, { ...base })).toEqual([]);
  });

  it("새 룰북은 값이 있는 칸을 모두 추가로 남긴다", () => {
    const changes = rulebookChanges(null, { ...base, aliases: ["둘수"] });
    expect(changes.map((change) => change.field)).toEqual([
      "이름",
      "판본",
      "분류",
      "종류",
      "인증",
      "다른 이름",
    ]);
    expect(changes.every((change) => change.before === undefined)).toBe(true);
  });
});
