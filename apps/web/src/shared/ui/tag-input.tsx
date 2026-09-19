"use client";

import { Chip, Text, TextInput } from "@trpg/ui";
import { X } from "lucide-react";
import { useState, type KeyboardEvent } from "react";

export type TagInputProps = {
  id?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  max: number;
  maxLength: number;
  placeholder: string;
  suggestions?: string[];
};

export function TagInput({
  id,
  value,
  onChange,
  max,
  maxLength,
  placeholder,
  suggestions = [],
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
    <div className="flex flex-col gap-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <Chip
              key={tag}
              selected
              className="h-8.5 gap-1"
              aria-label={`${tag} 삭제`}
              onClick={() => onChange(value.filter((item) => item !== tag))}
            >
              {tag}
              <X size={13} aria-hidden />
            </Chip>
          ))}
        </div>
      )}

      {isFull ? (
        <Text typography="body4" foreground="hint" render={<p />}>
          {max}개를 모두 채웠습니다. 지우면 더 넣을 수 있습니다.
        </Text>
      ) : (
        <>
          <TextInput
            id={id}
            value={draft}
            placeholder={placeholder}
            maxLength={maxLength}
            enterKeyHint="done"
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onKeyDown}
            onBlur={() => add(draft)}
          />
          {unusedSuggestions.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {unusedSuggestions.map((suggestion) => (
                <Chip key={suggestion} className="h-9.5" onClick={() => add(suggestion)}>
                  {suggestion}
                </Chip>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
