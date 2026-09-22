import { leaveLock } from "../model/leave-locked-reason";
import { LeaveableJoinedActions } from "./leaveable-joined-actions";
import { LockedJoinedActions } from "./locked-joined-actions";

interface JoinedActionsProps {
  gameId: string;
  canSchedule: boolean;
  canLeave: boolean;
  expired: boolean;
  drawn: boolean;
}

export function JoinedActions({
  gameId,
  canSchedule,
  canLeave,
  expired,
  drawn,
}: JoinedActionsProps) {
  if (!canLeave) {
    return (
      <LockedJoinedActions
        gameId={gameId}
        canSchedule={canSchedule}
        drawn={drawn}
        lock={leaveLock(drawn, expired)}
      />
    );
  }

  return <LeaveableJoinedActions gameId={gameId} canSchedule={canSchedule} />;
}
