import { expect, it } from "vitest";

import { reviewBodyError } from "./review-body-error";

it("공백을 포함해 20자 이상이고 글자가 있으면 낼 수 있다", () => {
  expect(reviewBodyError("가".repeat(20))).toBeNull();
  expect(reviewBodyError("가나다 ".repeat(7))).toBeNull();
});

it("20자 미만이면 글자 수 안내를 보인다", () => {
  expect(reviewBodyError("가".repeat(19))).toBe("20자 이상 적어 주세요");
});

it("공백만 있으면 글자 수와 상관없이 막는다", () => {
  expect(reviewBodyError("")).toBe("내용을 적어 주세요");
  expect(reviewBodyError(" ".repeat(30))).toBe("내용을 적어 주세요");
  expect(reviewBodyError("\n\n\t  ".repeat(10))).toBe("내용을 적어 주세요");
});
