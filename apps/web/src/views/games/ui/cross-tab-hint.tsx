import { Button, Text, VStack } from "@roll-and-call/ui";

import { GAME_TAB, type GamesFilter } from "@/shared/api";
import { ServerLink } from "@/shared/ui";

import { filterParams } from "../lib/filter-params";
import { gamesHref } from "../lib/games-href";

interface CrossTabHintProps {
  filter: GamesFilter;
  otherCount: number;
}

export function CrossTabHint({ filter, otherCount }: CrossTabHintProps) {
  if (!filter.q || otherCount === 0) return null;
  const otherTab = filter.tab === GAME_TAB.past ? GAME_TAB.live : GAME_TAB.past;
  const otherLabel = otherTab === GAME_TAB.past ? "지난 구인" : "진행 중인 구인";

  return (
    <VStack gap="100" className="mt-075 border-t border-gray-200 pt-175">
      <Text typography="body4" foreground="muted">
        {otherLabel}에도 ‘{filter.q}’ {otherCount}건이 있습니다.
      </Text>
      <Button
        render={<ServerLink path={gamesHref(filterParams({ q: filter.q, tab: otherTab }))} />}
        variant="outline"
        className="w-full"
      >
        {otherLabel}에서 보기
      </Button>
    </VStack>
  );
}
