import { VStack } from "@trpg/ui";

import { ATTENDANCE_STAGE, type AttendanceStage } from "../model/attendance-stage";
import type { RosterSummary } from "../model/roster-summary";
import { AttendanceCard } from "./attendance-card";
import { AttendanceDoneRow } from "./attendance-done-row";
import { DeadlineCard } from "./deadline-card";
import { DrawResultNote } from "./draw-result-note";
import { SessionEndedCard } from "./session-ended-card";

interface RosterStatusCardProps {
  gameId: string;
  confirmedAt: Date | null;
  confirmedCount: number;
  summary: RosterSummary;
  locked: boolean;
  attendanceStage: AttendanceStage | null;
}

// 헤더 아래 한 자리에 지금 가장 중요한 것 하나만 선다 — 출석 확인 · 추첨 결과 · 모집 마감.
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
      <DrawResultNote drawnAtLabel={summary.drawnAtLabel} applicantCount={summary.applicantCount} />
    );
  }
  return <DeadlineCard summary={summary} locked={locked} />;
}
