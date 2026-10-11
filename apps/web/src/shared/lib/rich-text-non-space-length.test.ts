import { expect, it } from "vitest";

import { richTextNonSpaceLength } from "./rich-text-non-space-length";

it("공백을 뺀 글자만 센다", () => {
  expect(richTextNonSpaceLength("가나다 라마바")).toBe(6);
});

it("줄바꿈과 탭도 공백으로 본다", () => {
  expect(richTextNonSpaceLength("가나\n다\t라")).toBe(4);
});

it("공백만 있으면 0이다", () => {
  expect(richTextNonSpaceLength("   \n\t  ")).toBe(0);
  expect(richTextNonSpaceLength("")).toBe(0);
});

it("서식 문서도 글자 노드만 센다", () => {
  const doc = JSON.stringify({
    type: "doc",
    content: [
      { type: "paragraph", content: [{ type: "text", text: "가 나 다" }] },
      { type: "paragraph", content: [{ type: "text", text: "  " }] },
      { type: "paragraph", content: [{ type: "text", text: "라마", marks: [{ type: "bold" }] }] },
    ],
  });
  expect(richTextNonSpaceLength(doc)).toBe(5);
});
