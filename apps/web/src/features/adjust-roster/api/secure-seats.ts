import "server-only";
import { countParticipants, raiseGameCapacity } from "@roll-and-call/database/games";
import type { Transaction } from "@roll-and-call/database/transaction";
import { isNull } from "es-toolkit";

import { PARTICIPANT_STATUS } from "@/entities/game";
import type { Game } from "@/shared/server";

import type { CapacityAction } from "../model/capacity-action";
import { capacityDecision } from "../model/capacity-decision";
import type { RosterTiming } from "../model/roster-timing";
import { RosterError } from "./roster-error";

// 넣을 자리를 확인하고, 세션 시작 뒤 정원 +1이면 같은 트랜잭션에서 늘린다. 늘렸으면 true.
export async function secureSeats({
  transaction,
  game,
  timing,
  action,
  addingCount,
  raiseCapacity,
}: {
  transaction: Transaction;
  game: Game;
  timing: RosterTiming;
  action: CapacityAction;
  addingCount: number;
  raiseCapacity: boolean;
}) {
  const confirmedCount = await countParticipants({
    transaction,
    serverId: game.serverId,
    gameId: game.id,
    status: PARTICIPANT_STATUS.confirmed,
  });
  const decision = capacityDecision({
    action,
    started: timing.started,
    confirmedCount,
    maxPlayers: game.maxPlayers,
    addingCount,
    raiseCapacity,
    alreadyRaised: !isNull(game.capacityRaisedAt),
  });
  if ("error" in decision) throw new RosterError(decision.error);
  if (!decision.raise) return { raised: false, confirmedCount, maxPlayers: game.maxPlayers };

  const raised = await raiseGameCapacity({
    transaction,
    serverId: game.serverId,
    gameId: game.id,
    at: timing.now,
  });
  if (!raised) throw new RosterError("이미 정원을 한 번 늘렸습니다.");
  return { raised: true, confirmedCount, maxPlayers: game.maxPlayers + 1 };
}
