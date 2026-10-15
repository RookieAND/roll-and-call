"use client";

import { Checkbox, Text, TextInput, VStack, cn } from "@roll-and-call/ui";
import { useState } from "react";

import type { GrantOptions } from "@/entities/cert/server";
import { RULEBOOK_KIND_LABEL } from "@/entities/rulebook";

import { isBookSelectable } from "../model/grant-book-selection";
import { GrantSelectedChips } from "./grant-selected-chips";

interface GrantBookPickerProps {
  books: GrantOptions["books"];
  selectedIds: string[];
  disabled: boolean;
  onChange: (bookIds: string[]) => void;
}

// 인증이 필요한 책만 고른다. 책이 20~30권이 될 수 있어 고른 책은 칩으로 모아 3줄을 넘으면 「+N」으로 접고, 목록은 자체 스크롤이다.
// 서플리먼트는 같은 판본의 기본 룰북을 먼저 골라야 고를 수 있다.
export function GrantBookPicker({ books, selectedIds, disabled, onChange }: GrantBookPickerProps) {
  const [query, setQuery] = useState("");
  const keyword = query.trim().toLowerCase();
  const certBooks = books.filter((book) => book.certRequired);
  const selected = certBooks.filter((book) => selectedIds.includes(book.id));
  // 고른 책은 위 묶음에만 보이고 아래 목록에서는 뺀다. 해제하면 아래 목록으로 돌아간다.
  const shown = certBooks.filter(
    (book) =>
      !selectedIds.includes(book.id) &&
      (!keyword || `${book.category} ${book.label}`.toLowerCase().includes(keyword)),
  );
  const toggle = (bookId: string, checked: boolean) =>
    onChange(checked ? [...selectedIds, bookId] : selectedIds.filter((id) => id !== bookId));

  return (
    <VStack gap="100">
      {selected.length > 0 ? (
        <GrantSelectedChips
          noun="룰북"
          unit="권"
          items={selected}
          disabled={disabled}
          onRemove={(bookId) => toggle(bookId, false)}
        />
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
          const selectable = isBookSelectable({ book, books, selectedIds });
          return (
            <li
              key={book.id}
              className={cn(
                "border-t border-(--rc-color-border-subtle) px-150 py-100 first:border-t-0",
                !selectable && "opacity-50",
              )}
            >
              <Checkbox.Field>
                <Checkbox.Root
                  checked={false}
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
              {keyword ? "검색한 룰북이 없습니다." : "고를 수 있는 룰북을 모두 골랐습니다."}
            </Text>
          </li>
        ) : null}
      </ul>
    </VStack>
  );
}
