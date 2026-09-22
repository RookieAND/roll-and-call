import { toRichTextDoc } from "@roll-and-call/tiptap/doc";

export function richTextLength(value: string): number {
  if (!value) return 0;

  const nodes = [...toRichTextDoc(value).content];
  let total = 0;
  for (const node of nodes) {
    total += node.text?.length ?? 0;
    if (node.content) nodes.push(...node.content);
  }
  return total;
}
