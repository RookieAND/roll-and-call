import { Button, VStack } from "@trpg/ui";
import Link from "next/link";

import { ACTION_SECONDARY_CLASS } from "./action-class-names";
import { RecruitEndedHint } from "./recruit-ended-hint";
import { RosterFullNotice } from "./roster-full-notice";

interface ClosedActionsProps {
  endDate: Date;
  expired: boolean;
}

export function ClosedActions({ endDate, expired }: ClosedActionsProps) {
  return (
    <VStack gap="125">
      {expired ? <RecruitEndedHint endDate={endDate} /> : <RosterFullNotice />}
      <Button asChild variant="outline" className={ACTION_SECONDARY_CLASS}>
        <Link href="/games">비슷한 구인 보기</Link>
      </Button>
    </VStack>
  );
}
