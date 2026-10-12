import { findChipLink } from "./find-chip-link";
import { toRichTextDoc, type RichTextNodeData } from "./rich-text-doc";

function collectHrefs(nodes: RichTextNodeData[], hrefs: Set<string>) {
  for (const node of nodes) {
    const chip = findChipLink(node);
    if (chip) hrefs.add(chip.href);
    if (node.content) collectHrefs(node.content, hrefs);
  }
}

// 저장 단계에서 채널명을 미리 가져올 링크 목록. 화면에서 칩으로 그려지는 링크와 같은 기준이다.
export function listRichTextChipLinks(value: string): string[] {
  const hrefs = new Set<string>();
  collectHrefs(toRichTextDoc(value).content, hrefs);
  return [...hrefs];
}
