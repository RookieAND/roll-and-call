import assert from "node:assert/strict";

import { richTextToMarkdown } from "./rich-text-markdown";

const doc = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        { type: "text", text: "낡은 " },
        { type: "text", text: "저택", marks: [{ type: "bold" }] },
        { type: "text", text: "으로 " },
        { type: "text", text: "간다", marks: [{ type: "italic" }] },
      ],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "준비물 없음" }] }],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "규칙",
                  marks: [{ type: "link", attrs: { href: "https://example.com" } }],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

assert.equal(
  richTextToMarkdown(JSON.stringify(doc)),
  "낡은 **저택**으로 *간다*\n\n- 준비물 없음\n- [규칙](https://example.com)",
);

// 번호 목록은 1부터 센다.
const ordered = {
  type: "doc",
  content: [
    {
      type: "orderedList",
      content: [
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "가" }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "나" }] }],
        },
      ],
    },
  ],
};
assert.equal(richTextToMarkdown(JSON.stringify(ordered)), "1. 가\n2. 나");

// 스포일러는 디스코드 문법 ||…||로 나간다.
const spoiler = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        { type: "text", text: "범인은 " },
        { type: "text", text: "집사", marks: [{ type: "spoiler" }] },
      ],
    },
  ],
};
assert.equal(richTextToMarkdown(JSON.stringify(spoiler)), "범인은 ||집사||");

// 리치 에디터 이전 평문은 그대로 남는다.
assert.equal(richTextToMarkdown("옛날 시놉시스\n두 번째 줄"), "옛날 시놉시스\n\n두 번째 줄");

console.log("rich-text-markdown ok");
