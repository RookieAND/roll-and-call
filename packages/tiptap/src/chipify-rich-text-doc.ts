import { findChipLink } from "./find-chip-link";
import { LINK_CHIP_NODE } from "./link-chip";
import type { RichTextDoc, RichTextNodeData } from "./rich-text-doc";

function chipifyNode(node: RichTextNodeData): RichTextNodeData {
  const chip = findChipLink(node);
  if (chip) return { type: LINK_CHIP_NODE, attrs: { href: chip.href } };
  if (!node.content) return node;
  return { ...node, content: node.content.map(chipifyNode) };
}

// 에디터에만 있는 칩 노드로 바꾼다. 저장 형식(주소 글자 + 링크 마크)은 그대로 두고, 불러올 때만 쓴다.
export function chipifyRichTextDoc(doc: RichTextDoc): RichTextDoc {
  return { ...doc, content: doc.content.map(chipifyNode) };
}
