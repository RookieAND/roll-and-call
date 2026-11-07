import { describe, expect, it } from "vitest";

import type { ForumTagForm } from "@/features/edit-forum-tags";

import { ruleTagRows } from "./rule-tag-rows";
import { withRuleTag } from "./with-rule-tag";

const empty: ForumTagForm = {
  open: "",
  closed: "",
  cancelled: "",
  categories: {},
  homebrew: "",
  playTypes: { voice: "", text: "" },
  briefing: "",
  session: "",
  adult: "",
};

const categories = [{ id: "c1", name: "크툴루의 부름" }];

describe("ruleTagRows", () => {
  it("카테고리 뒤에 자작 룰 고정 행을 둔다", () => {
    const form = { ...empty, categories: { c1: "t1" }, homebrew: "t9" };
    expect(ruleTagRows({ categories, form, saved: empty })).toEqual([
      { key: "c1", label: "크툴루의 부름", value: "t1", savedValue: "" },
      { key: "homebrew", label: "자작 룰", value: "t9", savedValue: "" },
    ]);
  });
});

describe("withRuleTag", () => {
  it("자작 룰 행은 form.homebrew를 바꾼다", () => {
    expect(withRuleTag({ form: empty, key: "homebrew", tagId: "t9" })).toEqual({
      ...empty,
      homebrew: "t9",
    });
  });

  it("카테고리 행은 categories를 바꾼다", () => {
    expect(withRuleTag({ form: empty, key: "c1", tagId: "t1" }).categories).toEqual({ c1: "t1" });
  });
});
