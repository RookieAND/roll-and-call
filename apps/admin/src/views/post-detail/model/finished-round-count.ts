import type { AdminRound } from "./admin-rounds";
import { ROUND_STATUS, roundStatusOf } from "./round-status";

export function finishedRoundCount({ rounds, now }: { rounds: AdminRound[]; now: Date }) {
  return rounds.filter((round) => roundStatusOf({ round, now }) === ROUND_STATUS.ended).length;
}
