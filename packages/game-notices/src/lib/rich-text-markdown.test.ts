import { describe, expect, it } from "vitest";

import { richTextToMarkdown } from "./rich-text-markdown";

const paragraph = (content: unknown[]) => ({ type: "paragraph", content });
const listItem = (text: string, marks?: unknown[]) => ({
  type: "listItem",
  content: [paragraph([{ type: "text", text, ...(marks ? { marks } : {}) }])],
});
const markdownOf = (doc: unknown) => richTextToMarkdown(JSON.stringify(doc));

describe("richTextToMarkdown", () => {
  it("굵게·기울임·링크를 마크다운으로 옮긴다", () => {
    const doc = {
      type: "doc",
      content: [
        paragraph([
          { type: "text", text: "낡은 " },
          { type: "text", text: "저택", marks: [{ type: "bold" }] },
          { type: "text", text: "으로 " },
          { type: "text", text: "간다", marks: [{ type: "italic" }] },
        ]),
        {
          type: "bulletList",
          content: [
            listItem("준비물 없음"),
            listItem("규칙", [{ type: "link", attrs: { href: "https://example.com" } }]),
          ],
        },
      ],
    };
    expect(markdownOf(doc)).toBe(
      "낡은 **저택**으로 *간다*\n\n- 준비물 없음\n- [규칙](https://example.com)",
    );
  });

  it("번호 목록은 1부터 센다", () => {
    const doc = {
      type: "doc",
      content: [{ type: "orderedList", content: [listItem("가"), listItem("나")] }],
    };
    expect(markdownOf(doc)).toBe("1. 가\n2. 나");
  });

  it("스포일러는 디스코드 문법으로 나간다", () => {
    const doc = {
      type: "doc",
      content: [
        paragraph([
          { type: "text", text: "범인은 " },
          { type: "text", text: "집사", marks: [{ type: "spoiler" }] },
        ]),
      ],
    };
    expect(markdownOf(doc)).toBe("범인은 ||집사||");
  });

  it("리치 에디터 이전 평문은 그대로 남는다", () => {
    expect(richTextToMarkdown("옛날 시놉시스\n두 번째 줄")).toBe("옛날 시놉시스\n\n두 번째 줄");
  });
});
