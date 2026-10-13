import type { Node as ProseMirrorNode } from "@tiptap/pm/model";

import { findChipLink } from "./find-chip-link";

export interface LinkChipRange {
  from: number;
  to: number;
  href: string;
}

// 글자가 주소 그대로인 링크 글자의 위치. 붙여넣거나 자동으로 걸린 링크가 칩으로 바뀔 자리다.
export function collectLinkChipRanges(doc: ProseMirrorNode): LinkChipRange[] {
  const ranges: LinkChipRange[] = [];
  doc.descendants((node, position) => {
    if (!node.isText) return;
    const chip = findChipLink({
      type: "text",
      text: node.text,
      marks: node.marks.map((mark) => ({
        type: mark.type.name,
        attrs: { href: mark.attrs.href as string | null | undefined },
      })),
    });
    if (chip) ranges.push({ from: position, to: position + node.nodeSize, href: chip.href });
  });
  return ranges;
}
