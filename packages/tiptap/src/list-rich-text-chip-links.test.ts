import { describe, expect, it } from "vitest";

import { listRichTextChipLinks } from "./list-rich-text-chip-links";

const DISCORD_URL = "https://discord.com/channels/1/2/3";

function linkedText({
  text,
  href,
  extraMarks = [],
}: {
  text: string;
  href: string;
  extraMarks?: string[];
}) {
  return {
    type: "text",
    text,
    marks: [...extraMarks.map((type) => ({ type })), { type: "link", attrs: { href } }],
  };
}

function docOf(...nodes: unknown[]) {
  return JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: nodes }] });
}

describe("listRichTextChipLinks", () => {
  it("글자가 주소 그대로인 링크만 모은다", () => {
    const value = docOf(
      linkedText({ text: DISCORD_URL, href: DISCORD_URL }),
      linkedText({ text: "하우스룰 보기", href: "https://notion.so/rules" }),
    );
    expect(listRichTextChipLinks(value)).toEqual([DISCORD_URL]);
  });

  it("같은 주소는 한 번만 담고 목록 안쪽 문단도 훑는다", () => {
    const value = JSON.stringify({
      type: "doc",
      content: [
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    linkedText({ text: DISCORD_URL, href: DISCORD_URL }),
                    linkedText({ text: DISCORD_URL, href: DISCORD_URL }),
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    expect(listRichTextChipLinks(value)).toEqual([DISCORD_URL]);
  });

  it("스포일러가 걸린 링크와 모르는 서비스 주소는 칩으로 바꾸지 않는다", () => {
    const value = docOf(
      linkedText({ text: DISCORD_URL, href: DISCORD_URL, extraMarks: ["spoiler"] }),
      linkedText({ text: "https://example.com", href: "https://example.com" }),
    );
    expect(listRichTextChipLinks(value)).toEqual([]);
  });

  it("javascript: 링크는 버리고, 평문으로 저장된 옛 글은 칩 없이 넘어간다", () => {
    const unsafe = docOf(linkedText({ text: "javascript:alert(1)", href: "javascript:alert(1)" }));
    expect(listRichTextChipLinks(unsafe)).toEqual([]);
    expect(listRichTextChipLinks(`하우스룰은 ${DISCORD_URL} 입니다`)).toEqual([]);
  });
});
