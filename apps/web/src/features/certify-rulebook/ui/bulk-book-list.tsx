"use client";

import { Button, Card, Text, VStack } from "@roll-and-call/ui";
import { useState } from "react";

import type { MyRulebook } from "@/entities/rulebook";

const COLLAPSED_COUNT = 5;

interface BulkBookListProps {
  books: MyRulebook[];
}

export function BulkBookList({ books }: BulkBookListProps) {
  const [expanded, setExpanded] = useState(false);
  const foldable = books.length > COLLAPSED_COUNT;
  const shown = foldable && !expanded ? books.slice(0, COLLAPSED_COUNT) : books;

  return (
    <VStack gap="050">
      <Card.Root padding="none" className="overflow-hidden">
        {shown.map((book) => (
          <VStack
            key={book.id}
            className="min-h-12 justify-center border-t border-gray-100 px-175 py-075 first:border-t-0"
          >
            <Text typography="body3" weight="bold">
              {book.shortName}
            </Text>
            <Text typography="body4" foreground="hint">
              {`${book.categoryName} ${book.edition}`.trim()}
            </Text>
          </VStack>
        ))}
      </Card.Root>
      {foldable && (
        <Button variant="ghost" size="sm" className="w-full" onClick={() => setExpanded(!expanded)}>
          {expanded ? "접기" : `${books.length - COLLAPSED_COUNT}권 더 보기`}
        </Button>
      )}
    </VStack>
  );
}
