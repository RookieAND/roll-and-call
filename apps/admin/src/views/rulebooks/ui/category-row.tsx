import { HStack, Table, Text } from "@roll-and-call/ui";
import { BookOpen } from "lucide-react";

import type { RulebookCategory } from "@/shared/server";

interface CategoryRowProps {
  category: RulebookCategory;
}

export function CategoryRow({ category }: CategoryRowProps) {
  return (
    <Table.Row className="bg-(--rc-color-bg-canvas-raised)">
      <Table.Cell colSpan={4}>
        <HStack align="center" gap="075">
          <BookOpen size={16} aria-hidden className="shrink-0 text-gray-600" />
          <Text typography="body3" weight="bold" truncate>
            {category.name}
          </Text>
          <Text typography="body4" foreground="hint" className="shrink-0">
            {category.bookCount}권
          </Text>
        </HStack>
      </Table.Cell>
    </Table.Row>
  );
}
