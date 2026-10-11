import { Mark, markInputRule, markPasteRule, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    spoiler: { toggleSpoiler: () => ReturnType };
  }
}

// 디스코드처럼 ||글||을 치면 바로 스포일러 서식으로 바뀌고 ||는 사라진다. 굵게의 **글** 규칙과 같은 모양이다.
export const SPOILER_INPUT_REGEX = /(?:^|\s)(\|\|(?!\s+\|\|)((?:[^|]+))\|\|(?!\s+\|\|))$/;
export const SPOILER_PASTE_REGEX = /(?:^|\s)(\|\|(?!\s+\|\|)((?:[^|]+))\|\|(?!\s+\|\|))/g;

export const Spoiler = Mark.create({
  name: "spoiler",

  parseHTML() {
    return [{ tag: "span[data-spoiler]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes, { "data-spoiler": "", class: "spoiler" }), 0];
  },

  addInputRules() {
    return [markInputRule({ find: SPOILER_INPUT_REGEX, type: this.type })];
  },

  addPasteRules() {
    return [markPasteRule({ find: SPOILER_PASTE_REGEX, type: this.type })];
  },

  addCommands() {
    return {
      toggleSpoiler:
        () =>
        ({ commands }) =>
          commands.toggleMark(this.name),
    };
  },
});
