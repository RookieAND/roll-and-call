import { toRichTextDoc } from "@roll-and-call/tiptap/doc";

import { richTextInline } from "./rich-text-inline";
import { richTextListItem } from "./rich-text-list-item";

export function richTextToMarkdown(value: string): string {
  return toRichTextDoc(value)
    .content.map((node) => {
      switch (node.type) {
        case "bulletList":
          return (node.content ?? []).map((item) => richTextListItem(item, "-")).join("\n");
        case "orderedList":
          return (node.content ?? [])
            .map((item, index) => richTextListItem(item, `${index + 1}.`))
            .join("\n");
        default:
          return richTextInline(node.content);
      }
    })
    .join("\n\n")
    .trim();
}
