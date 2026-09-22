import type { AttendanceStage } from "../model/attendance-stage";
import type { ManagedMember } from "../model/managed-member";
import type { RosterSummary } from "../model/roster-summary";
import { RosterEmptyState } from "./roster-empty-state";
import { RosterQueues } from "./roster-queues";

interface RosterBodyProps {
  gameId: string;
  confirmed: ManagedMember[];
  waiting: ManagedMember[];
  maxPlayers: number;
  summary: RosterSummary;
  isCoordinate: boolean;
  locked: boolean;
  attendanceStage: AttendanceStage | null;
}

export function RosterBody({
  gameId,
  confirmed,
  waiting,
  maxPlayers,
  summary,
  isCoordinate,
  locked,
  attendanceStage,
}: RosterBodyProps) {
  if (confirmed.length + waiting.length === 0) return <RosterEmptyState gameId={gameId} />;

  return (
    <RosterQueues
      gameId={gameId}
      confirmed={confirmed}
      waiting={waiting}
      maxPlayers={maxPlayers}
      summary={summary}
      isCoordinate={isCoordinate}
      locked={locked}
      attendanceStage={attendanceStage}
    />
  );
}
