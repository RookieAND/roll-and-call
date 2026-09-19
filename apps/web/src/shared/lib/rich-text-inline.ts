import type { RichTextNodeData } from "@trpg/tiptap/doc";

export function richTextInline(nodes: RichTextNodeData[] = []): string {
  return nodes
    .map((node) => {
      if (node.type === "hardBreak") return "\n";
      let text = node.text ?? "";
      for (const mark of node.marks ?? []) {
        if (mark.type === "bold") text = `**${text}**`;
        if (mark.type === "italic") text = `*${text}*`;
        if (mark.type === "spoiler") text = `||${text}||`;
        if (mark.type === "link" && mark.attrs?.href) text = `[${text}](${mark.attrs.href})`;
      }
      return text;
    })
    .join("");
}
