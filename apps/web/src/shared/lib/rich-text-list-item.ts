import type { RichTextNodeData } from "@roll-and-call/tiptap/doc";

import { richTextInline } from "./rich-text-inline";

// ponytail: 목록은 한 단계만 편다. 중첩 목록까지 살릴 일이 생기면 그때 재귀로 바꾼다.
export function richTextListItem(item: RichTextNodeData, marker: string): string {
  return `${marker} ${richTextInline(item.content?.[0]?.content)}`;
}
