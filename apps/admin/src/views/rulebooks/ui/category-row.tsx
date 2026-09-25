import { HStack, Table, Text } from "@roll-and-call/ui";

import type { RulebookCategory } from "@/shared/server";

interface CategoryRowProps {
  category: RulebookCategory;
}

// 카테고리 머리 행. 책이 두 권 이상이면 판본별 GM 조건을 함께 적는다.
export function CategoryRow({ category }: CategoryRowProps) {
  const hosting = category.requirements.filter((requirement) => requirement.hosting);
  const condition =
    category.bookCount > 1
      ? `GM 조건 · ${hosting.map((requirement) => `${requirement.label}: ${requirement.requirement}`).join(" / ")}`
      : "";
  return (
    <Table.Row className="bg-(--rc-color-bg-canvas-raised)">
      <Table.Cell>
        <HStack align="baseline" gap="100">
          <Text typography="body3" weight="bold" truncate>
            {category.name}
          </Text>
          <Text typography="body4" foreground="hint" className="shrink-0">
            {category.bookCount}권
          </Text>
        </HStack>
      </Table.Cell>
      <Table.Cell colSpan={2} />
      <Table.Cell colSpan={5}>
        <Text typography="body4" foreground="hint" truncate title={condition || undefined}>
          {condition}
        </Text>
      </Table.Cell>
    </Table.Row>
  );
}
