"use client";

import { cn, textFieldVariants } from "@roll-and-call/ui";
import { Placeholder } from "@tiptap/extensions";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { chipifyRichTextDoc } from "./chipify-rich-text-doc";
import { LinkChip } from "./link-chip-node";
import { RichTextCharacterCount } from "./rich-text-character-count";
import { toRichTextDoc, type RichTextDoc } from "./rich-text-doc";
import { RichTextMenu } from "./rich-text-menu";
import { Spoiler } from "./spoiler";
import { unchipifyRichTextDoc } from "./unchipify-rich-text-doc";

const EDITOR_CLASS = "rich-text min-h-24 py-125 outline-none";

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  limit?: number;
  invalid?: boolean;
  placeholder?: string;
  id?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  limit,
  invalid,
  placeholder,
  id,
  className,
}: RichTextEditorProps) {
  // 마운트 뒤에는 에디터가 값을 소유한다. value는 초기값으로만 읽는다.
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        // 디스코드가 그리는 서식은 모두 쓴다. 제목(#)과 구분선은 후기·개요에 필요 없어 뺀다.
        heading: false,
        horizontalRule: false,
        link: { openOnClick: false, protocols: ["http", "https"] },
      }),
      Spoiler,
      LinkChip,
      RichTextCharacterCount.configure({ limit }),
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    content: chipifyRichTextDoc(toRichTextDoc(value)),
    editorProps: { attributes: id ? { class: EDITOR_CLASS, id } : { class: EDITOR_CLASS } },
    onUpdate: ({ editor: updated }) =>
      onChange(JSON.stringify(unchipifyRichTextDoc(updated.getJSON() as RichTextDoc))),
  });

  if (!editor) return null;

  return (
    <>
      <RichTextMenu editor={editor} />
      <EditorContent
        editor={editor}
        className={cn(textFieldVariants({ invalid }), "px-150", className)}
      />
    </>
  );
}
