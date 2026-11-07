import { Text, VStack } from "@roll-and-call/ui";

import { BadgeMedal } from "@/entities/badge";

import type { LockedSpecialTitle } from "../model/special-titles";

interface DexLockedTitleTileProps {
  title: LockedSpecialTitle;
}

export function DexLockedTitleTile({ title }: DexLockedTitleTileProps) {
  return (
    <VStack
      align="center"
      gap="100"
      className="min-w-0 rounded-500 bg-gray-50 px-025 pt-150 pb-125 text-center"
    >
      <BadgeMedal emoji={title.emoji} look={title.look} locked />
      <VStack align="center" gap="050" className="w-full">
        <Text typography="body4" weight="bold" foreground="hint" truncate className="w-full px-025">
          {title.name}
        </Text>
        <Text typography="body4" foreground="hint" className="break-keep">
          {title.condition}
        </Text>
      </VStack>
    </VStack>
  );
}
