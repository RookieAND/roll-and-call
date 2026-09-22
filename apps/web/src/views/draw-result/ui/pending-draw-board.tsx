"use client";

import { VStack } from "@trpg/ui";

import type { DrawOutcome } from "../model/to-draw-outcome";
import { useRollingNumbers } from "../model/use-rolling-numbers";
import { DrawQueue } from "./draw-queue";

interface PendingDrawBoardProps {
  outcome: DrawOutcome;
}

// 들어올 때마다 모든 숫자가 한 번에 0.7초 돌다 제자리에 멈춘다.
export function PendingDrawBoard({ outcome }: PendingDrawBoardProps) {
  const entries = [...outcome.confirmed, ...outcome.waiting];
  const { values } = useRollingNumbers(
    entries.map((entry) => entry.roll ?? 0),
    { durationMs: 700 },
  );
  const confirmedRolls = values.slice(0, outcome.confirmed.length);
  const waitingRolls = values.slice(outcome.confirmed.length);

  return (
    <VStack gap="225">
      <DrawQueue
        label="확정"
        caption="값이 낮은 순"
        entries={outcome.confirmed}
        rolls={confirmedRolls}
        emphasized
        meUserId={null}
        previewCount={outcome.confirmed.length}
      />
      <DrawQueue
        label="대기"
        caption="자리가 나면 순서대로"
        entries={outcome.waiting}
        rolls={waitingRolls}
        emphasized={false}
        meUserId={null}
        previewCount={5}
      />
    </VStack>
  );
}
