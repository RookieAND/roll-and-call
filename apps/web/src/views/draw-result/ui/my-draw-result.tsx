import { FloatingBar, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";

import type { ScheduleMode } from "@/entities/game";

import { myDrawFooter } from "../model/my-draw-footer";
import type { DrawOutcome } from "../model/to-draw-outcome";
import { DrawConfetti } from "./draw-confetti";
import { DrawQueue } from "./draw-queue";
import { DrawSummary } from "./draw-summary";
import { MyDrawActions } from "./my-draw-actions";
import { MyDrawStatus } from "./my-draw-status";

const WAITING_PREVIEW = 2;

interface MyDrawResultProps {
  gameId: string;
  title: string;
  outcome: DrawOutcome;
  drawnAt: Date;
  meUserId: string;
  // 지금 명단 기준. 추첨 뒤 자리가 나 올라왔으면 확정으로 보인다.
  waitlistRank: number | null;
  scheduleMode: ScheduleMode;
  confirmedAt: Date | null;
  sessionEnded: boolean;
}

// 굴린 신청자 본인 화면(보드 12 D·E·F·G). 두 통은 추첨 기록, 내 결과와 하단 버튼은 지금 명단 기준이다.
export function MyDrawResult({
  gameId,
  title,
  outcome,
  drawnAt,
  meUserId,
  waitlistRank,
  scheduleMode,
  confirmedAt,
  sessionEnded,
}: MyDrawResultProps) {
  const confirmed = isNull(waitlistRank);
  const myWaitingIndex = outcome.waiting.findIndex((entry) => entry.userId === meUserId);
  const waitingPreview = Math.max(WAITING_PREVIEW, myWaitingIndex + 1);
  const footer = myDrawFooter({ confirmed, scheduleMode, confirmedAt, sessionEnded });

  return (
    <FloatingBar.Root elevated={false}>
      <VStack gap="250">
        {confirmed && <DrawConfetti />}
        <VStack gap="150">
          <DrawSummary
            title={title}
            applicantCount={outcome.rolled.length}
            confirmedCount={outcome.confirmed.length}
            drawnAt={drawnAt}
          />
          <MyDrawStatus waitlistRank={waitlistRank} />
        </VStack>
        <DrawQueue
          label="확정"
          caption="값이 낮은 순"
          entries={outcome.confirmed}
          meUserId={meUserId}
        />
        {outcome.waiting.length > 0 && (
          <DrawQueue
            label="대기"
            entries={outcome.waiting}
            meUserId={meUserId}
            previewCount={waitingPreview}
          />
        )}
      </VStack>
      <FloatingBar.Spacer />
      <FloatingBar.Content>
        <MyDrawActions
          gameId={gameId}
          hint={footer.hint}
          actions={footer.actions}
          waitlistRank={waitlistRank}
        />
      </FloatingBar.Content>
    </FloatingBar.Root>
  );
}
