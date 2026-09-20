import type { RosterSummary } from "../model/roster-summary";
import { AttendanceCard } from "./attendance-card";
import { DeadlineCard } from "./deadline-card";
import { DrawResultNote } from "./draw-result-note";

// 헤더 아래 한 자리에 지금 가장 중요한 것 하나만 선다 — 출석 확인 · 추첨 결과 · 모집 마감.
export function RosterStatusCard({
  gameId,
  confirmedAt,
  summary,
  locked,
  attendanceDue,
}: {
  gameId: string;
  confirmedAt: Date | null;
  summary: RosterSummary;
  locked: boolean;
  attendanceDue: boolean;
}) {
  if (attendanceDue && confirmedAt) {
    return <AttendanceCard gameId={gameId} confirmedAt={confirmedAt} />;
  }
  if (summary.drawnAtLabel) {
    return (
      <DrawResultNote drawnAtLabel={summary.drawnAtLabel} applicantCount={summary.applicantCount} />
    );
  }
  return <DeadlineCard summary={summary} locked={locked} />;
}
