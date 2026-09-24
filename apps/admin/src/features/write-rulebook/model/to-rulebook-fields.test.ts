import { describe, expect, it } from "vitest";

import { toRulebookFields } from "./to-rulebook-fields";

describe("toRulebookFields", () => {
  it("다른 이름을 쉼표로 나누고 빈 칸·중복을 뺀다", () => {
    expect(
      toRulebookFields({
        name: " 마기카로기아 ",
        edition: "",
        aliasesText: "마기카, MGLG,, 마기카 ",
        certRequired: false,
      }),
    ).toEqual({
      name: "마기카로기아",
      edition: "",
      aliases: ["마기카", "MGLG"],
      certRequired: false,
    });
  });
});
