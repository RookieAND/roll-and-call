import { Button, VStack } from "@trpg/ui";
import Link from "next/link";

import { CLOSED_REASON, type ClosedReason } from "../model/closed-reason";
import { ACTION_SECONDARY_CLASS } from "./action-class-names";
import { RecruitEndedHint } from "./recruit-ended-hint";
import { RosterFullNotice } from "./roster-full-notice";
import { SessionSetNotice } from "./session-set-notice";

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
      <Button asChild variant="outline" className={ACTION_SECONDARY_CLASS}>
        <Link href="/games">비슷한 구인 보기</Link>
      </Button>
    </VStack>
  );
}
