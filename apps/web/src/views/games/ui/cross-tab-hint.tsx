import { Button, Text, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import { filterParams, gamesHref } from "@/features/filter-games";
import { GAME_TAB, type GamesFilter } from "@/shared/api";

interface CrossTabHintProps {
  filter: GamesFilter;
  otherCount: number;
}

// 검색은 지금 탭 안에서만 찾는다. 다른 탭에도 결과가 있으면 끝에서 알린다.
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
        render={<Link href={gamesHref(filterParams({ q: filter.q, tab: otherTab }))} />}
        variant="outline"
        className="w-full"
      >
        {otherLabel}에서 보기
      </Button>
    </VStack>
  );
}
