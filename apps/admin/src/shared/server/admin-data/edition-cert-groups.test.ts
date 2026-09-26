import { describe, expect, it } from "vitest";

import { editionCertGroups } from "./edition-cert-groups";
import type { Rulebook } from "./types";

const book = (id: string, overrides: Partial<Rulebook>) =>
  ({
    id,
    name: id,
    edition: "",
    category: "더블크로스",
    kind: "core",
    supersedesId: null,
    certRequired: true,
    hidden: false,
    ...overrides,
  }) as Rulebook;

describe("editionCertGroups", () => {
  const rulebooks = [
    book("1권", { edition: "3rd" }),
    book("2권", { edition: "3rd" }),
    book("상급", { edition: "3rd", kind: "supplement" }),
    book("6판", { category: "크툴루의 부름", edition: "6판" }),
    book("7판", { category: "크툴루의 부름", edition: "7판", supersedesId: "6판" }),
    book("마기카로기아", { category: "마기카로기아", certRequired: false }),
  ];
  const groups = editionCertGroups(rulebooks);
  const group = (label: string) => groups.find((candidate) => candidate.label === label)!;

  it("인증이 필요한 판본만 묶는다", () => {
    expect(groups.map((candidate) => candidate.label)).toEqual([
      "더블크로스 3rd",
      "크툴루의 부름 6판",
      "크툴루의 부름 7판",
    ]);
  });

  it("기본 룰북을 모두 인증해야 GM이 된다", () => {
    expect(group("더블크로스 3rd").eligible(new Set(["1권"]))).toBe(false);
    expect(group("더블크로스 3rd").eligible(new Set(["1권", "2권"]))).toBe(true);
  });

  it("포함하는 신판을 인증하면 구판으로도 GM이 된다", () => {
    expect(group("크툴루의 부름 6판").eligible(new Set(["7판"]))).toBe(true);
    expect(group("크툴루의 부름 7판").eligible(new Set(["6판"]))).toBe(false);
  });

  it("신판 인증으로 열린 구판은 직접 인증한 판본이 아니다", () => {
    expect(group("크툴루의 부름 6판").certified(new Set(["7판"]))).toBe(false);
    expect(group("크툴루의 부름 7판").certified(new Set(["7판"]))).toBe(true);
  });
});
