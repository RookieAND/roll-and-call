import { toRichTextDoc } from "./rich-text-doc";
import { richTextInline } from "./rich-text-inline";
import { richTextListItem } from "./rich-text-list-item";

export function richTextToMarkdown(value: string): string {
  return toRichTextDoc(value)
    .content.map((node) => {
      switch (node.type) {
        case "bulletList":
          return (node.content ?? [])
            .map((item) => richTextListItem({ item, marker: "-" }))
            .join("\n");
        case "orderedList":
          return (node.content ?? [])
            .map((item, index) => richTextListItem({ item, marker: `${index + 1}.` }))
            .join("\n");
        case "blockquote":
          return (node.content ?? [])
            .map((child) => `> ${richTextInline(child.content)}`)
            .join("\n");
        case "codeBlock":
          return `\`\`\`\n${richTextInline(node.content)}\n\`\`\``;
        default:
          return richTextInline(node.content);
      }
    })
    .join("\n\n")
    .trim();
}
