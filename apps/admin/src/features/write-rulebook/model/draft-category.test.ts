import { describe, expect, it } from "vitest";

import { draftCategory } from "./draft-category";
import type { RulebookDraft } from "./rulebook-draft";

const rulebooks = [
  { id: "6", label: "수호자 룰북 6판", category: "크툴루의 부름", kind: "core" as const },
  { id: "7", label: "수호자 룰북 7판", category: "크툴루의 부름", kind: "core" as const },
  { id: "p", label: "펄프 크툴루 7판", category: "크툴루의 부름", kind: "supplement" as const },
];

const draft = (changes: Partial<RulebookDraft>): RulebookDraft => ({
  name: "",
  edition: "",
  category: "",
  kind: "core",
  supersedesId: null,
  aliasesText: "",
  certRequired: true,
  ...changes,
});

describe("draftCategory", () => {
  it("구판 후보는 같은 카테고리의 다른 기본 룰북뿐이다", () => {
    const state = draftCategory(
      draft({ category: "크툴루의 부름", supersedesId: "6" }),
      rulebooks,
      "7",
    );
    expect(state.supersedesOptions.map((option) => option.id)).toEqual(["6"]);
    expect(state.supersedesId).toBe("6");
  });

  it("서플리먼트는 구판을 고를 수 없고, 새 카테고리면 오류다", () => {
    const state = draftCategory(
      draft({ name: "가스라이트", kind: "supplement", supersedesId: "6" }),
      rulebooks,
    );
    expect(state.supersedesId).toBeNull();
    expect(state.error).toBe("서플리먼트는 기존 카테고리를 골라야 합니다.");
  });

  it("카테고리를 비운 기본 룰북은 룰북 이름으로 새 카테고리를 만든다", () => {
    const state = draftCategory(draft({ name: "팀 셜록" }), rulebooks);
    expect(state).toMatchObject({ name: "팀 셜록", exists: false, error: undefined });
  });
});
