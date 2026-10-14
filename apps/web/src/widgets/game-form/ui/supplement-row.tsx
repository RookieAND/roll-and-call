import { Badge, HStack, IconButton, Text } from "@roll-and-call/ui";
import { BookPlus, X } from "lucide-react";

import type { SupplementValue } from "@/features/write-game";

interface SupplementRowProps {
  item: SupplementValue;
  onRemove: () => void;
}

export function SupplementRow({ item, onRemove }: SupplementRowProps) {
  const manual = item.rulebookId === null;
  return (
    <HStack align="center" gap="125" render={<li />} className="min-h-12 py-050 pr-050 pl-175">
      <BookPlus size={18} strokeWidth={2.1} aria-hidden className="flex-none text-gray-600" />
      <Text typography="body2" className="min-w-0 flex-1 break-all">
        {item.name}
      </Text>
      {manual && <Badge colorPalette="gray">직접 입력</Badge>}
      <IconButton
        type="button"
        variant="ghost"
        aria-label={`${item.name} 빼기`}
        className="h-11 w-11 text-hint"
        onClick={onRemove}
      >
        <X size={15} strokeWidth={2.6} aria-hidden />
      </IconButton>
    </HStack>
  );
}
