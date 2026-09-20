import { VStack } from "@trpg/ui";

import { LeaveGameButton } from "@/features/join-game";

import { ACTION_PAIR_CLASS } from "./action-class-names";
import { ActionPair } from "./action-pair";
import { PrimaryScheduleLink } from "./primary-schedule-link";
import { ScheduleLink } from "./schedule-link";
import { UnrespondedNotice } from "./unresponded-notice";

interface LeaveableJoinedActionsProps {
  gameId: string;
  canSchedule: boolean;
  needsResponse: boolean;
}

export function LeaveableJoinedActions({
  gameId,
  canSchedule,
  needsResponse,
}: LeaveableJoinedActionsProps) {
  return (
    <VStack gap="125">
      {needsResponse && <UnrespondedNotice />}
      <ActionPair>
        <LeaveGameButton gameId={gameId} className={ACTION_PAIR_CLASS}>
          참여 취소
        </LeaveGameButton>
        {canSchedule &&
          (needsResponse ? (
            <PrimaryScheduleLink gameId={gameId} className={ACTION_PAIR_CLASS} />
          ) : (
            <ScheduleLink gameId={gameId} className={ACTION_PAIR_CLASS} />
          ))}
      </ActionPair>
    </VStack>
  );
}
