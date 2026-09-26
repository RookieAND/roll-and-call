import { HStack, Table, Text } from "@roll-and-call/ui";
import { BookOpen } from "lucide-react";

import type { RulebookCategory } from "@/shared/server";

interface CategoryRowProps {
  category: RulebookCategory;
}

// 카테고리 머리 행. 단권 룰도 머리 행을 두어 모든 책이 카테고리 아래에 놓인다. GM 조건은 상세의 카테고리 카드에서 본다.
export function CategoryRow({ category }: CategoryRowProps) {
  return (
    <Table.Row className="bg-(--rc-color-bg-canvas-raised)">
      <Table.Cell colSpan={8}>
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
