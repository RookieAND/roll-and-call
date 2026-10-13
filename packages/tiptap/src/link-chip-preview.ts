import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

import { buildLinkChipDecorations } from "./build-link-chip-decorations";

export const LinkChipPreview = Extension.create({
  name: "linkChipPreview",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("linkChipPreview"),
        props: {
          decorations: (state) => buildLinkChipDecorations(state.doc),
        },
      }),
    ];
  },
});
