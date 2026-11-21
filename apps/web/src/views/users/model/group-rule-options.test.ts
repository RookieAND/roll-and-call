import { describe, expect, it } from "vitest";

import { groupRuleOptions } from "./group-rule-options";

const options = [
  { id: "1", label: "크툴루의 부름 7판", categoryName: "크툴루" },
  { id: "2", label: "펄프 크툴루", categoryName: "크툴루" },
  { id: "3", label: "더블크로스 3rd", categoryName: "더블크로스" },
];

describe("groupRuleOptions", () => {
  it("카테고리마다 묶는다", () => {
    expect(groupRuleOptions({ options, query: "" }).map((group) => group.options.length)).toEqual([
      2, 1,
    ]);
  });

  it("룰 이름과 카테고리 이름으로 찾는다", () => {
    expect(groupRuleOptions({ options, query: "펄프" })[0]?.options.map((o) => o.id)).toEqual([
      "2",
    ]);
    expect(groupRuleOptions({ options, query: "더블" })[0]?.categoryName).toBe("더블크로스");
  });
});
