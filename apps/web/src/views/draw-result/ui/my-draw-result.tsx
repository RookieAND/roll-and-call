import { Button, FloatingBar, HStack, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import { LeaveGameButton } from "@/features/join-game";

import { DRAW_ROW_VARIANT } from "../model/draw-row-variant";
import type { DrawOutcome } from "../model/to-draw-outcome";
import { DrawConfetti } from "./draw-confetti";
import { DrawQueue } from "./draw-queue";
import { DrawSummary } from "./draw-summary";
import { MyDrawStatus } from "./my-draw-status";

interface MyDrawResultProps {
  gameId: string;
  title: string;
  outcome: DrawOutcome;
  meUserId: string;
  // 지금 명단 기준. 추첨 뒤 자리가 나 올라왔으면 확정으로 보인다.
  waitlistRank: number | null;
  needsAvailability: boolean;
}

export function MyDrawResult({
  gameId,
  title,
  outcome,
  meUserId,
  waitlistRank,
  needsAvailability,
}: MyDrawResultProps) {
  const confirmed = waitlistRank === null;
  const myWaitingIndex = outcome.waiting.findIndex((entry) => entry.userId === meUserId);
  const waitingPreview = Math.max(2, myWaitingIndex + 1);

  return (
    <FloatingBar.Root elevated={false}>
      <VStack gap="250">
        {confirmed && <DrawConfetti />}
        <VStack gap="100">
          <DrawSummary
            title={title}
            applicantCount={outcome.rolled.length}
            resultLabel="확정"
            resultCount={outcome.confirmed.length}
            applied
          />
          <MyDrawStatus confirmed={confirmed} waitlistRank={waitlistRank} />
        </VStack>
        <DrawQueue
          label="확정"
          caption="값이 낮은 순"
          entries={outcome.confirmed}
          variant={DRAW_ROW_VARIANT.compact}
          meUserId={meUserId}
          previewCount={outcome.confirmed.length}
        />
        <DrawQueue
          label="대기"
          entries={outcome.waiting}
          variant={DRAW_ROW_VARIANT.compact}
          meUserId={meUserId}
          previewCount={waitingPreview}
        />
      </VStack>
      <FloatingBar.Spacer />
      <FloatingBar.Content>
        <HStack gap="100" className="[&>*]:flex-1">
          {!confirmed && <LeaveGameButton gameId={gameId}>대기 취소</LeaveGameButton>}
          <Button render={<Link href={`/games/${gameId}`} />} variant="outline" size="lg">
            구인 글 보기
          </Button>
          {confirmed && needsAvailability && (
            <Button render={<Link href={`/games/${gameId}/schedule`} />} size="lg">
              가능 시간 제출
            </Button>
          )}
        </HStack>
      </FloatingBar.Content>
    </FloatingBar.Root>
  );
}
