import { expect, it } from "vitest";

import { inlineCodeTags } from "./inline-code-tags";

it("값마다 인라인 코드로 감싸고 백틱은 바꾼다", () => {
  expect(inlineCodeTags(["x`y", "z"])).toBe("`x'y` `z`");
});
