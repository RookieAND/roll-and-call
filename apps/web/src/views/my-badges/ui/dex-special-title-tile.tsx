import { Text } from "@roll-and-call/ui";

import { BadgeMedal } from "@/entities/badge";
import { BadgeDetailSheet } from "@/features/view-badge";

import type { SpecialTitle } from "../model/special-titles";

interface DexSpecialTitleTileProps {
  title: SpecialTitle;
}

export function DexSpecialTitleTile({ title }: DexSpecialTitleTileProps) {
  return (
    <BadgeDetailSheet
      detail={title.detail}
      className="flex w-full min-w-0 flex-col items-center gap-100 rounded-500 bg-gray-50 px-025 pt-150 pb-125 text-center hover:bg-gray-100"
    >
      <BadgeMedal emoji={title.emoji} look={title.look} isNew={title.isNew} />
      <Text typography="body4" weight="bold" truncate className="w-full px-025">
        {title.name}
      </Text>
    </BadgeDetailSheet>
  );
}
