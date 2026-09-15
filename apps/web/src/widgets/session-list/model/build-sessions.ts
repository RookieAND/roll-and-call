import { SESSION_ROLE } from "@/entities/game";

import {
  SESSION_BUCKET,
  type MySessions,
  type SessionContext,
  type SessionGame,
} from "./session-card-model";
import { toSessionCard } from "./to-session-card";

export function buildSessions({
  hosted,
  joined,
  ...context
}: SessionContext & { hosted: SessionGame[]; joined: SessionGame[] }): MySessions {
  const cards = [
    ...hosted.map((game) => toSessionCard(game, SESSION_ROLE.host, context)),
    ...joined.map((game) => toSessionCard(game, SESSION_ROLE.player, context)),
  ].toSorted((left, right) => left.sortKey - right.sortKey);

  return {
    joined: cards.filter((card) => card.bucket === SESSION_BUCKET.joined),
    hosted: cards.filter((card) => card.bucket === SESSION_BUCKET.hosted),
    past: cards.filter((card) => card.bucket === SESSION_BUCKET.past),
  };
}
