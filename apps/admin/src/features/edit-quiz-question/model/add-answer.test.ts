import { describe, expect, it } from "vitest";

import { addAnswer } from "./add-answer";

describe("addAnswer", () => {
  it("앞뒤 공백을 걷고 끝에 붙인다", () => {
    expect(addAnswer(["이성"], "  SAN ")).toEqual(["이성", "SAN"]);
  });

  it("빈 답과 공백·대소문자만 다른 답은 넣지 않는다", () => {
    expect(addAnswer(["이성 수치"], " ")).toEqual(["이성 수치"]);
    expect(addAnswer(["이성 수치", "SAN"], "이성수치")).toEqual(["이성 수치", "SAN"]);
    expect(addAnswer(["SAN"], "san")).toEqual(["SAN"]);
  });
});
