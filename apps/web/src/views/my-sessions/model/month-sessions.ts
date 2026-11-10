import { toKst } from "@/shared/lib";
import type { SessionCardModel } from "@/widgets/session-list";

type CalendarCard = Pick<SessionCardModel, "startsAt" | "cancelled" | "hidden" | "chip">;

export function monthSessions<Card extends CalendarCard>({
  cards,
  now,
}: {
  cards: readonly Card[];
  now: Date;
}): Card[] {
  const month = toKst(now).format("YYYY-MM");
  return cards
    .filter((card) => {
      if (
        card.cancelled ||
        card.hidden ||
        !card.startsAt ||
        card.chip === "waiting" ||
        card.chip === "ended"
      )
        return false;
      const start = new Date(card.startsAt);
      return start >= now && toKst(start).format("YYYY-MM") === month;
    })
    .toSorted((a, b) => new Date(a.startsAt!).getTime() - new Date(b.startsAt!).getTime());
}
