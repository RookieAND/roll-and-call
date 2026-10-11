import { toRichTextDoc } from "@roll-and-call/tiptap/doc";

// 공백(띄어쓰기·줄바꿈·탭)을 뺀 글자 수. 공백만으로 최소 글자 수를 채우지 못하게 할 때 쓴다.
export function richTextNonSpaceLength(value: string): number {
  if (!value) return 0;

  const nodes = [...toRichTextDoc(value).content];
  let total = 0;
  for (const node of nodes) {
    total += node.text?.replace(/\s/g, "").length ?? 0;
    if (node.content) nodes.push(...node.content);
  }
  return total;
}
