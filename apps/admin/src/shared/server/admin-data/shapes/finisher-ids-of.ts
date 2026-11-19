import type { Game } from "@roll-and-call/database";
import { isFinisher } from "@roll-and-call/database/games/model";

interface RosterRow {
  userId: string;
  status: "confirmed" | "waiting" | "removed";
  lateJoined: boolean;
  leftReason: string | null;
}

// 다회차 구인의 참여 세션은 완주자만 센다. 단발은 쓰지 않는 값이라 undefined다.
export function finisherIdsOf({
  game,
  roster,
}: {
  game: Pick<Game, "roundCount" | "finishedAt" | "cancelledAt">;
  roster: readonly RosterRow[];
}): string[] | undefined {
  if (game.roundCount <= 1) return undefined;
  return roster.filter((row) => isFinisher({ game, participant: row })).map((row) => row.userId);
}
