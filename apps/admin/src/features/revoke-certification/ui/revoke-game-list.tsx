import { Text, VStack } from "@roll-and-call/ui";

import { formatSessionTime } from "@/shared/lib";
import type { RevokeTarget } from "@/shared/server";

interface RevokeGameListProps {
  games: RevokeTarget["games"];
}

// 고르거나 뺄 수 없는 목록이다. 줄이 많으면 높이를 고정하고 스크롤한다(D292).
export function RevokeGameList({ games }: RevokeGameListProps) {
  return (
    <VStack
      render={<section aria-label="취소되는 구인" />}
      className="overflow-hidden rounded-400 border border-danger-600"
    >
      <Text
        typography="body3"
        weight="bold"
        foreground="danger"
        className="bg-(--rc-color-bg-danger-weak) px-150 py-100"
      >
        {`취소되는 구인 ${games.length}개`}
      </Text>
      <VStack render={<ul />} className="max-h-[264px] overflow-y-auto">
        {games.map((game) => (
          <VStack
            key={game.sessionId}
            gap="025"
            render={<li />}
            className="border-t border-(--rc-color-border-subtle) px-150 py-100"
          >
            <Text typography="body3" weight="bold" truncate>
              {game.title}
            </Text>
            <Text typography="body4" foreground="hint">
              {[
                `${game.statusLabel} ${game.confirmedCount}/${game.capacity}`,
                game.startsAt ? formatSessionTime(game.startsAt) : "일정 미정",
                `확정자 ${game.confirmedCount}명`,
              ].join(" · ")}
            </Text>
          </VStack>
        ))}
      </VStack>
    </VStack>
  );
}
