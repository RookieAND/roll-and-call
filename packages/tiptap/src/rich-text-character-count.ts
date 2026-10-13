import { CharacterCount } from "@tiptap/extensions";

// 기본 CharacterCount는 칩 같은 잎 노드를 공백 한 글자로 센다. 저장 형식(주소 글자)과 같은 길이로 세야 서버 검증과 한도가 어긋나지 않는다.
export const RichTextCharacterCount = CharacterCount.extend({
  onBeforeCreate(event) {
    this.parent?.(event);
    this.storage.characters = (options) => {
      const node = options?.node ?? this.editor.state.doc;
      return this.options.textCounter(node.textBetween(0, node.content.size));
    };
  },
});
