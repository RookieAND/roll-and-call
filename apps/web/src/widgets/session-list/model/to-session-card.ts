import { SESSION_ROLE, type SessionRole } from "@/entities/game";

import { deriveSessionFacts } from "./derive-session-facts";
import type { SessionCardModel, SessionContext, SessionGame } from "./session-card-model";
import { toHostedSessionCard } from "./to-hosted-session-card";
import { toJoinedSessionCard } from "./to-joined-session-card";
import { toPastSessionCard } from "./to-past-session-card";

export function toSessionCard(
  game: SessionGame,
  role: SessionRole,
  context: SessionContext,
): SessionCardModel {
  const facts = deriveSessionFacts(game, role, context);
  if (facts.past) return toPastSessionCard(game, facts);
  if (role === SESSION_ROLE.host) return toHostedSessionCard(game, facts, context);
  return toJoinedSessionCard(game, facts, context);
}
