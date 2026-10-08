import type { ManagedMember } from "../model/managed-member";
import type { RosterSummary } from "../model/roster-summary";
import { RosterEmptyState } from "./roster-empty-state";
import { RosterQueues } from "./roster-queues";

interface RosterBodyProps {
  gameId: string;
  confirmedRows: ManagedMember[];
  confirmedCount: number;
  waiting: ManagedMember[];
  maxPlayers: number;
  summary: RosterSummary;
  isCoordinate: boolean;
}

export function RosterBody({
  gameId,
  confirmedRows,
  confirmedCount,
  waiting,
  maxPlayers,
  summary,
  isCoordinate,
}: RosterBodyProps) {
  if (confirmedRows.length + waiting.length === 0)
    return <RosterEmptyState gameId={gameId} closed={summary.noApplicantsClosed} />;

  return (
    <RosterQueues
      gameId={gameId}
      confirmedRows={confirmedRows}
      confirmedCount={confirmedCount}
      waiting={waiting}
      maxPlayers={maxPlayers}
      summary={summary}
      isCoordinate={isCoordinate}
    />
  );
}
