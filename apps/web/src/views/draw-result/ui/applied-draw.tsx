import { Button, VStack } from "@roll-and-call/ui";
import { Check } from "lucide-react";
import Link from "next/link";

import { SummaryLine } from "@/shared/ui";

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

// 적용 뒤에는 읽기 전용 기록이다. 명단을 고치는 일은 참여자 관리에서 한다.
export function AppliedDraw({ gameId, title, outcome, drawnAtLabel }: AppliedDrawProps) {
  return (
    <VStack gap="250">
      <VStack gap="100">
        <DrawSummary
          title={title}
          applicantCount={outcome.rolled.length}
          resultLabel="확정"
          resultCount={outcome.confirmed.length}
          applied
        />
        <SummaryLine icon={Check} tone="success" label="추첨 완료" value={drawnAtLabel} />
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
      <Button
        render={<Link href={`/games/${gameId}`} />}
        variant="outline"
        className="h-12 w-full rounded-500 text-subtitle1 font-bold"
      >
        구인 글로 돌아가기
      </Button>
    </VStack>
  );
}
