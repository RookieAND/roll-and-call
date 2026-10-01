import { HStack, Skeleton, Text } from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";

import { GAME_TAB, type GamesFilter } from "@/shared/api";

import { GameSortSheet } from "./game-sort-sheet";

interface GamesResultRowProps {
  filter: GamesFilter;
  count?: number;
}

export function GamesResultRow({ filter, count }: GamesResultRowProps) {
  const label = filter.q ? `검색 결과 ${count}건` : `${count}건`;
  return (
    <HStack align="center" justify="between" className="min-h-5">
      {isUndefined(count) ? (
        <Skeleton width={48} height={18} />
      ) : (
        <Text typography="body4" foreground="muted">
          {label}
        </Text>
      )}
      {filter.tab === GAME_TAB.past ? (
        <Text typography="body4" foreground="hint">
          끝난 날짜순
        </Text>
      ) : (
        <GameSortSheet filter={filter} />
      )}
    </HStack>
  );
}
