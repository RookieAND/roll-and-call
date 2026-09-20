"use client";

import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { cn, IconButton, TextInput } from "@trpg/ui";
import { Bold, Check, EyeOff, Italic, Link2, List, ListOrdered } from "lucide-react";
import { useState } from "react";

import { safeHref } from "./safe-href";

interface RichTextMenuProps {
  editor: Editor;
}

export function RichTextMenu({ editor }: RichTextMenuProps) {
  const [linkDraft, setLinkDraft] = useState<string | null>(null);

  function openLink() {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    setLinkDraft("https://");
  }

  function submitLink() {
    const href = safeHref(linkDraft?.trim());
    if (href) editor.chain().focus().setLink({ href }).run();
    else editor.chain().focus().run();
    setLinkDraft(null);
  }

  const items = [
    {
      name: "bold",
      label: "굵게",
      Icon: Bold,
      run: () => editor.chain().focus().toggleBold().run(),
    },
    {
      name: "italic",
      label: "기울임",
      Icon: Italic,
      run: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      name: "bulletList",
      label: "글머리 목록",
      Icon: List,
      run: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      name: "orderedList",
      label: "번호 목록",
      Icon: ListOrdered,
      run: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      name: "spoiler",
      label: "스포일러 가리기",
      Icon: EyeOff,
      run: () => editor.chain().focus().toggleSpoiler().run(),
    },
    { name: "link", label: "링크", Icon: Link2, run: openLink },
  ];

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor }) => linkDraft !== null || !editor.state.selection.empty}
      className="flex gap-025 rounded-300 border border-gray-200 bg-surface p-050 shadow-md"
    >
      {linkDraft === null ? (
        items.map(({ name, label, Icon, run }) => (
          <IconButton
            key={name}
            size="sm"
            aria-label={label}
            className={cn(editor.isActive(name) && "bg-gray-100 text-gray-900")}
            onClick={run}
          >
            <Icon size={16} />
          </IconButton>
        ))
      ) : (
        <>
          <TextInput
            autoFocus
            aria-label="링크 주소"
            placeholder="https://..."
            className="h-8 w-56 px-100 text-sm"
            value={linkDraft}
            onChange={(event) => setLinkDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                submitLink();
              }
              if (event.key === "Escape") setLinkDraft(null);
            }}
          />
          <IconButton size="sm" aria-label="링크 적용" onClick={submitLink}>
            <Check size={16} />
          </IconButton>
        </>
      )}
    </BubbleMenu>
  );
}
