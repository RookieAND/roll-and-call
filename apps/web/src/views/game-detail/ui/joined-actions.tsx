import { leaveLock } from "../model/leave-locked-reason";
import { LeaveableJoinedActions } from "./leaveable-joined-actions";
import { LockedJoinedActions } from "./locked-joined-actions";

interface JoinedActionsProps {
  gameId: string;
  canSchedule: boolean;
  canLeave: boolean;
  expired: boolean;
  drawn: boolean;
  viewerResponded: boolean;
}

export function JoinedActions({
  gameId,
  canSchedule,
  canLeave,
  expired,
  drawn,
  viewerResponded,
}: JoinedActionsProps) {
  if (!canLeave) {
    return (
      <LockedJoinedActions
        gameId={gameId}
        canSchedule={canSchedule}
        lock={leaveLock(drawn, expired)}
      />
    );
  }

  return (
    <LeaveableJoinedActions
      gameId={gameId}
      canSchedule={canSchedule}
      needsResponse={canSchedule && !viewerResponded}
    />
  );
}
