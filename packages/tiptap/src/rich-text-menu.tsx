"use client";

import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { cn, IconButton } from "@trpg/ui";
import { Bold, Italic, Link2, List, ListOrdered } from "lucide-react";

import { safeHref } from "./safe-href";

export function RichTextMenu({ editor }: { editor: Editor }) {
  function toggleLink() {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const href = safeHref(window.prompt("링크 주소 (https://...)")?.trim());
    if (href) editor.chain().focus().setLink({ href }).run();
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
    { name: "link", label: "링크", Icon: Link2, run: toggleLink },
  ];

  return (
    <BubbleMenu
      editor={editor}
      className="flex gap-0.5 rounded-lg border border-gray-200 bg-surface p-1 shadow-md"
    >
      {items.map(({ name, label, Icon, run }) => (
        <IconButton
          key={name}
          size="sm"
          aria-label={label}
          className={cn(editor.isActive(name) && "bg-gray-100 text-gray-900")}
          onClick={run}
        >
          <Icon size={16} />
        </IconButton>
      ))}
    </BubbleMenu>
  );
}
