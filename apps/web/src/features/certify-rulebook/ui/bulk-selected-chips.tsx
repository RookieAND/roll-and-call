import { Card, Chip, HStack, Text, VStack } from "@roll-and-call/ui";
import { X } from "lucide-react";

interface BulkSelectedBook {
  id: string;
  label: string;
}

interface BulkSelectedChipsProps {
  books: BulkSelectedBook[];
  onRemove: (id: string) => void;
}

export function BulkSelectedChips({ books, onRemove }: BulkSelectedChipsProps) {
  return (
    <Card.Root background="subtle" padding="sm">
      <VStack gap="100" className="pl-050">
        <Text typography="body4" weight="bold" foreground="muted">
          고른 책
        </Text>
        <HStack gap="075" wrap>
          {books.map((book) => (
            <Chip
              key={book.id}
              selected
              aria-label={`${book.label} 선택 해제`}
              onClick={() => onRemove(book.id)}
            >
              {book.label}
              <X size={14} aria-hidden />
            </Chip>
          ))}
        </HStack>
      </VStack>
    </Card.Root>
  );
}
