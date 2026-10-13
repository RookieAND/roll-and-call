import { getSchema } from "@tiptap/core";
import { Node as ProseMirrorNode } from "@tiptap/pm/model";
import StarterKit from "@tiptap/starter-kit";
import { describe, expect, it } from "vitest";

import { buildLinkChipDecorations } from "./build-link-chip-decorations";
import { Spoiler } from "./spoiler";

const schema = getSchema([
  StarterKit.configure({ link: { protocols: ["http", "https"] } }),
  Spoiler,
]);
const DOC_URL = "https://docs.google.com/document/d/abc/edit";

function docOf(...nodes: unknown[]) {
  return ProseMirrorNode.fromJSON(schema, {
    type: "doc",
    content: [{ type: "paragraph", content: nodes }],
  });
}

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

function decorationsOf(doc: ProseMirrorNode) {
  return buildLinkChipDecorations(doc).find();
}

describe("buildLinkChipDecorations", () => {
  it("글자가 주소 그대로인 서비스 링크에 칩 모양과 서비스 이름을 입힌다", () => {
    const decorations = decorationsOf(docOf(linkedText({ text: DOC_URL, href: DOC_URL })));
    expect(decorations).toHaveLength(1);
    const { attrs } = (decorations[0] as unknown as { type: { attrs: Record<string, string> } })
      .type;
    expect(attrs).toMatchObject({
      class: "rich-text-chip-editing",
      "data-link-label": "구글 문서",
    });
  });

  it("직접 이름을 붙인 링크, 스포일러 링크, 모르는 서비스 링크는 건드리지 않는다", () => {
    const doc = docOf(
      linkedText({ text: "하우스룰 보기", href: DOC_URL }),
      linkedText({ text: DOC_URL, href: DOC_URL, extraMarks: ["spoiler"] }),
      linkedText({ text: "https://example.com", href: "https://example.com" }),
    );
    expect(decorationsOf(doc)).toHaveLength(0);
  });
});
