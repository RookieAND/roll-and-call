import { VStack } from "@trpg/ui";

import { DrawLotteryCard } from "@/features/adjust-roster";

import { ATTENDANCE_STAGE, type AttendanceStage } from "../model/attendance-stage";
import type { RosterSummary } from "../model/roster-summary";
import { AttendanceCard } from "./attendance-card";
import { AttendanceDoneRow } from "./attendance-done-row";
import { DeadlineCard } from "./deadline-card";
import { DrawPendingCard } from "./draw-pending-card";
import { DrawnRow } from "./drawn-row";
import { SessionEndedCard } from "./session-ended-card";

interface RosterStatusCardProps {
  gameId: string;
  confirmedAt: Date | null;
  confirmedCount: number;
  summary: RosterSummary;
  locked: boolean;
  attendanceStage: AttendanceStage | null;
}

// 헤더 아래 한 자리에 지금 가장 중요한 것만 선다 — 출석 확인 · 추첨 · 모집 마감.
export function RosterStatusCard({
  gameId,
  confirmedAt,
  confirmedCount,
  summary,
  locked,
  attendanceStage,
}: RosterStatusCardProps) {
  if (attendanceStage === ATTENDANCE_STAGE.due && confirmedAt) {
    return (
      <AttendanceCard gameId={gameId} confirmedAt={confirmedAt} confirmedCount={confirmedCount} />
    );
  }
  if (attendanceStage === ATTENDANCE_STAGE.done && confirmedAt) {
    return (
      <VStack gap="100">
        <SessionEndedCard confirmedAt={confirmedAt} />
        <AttendanceDoneRow />
      </VStack>
    );
  }
  if (summary.drawnAtLabel) {
    return (
      <VStack gap="100">
        <DrawnRow drawnAtLabel={summary.drawnAtLabel} />
        <DeadlineCard summary={summary} locked={locked} showNote={false} />
      </VStack>
    );
  }
  if (summary.beforeDraw) {
    return (
      <VStack gap="175">
        <DeadlineCard summary={summary} locked={locked} showNote={false} />
        {!locked && summary.awaitingApply && <DrawPendingCard gameId={gameId} />}
        {!locked && !summary.awaitingApply && (
          <DrawLotteryCard
            gameId={gameId}
            applicantCount={summary.applicantCount}
            preConfirmedCount={summary.preConfirmedCount}
            drawCount={summary.drawCount}
            deadlinePassed={summary.deadlinePassed}
          />
        )}
      </VStack>
    );
  }
  return <DeadlineCard summary={summary} locked={locked} />;
}
