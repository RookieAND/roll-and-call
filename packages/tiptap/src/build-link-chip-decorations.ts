import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

import { findChipLink } from "./find-chip-link";
import { LINK_PROVIDER_LABEL } from "./link-provider";

export const LINK_CHIP_PREVIEW_CLASS = "rich-text-chip-editing";

// 에디터 안에서는 글자를 그대로 두고(지우고 고치려면 글자가 있어야 한다) 칩이 될 링크에만 칩 모양과 서비스 이름을 입힌다.
export function buildLinkChipDecorations(doc: ProseMirrorNode): DecorationSet {
  const decorations: Decoration[] = [];

  doc.descendants((node, position) => {
    if (!node.isText) return;
    const chip = findChipLink({
      type: "text",
      text: node.text,
      marks: node.marks.map((mark) => ({ type: mark.type.name, attrs: mark.attrs })),
    });
    if (!chip) return;
    decorations.push(
      Decoration.inline(position, position + node.nodeSize, {
        class: LINK_CHIP_PREVIEW_CLASS,
        "data-link-label": LINK_PROVIDER_LABEL[chip.provider],
      }),
    );
  });

  return DecorationSet.create(doc, decorations);
}
