import { VStack } from "@trpg/ui";

import { DRAW_ROW_VARIANT } from "../model/draw-row-variant";
import type { DrawOutcome } from "../model/to-draw-outcome";
import { DrawQueue } from "./draw-queue";

interface PendingDrawBoardProps {
  outcome: DrawOutcome;
}

// 들어올 때마다 모든 숫자가 슬롯처럼 한 번에 돌다 제자리에 멈춘다.
export function PendingDrawBoard({ outcome }: PendingDrawBoardProps) {
  return (
    <VStack gap="225">
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
        caption="자리가 나면 순서대로"
        entries={outcome.waiting}
        variant={DRAW_ROW_VARIANT.plain}
        meUserId={null}
        previewCount={5}
      />
    </VStack>
  );
}
