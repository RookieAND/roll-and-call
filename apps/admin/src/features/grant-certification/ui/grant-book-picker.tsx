"use client";

import { Checkbox, Chip, Text, TextInput, VStack, cn } from "@roll-and-call/ui";
import { X } from "lucide-react";
import { useState } from "react";

import { RULEBOOK_KIND_LABEL } from "@/shared/lib";
import type { GrantOptions } from "@/shared/server";

import { isBookSelectable, pruneBookSelection } from "../model/grant-book-selection";

interface GrantBookPickerProps {
  books: GrantOptions["books"];
  selectedIds: string[];
  disabled: boolean;
  onChange: (bookIds: string[]) => void;
}

// 인증이 필요한 책만 고른다. 책이 20~30권이 될 수 있어 고른 책은 칩으로 모아 따로 스크롤하고, 목록도 자체 스크롤이다.
// 서플리먼트는 같은 판본의 기본 룰북을 먼저 골라야 고를 수 있다.
export function GrantBookPicker({ books, selectedIds, disabled, onChange }: GrantBookPickerProps) {
  const [query, setQuery] = useState("");
  const keyword = query.trim().toLowerCase();
  const certBooks = books.filter((book) => book.certRequired);
  const selected = certBooks.filter((book) => selectedIds.includes(book.id));
  const shown = certBooks.filter(
    (book) => !keyword || `${book.category} ${book.label}`.toLowerCase().includes(keyword),
  );
  const toggle = (bookId: string, checked: boolean) =>
    onChange(
      pruneBookSelection({
        selectedIds: checked ? [...selectedIds, bookId] : selectedIds.filter((id) => id !== bookId),
        books,
      }),
    );

  return (
    <VStack gap="100">
      {selected.length > 0 ? (
        <ul aria-label="고른 룰북" className="flex max-h-24 flex-wrap gap-075 overflow-y-auto">
          {selected.map((book) => (
            <li key={book.id}>
              <Chip
                selected
                disabled={disabled}
                aria-label={`${book.label} 선택 해제`}
                onClick={() => toggle(book.id, false)}
              >
                {book.label}
                <X size={12} aria-hidden />
              </Chip>
            </li>
          ))}
        </ul>
      ) : null}
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
        {shown.map((book) => {
          const checked = selectedIds.includes(book.id);
          const selectable = isBookSelectable({ book, books, selectedIds });
          return (
            <li
              key={book.id}
              className={cn(
                "border-t border-(--rc-color-border-subtle) px-150 py-100 first:border-t-0",
                checked && "bg-tinted-bg",
                !selectable && "opacity-50",
              )}
            >
              <Checkbox.Field>
                <Checkbox.Root
                  checked={checked}
                  disabled={disabled || !selectable}
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
                      {selectable
                        ? RULEBOOK_KIND_LABEL[book.kind]
                        : `${RULEBOOK_KIND_LABEL[book.kind]} · 기본 룰북을 먼저 골라 주세요`}
                    </Text>
                  </VStack>
                </Checkbox.Label>
              </Checkbox.Field>
            </li>
          );
        })}
        {shown.length === 0 ? (
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
