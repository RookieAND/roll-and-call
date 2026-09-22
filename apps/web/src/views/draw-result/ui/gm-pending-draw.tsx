import { Text, VStack } from "@roll-and-call/ui";

import { ApplyDrawButton } from "@/features/adjust-roster";

import type { DrawOutcome } from "../model/to-draw-outcome";
import { DrawSummary } from "./draw-summary";
import { PendingDrawBoard } from "./pending-draw-board";

interface GmPendingDrawProps {
  gameId: string;
  title: string;
  outcome: DrawOutcome;
}

// 적용 버튼은 결과를 고르는 권한이 아니라 알림을 보내는 시점이다. 버리거나 다시 굴리는 길은 없다.
export function GmPendingDraw({ gameId, title, outcome }: GmPendingDrawProps) {
  const applicantCount = outcome.rolled.length;

  return (
    <VStack gap="250">
      <DrawSummary
        title={title}
        applicantCount={applicantCount}
        resultLabel="뽑을 인원"
        resultCount={outcome.drawCount}
        applied={false}
      />
      <PendingDrawBoard outcome={outcome} />
      <VStack gap="125">
        <ApplyDrawButton gameId={gameId} className="h-[50px] w-full rounded-500 text-heading3" />
        <Text typography="body4" foreground="hint" render={<p />}>
          확정하면 확정·대기 알림이 {applicantCount}명에게 나갑니다.
          <br />
          값은 이미 정해져 있어서 바뀌지 않습니다.
        </Text>
      </VStack>
    </VStack>
  );
}
