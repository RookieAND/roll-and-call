import { getSchema } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { describe, expect, it } from "vitest";

import { chipifyRichTextDoc } from "./chipify-rich-text-doc";
import { collectLinkChipRanges } from "./collect-link-chip-ranges";
import { LinkChip } from "./link-chip-node";
import type { RichTextDoc } from "./rich-text-doc";
import { Spoiler } from "./spoiler";
import { unchipifyRichTextDoc } from "./unchipify-rich-text-doc";

const NOTION_URL = "https://www.notion.so/page-1";
const schema = getSchema([StarterKit, Spoiler, LinkChip]);

function linkText(text: string, extraMarks: { type: string }[] = []) {
  return { type: "text", text, marks: [{ type: "link", attrs: { href: text } }, ...extraMarks] };
}

function docOf(...content: object[]): RichTextDoc {
  return { type: "doc", content: [{ type: "paragraph", content }] } as RichTextDoc;
}

describe("링크 칩 변환", () => {
  it("불러올 때 칩 노드가 되고, 저장할 때 원래 모양으로 돌아온다", () => {
    const stored = docOf({ type: "text", text: "규칙 " }, linkText(NOTION_URL));
    const chipified = chipifyRichTextDoc(stored);
    expect(chipified.content[0]?.content?.[1]).toEqual({
      type: "linkChip",
      attrs: { href: NOTION_URL },
    });
    expect(unchipifyRichTextDoc(chipified)).toEqual(stored);
  });

  it("스포일러가 걸렸거나 모르는 서비스 주소는 글자로 둔다", () => {
    const stored = docOf(
      linkText(NOTION_URL, [{ type: "spoiler" }]),
      linkText("https://example.com/a"),
    );
    expect(chipifyRichTextDoc(stored)).toEqual(stored);
  });
});

describe("collectLinkChipRanges", () => {
  it("주소 그대로인 링크 글자의 자리를 찾는다", () => {
    const doc = schema.nodeFromJSON(docOf({ type: "text", text: "가 " }, linkText(NOTION_URL)));
    expect(collectLinkChipRanges(doc)).toEqual([
      { from: 3, to: 3 + NOTION_URL.length, href: NOTION_URL },
    ]);
  });
});

describe("칩 글자 수", () => {
  it("칩은 저장 형식과 같은 주소 길이로 센다", () => {
    const doc = schema.nodeFromJSON(chipifyRichTextDoc(docOf(linkText(NOTION_URL))));
    expect(doc.textBetween(0, doc.content.size)).toHaveLength(NOTION_URL.length);
  });
});
