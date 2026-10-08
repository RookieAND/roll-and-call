import { Callout, VStack } from "@roll-and-call/ui";
import { CircleCheck } from "lucide-react";

import { DrawLotteryCard } from "@/features/adjust-roster";
import { formatDateTime } from "@/shared/lib";

import type { RosterSummary } from "../model/roster-summary";
import { DeadlineCard } from "./deadline-card";
import { RosterDateRow } from "./roster-date-row";

interface RosterStatusCardProps {
  gameId: string;
  summary: RosterSummary;
}

// 위에서 처음 맞는 하나만 보인다(U06-02 상태 카드 우선순위).
export function RosterStatusCard({ gameId, summary }: RosterStatusCardProps) {
  if (summary.started) {
    return (
      <Callout.Root colorPalette="gray">
        <Callout.Icon />
        <Callout.Title>세션이 시작되었습니다.</Callout.Title>
        <Callout.Description>지금 확정 참여자를 빼면 불참으로 기록됩니다.</Callout.Description>
      </Callout.Root>
    );
  }
  if (summary.hasDrawResult && summary.drawnAt) {
    return (
      <RosterDateRow
        icon={CircleCheck}
        iconClass="text-success-700"
        label="추첨"
        value={formatDateTime(summary.drawnAt)}
        badge="완료"
        badgePalette="gray"
      />
    );
  }
  if (summary.noApplicantsClosed) {
    return (
      <VStack gap="100">
        <DeadlineCard summary={summary} />
        <Callout.Root colorPalette="gray" size="sm">
          <Callout.Icon />
          <Callout.Description>신청자 없이 모집이 끝났습니다</Callout.Description>
        </Callout.Root>
      </VStack>
    );
  }
  if (summary.beforeDraw) {
    const hasApplicants = summary.applicantCount > 0;
    return (
      <VStack gap="175">
        <DeadlineCard summary={summary} />
        {!hasApplicants && (
          <Callout.Root colorPalette="gray" size="sm">
            <Callout.Icon />
            <Callout.Description>아직 참여 신청자가 없습니다</Callout.Description>
          </Callout.Root>
        )}
        {hasApplicants && (
          <DrawLotteryCard
            gameId={gameId}
            applicantCount={summary.applicantCount}
            drawCount={summary.drawCount}
            deadlinePassed={summary.deadlinePassed}
            blockedMinPlayers={summary.blockedMinPlayers}
          />
        )}
      </VStack>
    );
  }
  return <DeadlineCard summary={summary} showNote />;
}
