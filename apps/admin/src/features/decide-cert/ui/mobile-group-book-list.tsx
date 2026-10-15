"use client";

import { Button, HStack, Text, VStack } from "@roll-and-call/ui";
import { useState } from "react";

import type { GroupBook } from "../model/group-book";
import { pendingGroupBooks } from "../model/group-selection";
import { MobileGroupBookRow } from "./mobile-group-book-row";

const PREVIEW_COUNT = 3;

interface MobileGroupBookListProps {
  books: GroupBook[];
  rejectedIds: string[];
  disabled: boolean;
  approveCount: number;
  rejectCount: number;
  onRejectedChange: (params: { bookApplicationId: string; rejected: boolean }) => void;
  onSetAll: (rejected: boolean) => void;
}

// 처음 3권과 반려·처리된 책만 보이고, 나머지는 「모두 보기」로 펼친다.
export function MobileGroupBookList({
  books,
  rejectedIds,
  disabled,
  approveCount,
  rejectCount,
  onRejectedChange,
  onSetAll,
}: MobileGroupBookListProps) {
  const [open, setOpen] = useState(false);
  const pendingCount = pendingGroupBooks(books).length;
  const pinned = (book: GroupBook, index: number) =>
    index < PREVIEW_COUNT || rejectedIds.includes(book.applicationId) || book.status !== "pending";
  const visible = open ? books : books.filter(pinned);
  const hiddenCount = books.length - visible.length;

  return (
    <VStack
      render={<section aria-label="함께 신청한 책" />}
      className="overflow-hidden rounded-600 border border-gray-200 bg-surface"
    >
      <VStack gap="025" className="border-b border-(--rc-color-border-subtle) px-150 pt-150 pb-125">
        <Text typography="heading3" render={<h2 />}>
          {`함께 신청한 책 ${books.length}권`}
        </Text>
        <Text typography="body4" foreground="muted" className="break-keep">
          책마다 승인할지 반려할지 정해 주세요. 사진에서 제목이 확인된 책만 승인합니다.
        </Text>
        <HStack gap="100" className="mt-075">
          <Button
            variant="outline"
            colorPalette="gray"
            size="sm"
            disabled={disabled || approveCount === pendingCount}
            onClick={() => onSetAll(false)}
            className="min-h-11 flex-1"
          >
            모두 승인
          </Button>
          <Button
            variant="outline"
            colorPalette="danger"
            size="sm"
            disabled={disabled || rejectCount === pendingCount}
            onClick={() => onSetAll(true)}
            className="min-h-11 flex-1"
          >
            모두 반려
          </Button>
        </HStack>
      </VStack>
      <VStack>
        {visible.map((book) => (
          <MobileGroupBookRow
            key={book.applicationId}
            book={book}
            rejected={rejectedIds.includes(book.applicationId)}
            disabled={disabled}
            onRejectedChange={(rejected) =>
              onRejectedChange({ bookApplicationId: book.applicationId, rejected })
            }
          />
        ))}
      </VStack>
      {hiddenCount > 0 ? (
        <HStack
          align="center"
          gap="100"
          className="min-h-13 border-t border-(--rc-color-border-subtle) pr-050 pl-150"
        >
          <Text typography="body4" foreground="muted" className="flex-1">
            {`나머지 ${hiddenCount}권은 승인으로 둡니다`}
          </Text>
          <Button
            variant="ghost"
            colorPalette="primary"
            onClick={() => setOpen(true)}
            className="min-h-11"
          >
            모두 보기
          </Button>
        </HStack>
      ) : null}
    </VStack>
  );
}
