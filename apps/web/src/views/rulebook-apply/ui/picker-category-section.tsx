import { Badge, Card, HStack, Text, VStack } from "@roll-and-call/ui";

import type { MyRulebook } from "@/entities/rulebook";

import { PickerCategoryBooks } from "./picker-category-books";

interface PickerCategorySectionProps {
  name: string;
  books: MyRulebook[];
  rulebooks: MyRulebook[];
  bulk: boolean;
  selectedIds: string[];
  limitReached: boolean;
  onToggle: (rulebookId: string) => void;
}

export function PickerCategorySection({
  name,
  books,
  rulebooks,
  bulk,
  selectedIds,
  limitReached,
  onToggle,
}: PickerCategorySectionProps) {
  const selectedCount = books.filter((book) => selectedIds.includes(book.id)).length;

  return (
    <Card.Root background="subtle" padding="md" render={<section aria-label={name} />}>
      <VStack gap="200">
        <HStack align="center" justify="between" gap="100">
          <Text typography="heading3" render={<h2 />}>
            {name}
          </Text>
          {bulk && selectedCount > 0 && (
            <Badge colorPalette="primary">{`${selectedCount}권 선택`}</Badge>
          )}
        </HStack>
        <PickerCategoryBooks
          books={books}
          rulebooks={rulebooks}
          bulk={bulk}
          selectedIds={selectedIds}
          limitReached={limitReached}
          onToggle={onToggle}
        />
      </VStack>
    </Card.Root>
  );
}
