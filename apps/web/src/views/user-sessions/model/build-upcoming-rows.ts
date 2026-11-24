import { sortBy } from "es-toolkit";

import { GAME_STATUS, plannedEndAt, type SessionGame } from "@/entities/game";
import type { SessionCardModel } from "@/widgets/session-list";

import { isUpcomingCard } from "./is-upcoming-card";
import type { UpcomingRow } from "./upcoming-row";

const UNDATED_LAST = Number.POSITIVE_INFINITY;

// 가린 카드(숨김 구인)는 제목이 비어 있어 예정 목록에서 뺀다. 일정이 없는 줄은 맨 뒤로 보낸다.
export function buildUpcomingRows({
  cards,
  games,
  now,
}: {
  cards: readonly SessionCardModel[];
  games: readonly SessionGame[];
  now: Date;
}): UpcomingRow[] {
  const rows = cards.flatMap((card): UpcomingRow[] => {
    if (card.hidden || !isUpcomingCard({ card, now })) return [];
    const game = games.find((candidate) => candidate.id === card.id);
    if (!game) return [];
    const startsAt = card.startsAt ? new Date(card.startsAt) : null;
    return [
      {
        id: card.id,
        title: card.title,
        rule: game.rule,
        roundCount: game.roundCount,
        startsAt,
        endsAt: startsAt && plannedEndAt({ confirmedAt: startsAt, playMinutes: game.playMinutes }),
        recruiting: card.content?.capacity.status === GAME_STATUS.recruiting,
        thumbnailUrl: card.thumbnailUrl,
        thumbnailSpoiler: card.thumbnailSpoiler,
      },
    ];
  });
  return sortBy(rows, [(row) => row.startsAt?.getTime() ?? UNDATED_LAST]);
}
