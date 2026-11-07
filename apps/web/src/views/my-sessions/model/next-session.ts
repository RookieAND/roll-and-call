import { isNull, minBy } from "es-toolkit";

import type { SessionCardModel } from "@/widgets/session-list";

type NextSessionCard = Pick<SessionCardModel, "title" | "startsAt" | "cancelled">;

export function nextSession<Card extends NextSessionCard>({
  cards,
  now,
}: {
  cards: readonly Card[];
  now: Date;
}): Card | undefined {
  const upcoming = cards.filter(
    (card) => !card.cancelled && !isNull(card.startsAt) && new Date(card.startsAt) > now,
  );
  return minBy(upcoming, (card) => new Date(card.startsAt!).getTime());
}
