"use client";

import { Chip, HStack, VStack } from "@trpg/ui";
import { X } from "lucide-react";
import { useState, type KeyboardEvent } from "react";

import { TagInputEditor } from "./tag-input-editor";
import { TagInputFullNote } from "./tag-input-full-note";

export type TagInputProps = {
  id?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  max: number;
  maxLength: number;
  placeholder: string;
  suggestions?: string[];
  // 칩과 입력 칸 앞에 붙는 글자. 저장되는 값에는 들어가지 않는다.
  prefix?: string;
};

export function TagInput({
  id,
  value,
  onChange,
  max,
  maxLength,
  placeholder,
  suggestions = [],
  prefix = "",
}: TagInputProps) {
  const [draft, setDraft] = useState("");
  const isFull = value.length >= max;

  function add(tag: string) {
    const next = tag.trim().slice(0, maxLength);
    if (!next || isFull || value.includes(next)) return;
    onChange([...value, next]);
    setDraft("");
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      // 엔터로 폼이 제출되지 않게 막고 태그만 넣는다.
      event.preventDefault();
      add(draft);
      return;
    }
    if (event.key === "Backspace" && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  const unusedSuggestions = suggestions.filter((suggestion) => !value.includes(suggestion));

  return (
    <VStack gap="100">
      {value.length > 0 && (
        <HStack gap="075" wrap>
          {value.map((tag) => (
            <Chip
              key={tag}
              selected
              className="h-8.5 gap-050"
              aria-label={`${tag} 삭제`}
              onClick={() => onChange(value.filter((item) => item !== tag))}
            >
              {prefix}
              {tag}
              <X size={13} aria-hidden />
            </Chip>
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
          onDraftChange={setDraft}
          onKeyDown={onKeyDown}
          onCommit={() => add(draft)}
          onAdd={add}
        />
      )}
    </VStack>
  );
}
