import { Text, VStack, cn } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { BadgeMedal } from "@/entities/badge";
import { BadgeDetailSheet } from "@/features/view-badge";

import type { DexMedal } from "../model/dex-medal";

interface DexMedalTileProps {
  medal: DexMedal;
  bordered?: boolean;
  caption?: string;
  children?: ReactNode;
}

// 메달 + 이름 + 조건 한 칸. 누르면 그 단계의 상세 시트가 열린다.
export function DexMedalTile({ medal, bordered = false, caption, children }: DexMedalTileProps) {
  const nameForeground = medal.locked ? "hint" : "normal";
  return (
    <BadgeDetailSheet
      detail={medal.detail}
      className={cn(
        "flex w-full min-w-0 flex-col items-center gap-075 text-center",
        bordered && "rounded-600 border border-gray-200 px-075 pt-175 pb-150 hover:bg-gray-50",
      )}
    >
      <BadgeMedal
        emoji={medal.emoji}
        grade={medal.grade}
        locked={medal.locked}
        isNew={medal.isNew}
      />
      <VStack align="center" gap="050" className="w-full">
        <Text
          typography="body4"
          weight="extrabold"
          foreground={nameForeground}
          className="leading-tight [text-wrap:balance]"
        >
          {medal.name}
        </Text>
        <Text typography="body4" foreground="hint" numeric className="leading-none">
          {caption ?? medal.caption}
        </Text>
      </VStack>
      {children}
    </BadgeDetailSheet>
  );
}
