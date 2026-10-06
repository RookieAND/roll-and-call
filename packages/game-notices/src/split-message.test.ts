import { expect, it } from "vitest";

import { splitMessage } from "./split-message";

it("줄 경계에서 나누고 모든 조각이 limit 안에 든다", () => {
  const chunks = splitMessage({ text: "가가가\n나나나\n다다다", limit: 7 });
  expect(chunks).toEqual(["가가가\n나나나", "다다다"]);
});

it("limit보다 긴 한 줄은 잘라서 잃지 않는다", () => {
  const chunks = splitMessage({ text: "가".repeat(10), limit: 4 });
  expect(chunks.join("")).toBe("가".repeat(10));
  expect(chunks.every((chunk) => chunk.length <= 4)).toBe(true);
});
