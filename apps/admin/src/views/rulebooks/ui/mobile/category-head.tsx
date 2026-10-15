import { HStack, Text } from "@roll-and-call/ui";
import { BookOpen } from "lucide-react";

import type { RulebookCategory } from "@/entities/rulebook/server";

interface CategoryHeadProps {
  category: RulebookCategory;
}

export function CategoryHead({ category }: CategoryHeadProps) {
  return (
    <HStack
      align="center"
      gap="075"
      className="border-b border-(--rc-color-border-subtle) bg-(--rc-color-bg-canvas-raised) px-200 py-100"
    >
      <BookOpen size={16} aria-hidden className="shrink-0 text-gray-600" />
      <Text typography="body3" weight="bold" truncate>
        {category.name}
      </Text>
      <Text typography="body4" foreground="hint" className="shrink-0">
        {category.bookCount}권
      </Text>
    </HStack>
  );
}
