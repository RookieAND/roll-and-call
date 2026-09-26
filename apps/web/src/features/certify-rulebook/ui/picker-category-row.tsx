import { Badge, HStack, Text, VStack } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

import type { PickerCategory } from "../model/picker-categories";

interface PickerCategoryRowProps {
  category: PickerCategory;
  onPick: () => void;
}

export function PickerCategoryRow({ category, onPick }: PickerCategoryRowProps) {
  return (
    // ponytail: 두 줄 정보를 담은 목록 행이라 Button 모양 대신 손으로 둔다.
    <button
      type="button"
      onClick={onPick}
      className="group flex min-h-[60px] w-full items-center gap-150 border-b border-gray-200 py-100 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
    >
      <VStack gap="025" className="min-w-0 flex-1">
        <HStack align="center" gap="075" wrap>
          <Text typography="body2" weight="bold">
            {category.name}
          </Text>
          {category.aliases.map((alias) => (
            <Badge key={alias}>{alias}</Badge>
          ))}
        </HStack>
        <Text typography="body4" foreground="muted">
          {category.meta}
        </Text>
      </VStack>
      <ChevronRight
        size={16}
        aria-hidden
        className="flex-none text-hint transition-colors group-hover:text-gray-600"
      />
    </button>
  );
}
