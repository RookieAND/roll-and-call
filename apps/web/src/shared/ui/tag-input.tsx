"use client";

import { HStack, Text, VStack } from "@roll-and-call/ui";
import { uniq } from "es-toolkit";
import { useState, type KeyboardEvent } from "react";

import { NoticeTagChip } from "./notice-tag-chip";
import { TagChip } from "./tag-chip";
import { TagInputEditor } from "./tag-input-editor";
import { TagInputFullNote } from "./tag-input-full-note";

export interface TagInputProps {
  id?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  max: number;
  maxLength: number;
  placeholder: string;
  suggestions?: string[];
  // 칩과 입력 칸 앞에 붙는 글자. 저장되는 값에는 들어가지 않는다.
  prefix?: string;
  tone?: "primary" | "notice";
  // 쉼표나 띄어쓰기를 치면 그 앞까지를 태그로 끊는다.
  delimited?: boolean;
  hint?: string;
  // 입력 칸에 글자가 있는 동안 hint 대신 보인다.
  typingHint?: string;
}

export function TagInput({
  id,
  value,
  onChange,
  max,
  maxLength,
  placeholder,
  suggestions = [],
  prefix = "",
  tone = "primary",
  delimited = false,
  hint,
  typingHint,
}: TagInputProps) {
  const [draft, setDraft] = useState("");
  const isFull = value.length >= max;

  function add(tag: string) {
    const next = tag.trim().slice(0, maxLength);
    if (!next || isFull || value.includes(next)) return;
    onChange([...value, next]);
    setDraft("");
  }

  function changeDraft(next: string) {
    if (!delimited || !/[,\s]/.test(next)) {
      setDraft(next);
      return;
    }
    const pieces = next.split(/[,\s]+/);
    const rest = pieces.pop() ?? "";
    const added = uniq(pieces.map((piece) => piece.slice(0, maxLength)).filter(Boolean)).filter(
      (piece) => !value.includes(piece),
    );
    if (added.length > 0) onChange([...value, ...added].slice(0, max));
    setDraft(rest);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      add(draft);
      return;
    }
    if (event.key === "Backspace" && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  const unusedSuggestions = suggestions.filter((suggestion) => !value.includes(suggestion));
  const TagChipOf = tone === "notice" ? NoticeTagChip : TagChip;

  return (
    <VStack gap="100">
      {value.length > 0 && (
        <HStack gap="075" wrap>
          {value.map((tag) => (
            <TagChipOf
              key={tag}
              label={tag}
              onRemove={() => onChange(value.filter((item) => item !== tag))}
            >
              {prefix}
              {tag}
            </TagChipOf>
          ))}
        </HStack>
      )}

      {isFull ? (
        <TagInputFullNote max={max} />
      ) : (
        <TagInputEditor
          id={id}
          draft={draft}
          placeholder={placeholder}
          maxLength={maxLength}
          suggestions={unusedSuggestions}
          onDraftChange={changeDraft}
          onKeyDown={onKeyDown}
          onCommit={() => add(draft)}
          onAdd={add}
        />
      )}
      {hint && (
        <Text typography="body4" foreground="hint" render={<p />}>
          {draft && typingHint ? typingHint : hint}
        </Text>
      )}
    </VStack>
  );
}
