"use client";

import { Badge, Card, Chip, HStack } from "@roll-and-call/ui";
import { useState } from "react";

import type { MyRulebook } from "@/entities/rulebook";

import { bulkBookLabel } from "../model/bulk-book-label";

const COLLAPSED_COUNT = 5;

interface BulkBookListProps {
  books: MyRulebook[];
}

export function BulkBookList({ books }: BulkBookListProps) {
  const [expanded, setExpanded] = useState(false);
  const foldable = books.length > COLLAPSED_COUNT;
  const shown = foldable && !expanded ? books.slice(0, COLLAPSED_COUNT) : books;
  const toggleLabel = expanded ? "접기" : `+${books.length - COLLAPSED_COUNT}`;

  return (
    <Card.Root background="subtle" padding="sm">
      <HStack wrap gap="075" align="center">
        {shown.map((book) => (
          <Badge key={book.id} colorPalette="gray">
            {bulkBookLabel(book)}
          </Badge>
        ))}
        {foldable && (
          <Chip tone="outline" onClick={() => setExpanded(!expanded)}>
            {toggleLabel}
          </Chip>
        )}
      </HStack>
    </Card.Root>
  );
}
