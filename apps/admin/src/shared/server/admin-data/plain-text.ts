import { toRichTextDoc, type RichTextNodeData } from "@roll-and-call/tiptap/doc";

// 운영진 화면은 서식 없이 읽으므로 리치 텍스트를 문단마다 한 줄로 편다. 스포일러도 그대로 드러낸다.
export function plainText(value: string) {
  const flatten = (node: RichTextNodeData): string =>
    node.text ?? (node.content ?? []).map(flatten).join("");
  return toRichTextDoc(value).content.map(flatten).join("\n");
}
