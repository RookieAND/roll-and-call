"use client";

import { Checkbox, Text, TextInput, VStack, cn } from "@roll-and-call/ui";
import { useState } from "react";

import { RULEBOOK_KIND_LABEL } from "@/shared/lib";
import type { GrantOptions } from "@/shared/server";

interface GrantBookPickerProps {
  books: GrantOptions["books"];
  selectedIds: string[];
  disabled: boolean;
  onChange: (bookIds: string[]) => void;
}

// 인증이 필요한 책만 고른다. 책이 많아 목록 안에서만 거르고, 고른 책은 검색어와 상관없이 목록 위에 남는다.
export function GrantBookPicker({ books, selectedIds, disabled, onChange }: GrantBookPickerProps) {
  const [query, setQuery] = useState("");
  const keyword = query.trim().toLowerCase();
  const certBooks = books.filter((book) => book.certRequired);
  const selected = certBooks.filter((book) => selectedIds.includes(book.id));
  const found = certBooks.filter(
    (book) =>
      !selectedIds.includes(book.id) &&
      (!keyword || `${book.category} ${book.label}`.toLowerCase().includes(keyword)),
  );
  const toggle = (bookId: string, checked: boolean) =>
    onChange(checked ? [...selectedIds, bookId] : selectedIds.filter((id) => id !== bookId));

  return (
    <VStack gap="100">
      <TextInput
        type="search"
        placeholder="룰북 이름이나 판본 검색"
        aria-label="룰북 이름이나 판본 검색"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <ul
        aria-label="인증할 룰북"
        className="max-h-80 overflow-y-auto rounded-400 border border-gray-200 bg-surface"
      >
        {[...selected, ...found].map((book) => {
          const checked = selectedIds.includes(book.id);
          return (
            <li
              key={book.id}
              className={cn(
                "border-t border-(--rc-color-border-subtle) px-150 py-100 first:border-t-0",
                checked && "bg-tinted-bg",
              )}
            >
              <Checkbox.Field>
                <Checkbox.Root
                  checked={checked}
                  disabled={disabled}
                  onCheckedChange={(next) => toggle(book.id, next)}
                >
                  <Checkbox.Indicator />
                </Checkbox.Root>
                <Checkbox.Label>
                  <VStack render={<span />}>
                    <Text typography="body3" weight="bold">
                      {book.label}
                    </Text>
                    <Text typography="body4" foreground="hint">
                      {RULEBOOK_KIND_LABEL[book.kind]}
                    </Text>
                  </VStack>
                </Checkbox.Label>
              </Checkbox.Field>
            </li>
          );
        })}
        {selected.length + found.length === 0 ? (
          <li className="px-150 py-200">
            <Text typography="body4" foreground="hint">
              검색한 룰북이 없습니다.
            </Text>
          </li>
        ) : null}
      </ul>
    </VStack>
  );
}
