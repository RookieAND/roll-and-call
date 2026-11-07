import { FloatingBar, VStack } from "@roll-and-call/ui";

import type { DrawOutcome } from "../model/to-draw-outcome";
import { BackToGameBar } from "./back-to-game-bar";
import { DrawQueue } from "./draw-queue";
import { DrawSummary } from "./draw-summary";

const WAITING_PREVIEW = 5;

interface AppliedDrawProps {
  gameId: string;
  title: string;
  outcome: DrawOutcome;
  drawnAt: Date;
}

// GM·직접 확정자·나간 사람·비참여자가 보는 결과(보드 12 C·H). 1100px 이상에서는 요약과 돌아가기 버튼이 우측 패널(DrawResultPanel)로 간다.
export function AppliedDraw({ gameId, title, outcome, drawnAt }: AppliedDrawProps) {
  return (
    <FloatingBar.Root elevated={false}>
      <VStack gap="250">
        <div className="desktop:hidden">
          <DrawSummary
            title={title}
            applicantCount={outcome.rolled.length}
            confirmedCount={outcome.confirmed.length}
            drawnAt={drawnAt}
          />
        </div>
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
      <div className="desktop:hidden">
        <BackToGameBar gameId={gameId} />
      </div>
    </FloatingBar.Root>
  );
}
