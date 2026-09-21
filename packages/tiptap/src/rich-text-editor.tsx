"use client";

import { CharacterCount, Placeholder } from "@tiptap/extensions";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { cn, textFieldVariants } from "@trpg/ui";

import { toRichTextDoc } from "./rich-text-doc";
import { RichTextMenu } from "./rich-text-menu";
import { Spoiler } from "./spoiler";

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
        heading: false,
        blockquote: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
        underline: false,
        link: { openOnClick: false, protocols: ["http", "https"] },
      }),
      Spoiler,
      CharacterCount.configure({ limit }),
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    content: toRichTextDoc(value),
    editorProps: { attributes: id ? { class: EDITOR_CLASS, id } : { class: EDITOR_CLASS } },
    onUpdate: ({ editor }) => onChange(JSON.stringify(editor.getJSON())),
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
