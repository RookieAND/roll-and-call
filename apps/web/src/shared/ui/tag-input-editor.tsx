"use client";

import { Chip, HStack, TextInput } from "@trpg/ui";
import type { KeyboardEvent } from "react";

interface TagInputEditorProps {
  id?: string;
  draft: string;
  placeholder?: string;
  maxLength?: number;
  suggestions: string[];
  onDraftChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onCommit: () => void;
  onAdd: (value: string) => void;
}

export function TagInputEditor({
  id,
  draft,
  placeholder,
  maxLength,
  suggestions,
  onDraftChange,
  onKeyDown,
  onCommit,
  onAdd,
}: TagInputEditorProps) {
  return (
    <>
      <TextInput
        id={id}
        value={draft}
        placeholder={placeholder}
        maxLength={maxLength}
        enterKeyHint="done"
        onChange={(event) => onDraftChange(event.target.value)}
        onKeyDown={onKeyDown}
        onBlur={onCommit}
      />
      {suggestions.length > 0 && (
        <HStack gap="075" wrap>
          {suggestions.map((suggestion) => (
            <Chip key={suggestion} className="h-8" onClick={() => onAdd(suggestion)}>
              {suggestion}
            </Chip>
          ))}
        </HStack>
      )}
    </>
  );
}
