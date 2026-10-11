import { Chip, HStack } from "@roll-and-call/ui";
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
  );
}
