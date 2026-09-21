import { VStack } from "@trpg/ui";

import { CLOSED_REASON, type ClosedReason } from "../model/closed-reason";
import { ACTION_SECONDARY_CLASS } from "./action-class-names";
import { RecruitEndedHint } from "./recruit-ended-hint";
import { RosterFullNotice } from "./roster-full-notice";
import { SessionSetNotice } from "./session-set-notice";
import { SimilarGamesLink } from "./similar-games-link";

interface ClosedActionsProps {
  endDate: Date;
  reason: ClosedReason;
}

export function ClosedActions({ endDate, reason }: ClosedActionsProps) {
  return (
    <VStack gap="125">
      {reason === CLOSED_REASON.expired && <RecruitEndedHint endDate={endDate} />}
      {reason === CLOSED_REASON.full && <RosterFullNotice />}
      {reason === CLOSED_REASON.sessionSet && <SessionSetNotice />}
      <SimilarGamesLink className={ACTION_SECONDARY_CLASS} />
    </VStack>
  );
}
