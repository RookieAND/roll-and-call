"use client";

import { Button, Checkbox, HStack, Sheet, Text, TextInput, VStack, cn } from "@roll-and-call/ui";
import { useState } from "react";

import type { GrantOptions } from "@/entities/cert/server";
import { RULEBOOK_KIND_LABEL } from "@/entities/rulebook";

import { isBookSelectable } from "../model/grant-book-selection";
import { MobilePickTrigger } from "./mobile-pick-trigger";

interface MobileGrantBookSheetProps {
  books: GrantOptions["books"];
  selectedIds: string[];
  disabled: boolean;
  onChange: (bookIds: string[]) => void;
}

// 시트 안에서만 검색하고 스크롤한다. [선택 완료]를 눌러야 화면의 선택이 바뀐다.
export function MobileGrantBookSheet({
  books,
  selectedIds,
  disabled,
  onChange,
}: MobileGrantBookSheetProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(selectedIds);
  const [query, setQuery] = useState("");
  const keyword = query.trim().toLowerCase();
  const shown = books.filter(
    (book) =>
      book.certRequired &&
      (!keyword || `${book.category} ${book.label}`.toLowerCase().includes(keyword)),
  );
  const toggle = (bookId: string, checked: boolean) =>
    setDraft(checked ? [...draft, bookId] : draft.filter((id) => id !== bookId));

  return (
    <Sheet.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) return;
        setDraft(selectedIds);
        setQuery("");
      }}
    >
      <MobilePickTrigger
        label={selectedIds.length > 0 ? "룰북 더 고르기" : "룰북 고르기"}
        description="인증이 필요한 책 중에서 고릅니다"
        disabled={disabled}
      />
      <Sheet.Popup className="px-200 pt-100">
        <Sheet.Handle />
        <Sheet.Title className="text-heading3">인증할 룰북 고르기</Sheet.Title>
        <VStack gap="100" className="min-h-0">
          <TextInput
            type="search"
            inputMode="search"
            enterKeyHint="search"
            placeholder="룰북 이름이나 판본 검색"
            aria-label="룰북 이름이나 판본 검색"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <VStack
            render={<ul aria-label="인증할 룰북" />}
            className="max-h-75 overflow-y-auto rounded-600 border border-gray-200 bg-surface"
          >
            {shown.map((book) => {
              const checked = draft.includes(book.id);
              const selectable = isBookSelectable({ book, books, selectedIds: draft });
              return (
                <li
                  key={book.id}
                  className={cn(
                    "border-t border-(--rc-color-border-subtle) px-150 first:border-t-0",
                    checked && "bg-tinted-bg",
                    !selectable && "opacity-50",
                  )}
                >
                  <Checkbox.Field className="min-h-14 w-full gap-150">
                    <Checkbox.Root
                      checked={checked}
                      disabled={!selectable && !checked}
                      onCheckedChange={(next) => toggle(book.id, next)}
                    >
                      <Checkbox.Indicator />
                    </Checkbox.Root>
                    <Checkbox.Label className="flex-1 py-100">
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
          </VStack>
        </VStack>
        <Sheet.Footer>
          <HStack gap="100">
            <Sheet.Close
              render={<Button variant="outline" colorPalette="gray" className="min-h-12 flex-1" />}
            >
              취소
            </Sheet.Close>
            <Button
              className="min-h-12 flex-1"
              onClick={() => {
                onChange(draft);
                setOpen(false);
              }}
            >
              선택 완료
            </Button>
          </HStack>
        </Sheet.Footer>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
