import { Button, FloatingBar, VStack } from "@roll-and-call/ui";
import { CircleCheck } from "lucide-react";

import { SummaryLine, ServerLink } from "@/shared/ui";

import { DRAW_ROW_VARIANT } from "../model/draw-row-variant";
import type { DrawOutcome } from "../model/to-draw-outcome";
import { DrawQueue } from "./draw-queue";
import { DrawSummary } from "./draw-summary";

interface AppliedDrawProps {
  gameId: string;
  title: string;
  outcome: DrawOutcome;
  drawnAtLabel: string;
}

export function AppliedDraw({ gameId, title, outcome, drawnAtLabel }: AppliedDrawProps) {
  return (
    <FloatingBar.Root elevated={false}>
      <VStack gap="250">
        <VStack gap="100">
          <DrawSummary
            title={title}
            applicantCount={outcome.rolled.length}
            resultLabel="확정"
            resultCount={outcome.confirmed.length}
            applied
          />
          <SummaryLine
            icon={CircleCheck}
            tone="success"
            label="추첨"
            value={drawnAtLabel}
            badge="완료"
          />
        </VStack>
        <DrawQueue
          label="확정"
          caption="값이 낮은 순"
          entries={outcome.confirmed}
          variant={DRAW_ROW_VARIANT.highlight}
          meUserId={null}
          previewCount={outcome.confirmed.length}
        />
        <DrawQueue
          label="대기"
          entries={outcome.waiting}
          variant={DRAW_ROW_VARIANT.plain}
          meUserId={null}
          previewCount={2}
        />
      </VStack>
      <FloatingBar.Spacer />
      <FloatingBar.Content>
        <Button
          render={<ServerLink path={`/games/${gameId}`} />}
          variant="outline"
          size="lg"
          className="w-full"
        >
          구인 글로 돌아가기
        </Button>
      </FloatingBar.Content>
    </FloatingBar.Root>
  );
}
