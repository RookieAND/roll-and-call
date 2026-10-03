import type { BadgeDraw } from "./badge-facts";
import type { BadgeEvent } from "./reached-tier";

export function drawEvents({
  draws,
  matches,
}: {
  draws: BadgeDraw[];
  matches: (draw: BadgeDraw) => boolean;
}): BadgeEvent[] {
  return draws
    .filter(matches)
    .toSorted((left, right) => left.drawnAt.getTime() - right.drawnAt.getTime())
    .map((draw) => ({ at: draw.drawnAt, gameId: draw.gameId }));
}
