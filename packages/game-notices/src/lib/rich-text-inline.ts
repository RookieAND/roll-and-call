import type { RichTextNodeData } from "@roll-and-call/tiptap/doc";

export function richTextInline(nodes: RichTextNodeData[] = []): string {
  return nodes
    .map((node) => {
      if (node.type === "hardBreak") return "\n";
      let text = node.text ?? "";
      for (const mark of node.marks ?? []) {
        if (mark.type === "bold") text = `**${text}**`;
        if (mark.type === "italic") text = `*${text}*`;
        if (mark.type === "spoiler") text = `||${text}||`;
        if (mark.type === "link" && mark.attrs?.href) {
          // 글자가 주소 그대로면 [주소](주소)로 감싸지 않는다. 디스코드가 그대로 글자로 보여 주고, 맨주소는 알아서 링크가 된다.
          text = text === mark.attrs.href ? text : `[${text}](${mark.attrs.href})`;
        }
      }
      return text;
    })
    .join("");
}
