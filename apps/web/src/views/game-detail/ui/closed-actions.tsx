import { Button, VStack } from "@trpg/ui";
import Link from "next/link";

import { ACTION_SECONDARY_CLASS } from "./action-class-names";
import { RecruitEndedHint } from "./recruit-ended-hint";
import { RosterFullNotice } from "./roster-full-notice";

export function ClosedActions({ endDate, expired }: { endDate: Date; expired: boolean }) {
  return (
    <VStack gap="125">
      {expired ? <RecruitEndedHint endDate={endDate} /> : <RosterFullNotice />}
      <Button asChild variant="outline" className={ACTION_SECONDARY_CLASS}>
        <Link href="/games">비슷한 구인 보기</Link>
      </Button>
    </VStack>
  );
}
