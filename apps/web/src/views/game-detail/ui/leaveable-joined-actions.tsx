import { VStack } from "@trpg/ui";

import { LeaveGameButton } from "@/features/join-game";

import { ACTION_PAIR_CLASS } from "./action-class-names";
import { ActionPair } from "./action-pair";
import { PrimaryScheduleLink } from "./primary-schedule-link";
import { ScheduleLink } from "./schedule-link";
import { UnrespondedNotice } from "./unresponded-notice";

export function LeaveableJoinedActions({
  gameId,
  canSchedule,
  needsResponse,
}: {
  gameId: string;
  canSchedule: boolean;
  needsResponse: boolean;
}) {
  return (
    <VStack gap="100">
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
