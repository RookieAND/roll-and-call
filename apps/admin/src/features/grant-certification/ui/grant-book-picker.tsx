"use client";

import { RadioCard, RadioGroup, TextInput, VStack } from "@roll-and-call/ui";
import { useState } from "react";

import { RULEBOOK_KIND_LABEL } from "@/shared/lib";
import type { GrantOptions } from "@/shared/server";

interface GrantBookPickerProps {
  books: GrantOptions["books"];
  value: string | null;
  disabled: boolean;
  onChange: (bookId: string) => void;
}

// 인증이 필요한 책만 고른다. 책이 많아 목록 안에서만 거른다.
export function GrantBookPicker({ books, value, disabled, onChange }: GrantBookPickerProps) {
  const [query, setQuery] = useState("");
  const keyword = query.trim().toLowerCase();
  const shown = books.filter(
    (book) =>
      book.certRequired &&
      (!keyword || `${book.category} ${book.label}`.toLowerCase().includes(keyword)),
  );
  return (
    <VStack gap="100">
      <TextInput
        type="search"
        placeholder="룰북 이름이나 판본 검색"
        aria-label="룰북 이름이나 판본 검색"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <RadioGroup
        value={value ?? ""}
        disabled={disabled}
        onValueChange={(next) => onChange(String(next))}
        aria-label="인증할 룰북"
        className="grid max-h-[320px] grid-cols-1 gap-075 overflow-y-auto"
      >
        {shown.map((book) => (
          <RadioCard.Root key={book.id} value={book.id}>
            <RadioCard.Title>{book.label}</RadioCard.Title>
            <RadioCard.Description>{RULEBOOK_KIND_LABEL[book.kind]}</RadioCard.Description>
            <RadioCard.Indicator />
          </RadioCard.Root>
        ))}
      </RadioGroup>
    </VStack>
  );
}
