import { mergeAttributes, Node } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { collectLinkChipRanges } from "./collect-link-chip-ranges";
import { LINK_CHIP_NODE } from "./link-chip";
import { RichTextLinkChipView } from "./rich-text-link-chip-view";

// 에디터에서만 쓰는 노드다. 저장할 때는 unchipifyRichTextDoc이 주소 글자 + 링크 마크로 되돌린다.
export const LinkChip = Node.create({
  name: LINK_CHIP_NODE,
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return { href: { default: "" } };
  },

  // 글자 수는 저장 형식과 같게 주소 길이로 센다. 에디터 한도와 서버 검증이 어긋나지 않게 한다.
  extendNodeSchema() {
    return { leafText: (node: { attrs: { href: string } }) => node.attrs.href };
  },

  parseHTML() {
    return [{ tag: "span[data-link-chip]" }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes, { "data-link-chip": node.attrs.href })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(RichTextLinkChipView, { as: "span" });
  },

  addProseMirrorPlugins() {
    const chipType = this.type;
    return [
      new Plugin({
        key: new PluginKey("linkChip"),
        appendTransaction(transactions, _previousState, state) {
          if (!transactions.some((transaction) => transaction.docChanged)) return null;
          const ranges = collectLinkChipRanges(state.doc);
          if (ranges.length === 0) return null;

          const transaction = state.tr;
          for (const { from, to, href } of ranges.toReversed()) {
            transaction.replaceWith(from, to, chipType.create({ href }));
          }
          return transaction;
        },
      }),
    ];
  },
});
