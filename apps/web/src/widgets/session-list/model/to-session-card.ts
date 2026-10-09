import { isNil } from "es-toolkit";

import { SESSION_ROLE, type SessionRole } from "@/entities/game";
import { canReopenGame } from "@/features/reopen-game";

import { deriveSessionFacts } from "./derive-session-facts";
import type { SessionCardModel, SessionContext, SessionGame } from "./session-card-model";
import { toCancelledSessionCard } from "./to-cancelled-session-card";
import { toHostedSessionCard } from "./to-hosted-session-card";
import { toJoinedSessionCard } from "./to-joined-session-card";
import { toPastSessionCard } from "./to-past-session-card";

export function toSessionCard({
  game,
  role,
  context,
}: {
  game: SessionGame;
  role: SessionRole;
  context: SessionContext;
}): SessionCardModel {
  const card = buildSessionCard({ game, role, context });
  const canReopen = canReopenGame({
    game,
    userId: context.viewerId,
    serverId: game.serverId,
    now: context.now,
  });
  return canReopen ? { ...card, canReopen } : card;
}

function buildSessionCard({
  game,
  role,
  context,
}: {
  game: SessionGame;
  role: SessionRole;
  context: SessionContext;
}): SessionCardModel {
  const { cancelledAt } = game;
  if (!isNil(cancelledAt)) return toCancelledSessionCard({ game, role, cancelledAt });
  const facts = deriveSessionFacts({ game, role, context });
  if (facts.past) return toPastSessionCard({ game, facts, context });
  if (role === SESSION_ROLE.host) return toHostedSessionCard({ game, facts, context });
  return toJoinedSessionCard({ game, facts, context });
}
