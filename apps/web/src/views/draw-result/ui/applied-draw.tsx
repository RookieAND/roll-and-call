import { FloatingBar, VStack } from "@roll-and-call/ui";

import type { DrawOutcome } from "../model/to-draw-outcome";
import { BackToGameBar } from "./back-to-game-bar";
import { DrawQueue } from "./draw-queue";
import { DrawSummary } from "./draw-summary";

const WAITING_PREVIEW = 2;

interface AppliedDrawProps {
  gameId: string;
  title: string;
  outcome: DrawOutcome;
  drawnAt: Date;
}

// GM·직접 확정자·나간 사람·비참여자가 보는 결과(보드 12 C·H).
export function AppliedDraw({ gameId, title, outcome, drawnAt }: AppliedDrawProps) {
  return (
    <FloatingBar.Root elevated={false}>
      <VStack gap="250">
        <DrawSummary
          title={title}
          applicantCount={outcome.rolled.length}
          confirmedCount={outcome.confirmed.length}
          drawnAt={drawnAt}
        />
        <DrawQueue
          label="확정"
          caption="값이 낮은 순"
          entries={outcome.confirmed}
          meUserId={null}
        />
        {outcome.waiting.length > 0 && (
          <DrawQueue
            label="대기"
            entries={outcome.waiting}
            meUserId={null}
            previewCount={WAITING_PREVIEW}
          />
        )}
      </VStack>
      <BackToGameBar gameId={gameId} />
    </FloatingBar.Root>
  );
}
