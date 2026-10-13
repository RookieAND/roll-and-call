import { LINK_CHIP_NODE } from "./link-chip";
import type { RichTextDoc, RichTextNodeData } from "./rich-text-doc";

function unchipifyNode(node: RichTextNodeData): RichTextNodeData {
  if (node.type === LINK_CHIP_NODE) {
    const href = node.attrs?.href ?? undefined;
    return { type: "text", text: href, marks: [{ type: "link", attrs: { href } }] };
  }
  if (!node.content) return node;
  return { ...node, content: node.content.map(unchipifyNode) };
}

// 칩 노드를 저장 형식(주소 글자 + 링크 마크)으로 되돌린다. 서버와 뷰어는 칩 노드를 모른다.
export function unchipifyRichTextDoc(doc: RichTextDoc): RichTextDoc {
  return { ...doc, content: doc.content.map(unchipifyNode) };
}
