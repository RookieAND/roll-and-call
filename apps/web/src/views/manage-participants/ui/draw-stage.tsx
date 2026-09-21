import { DrawLotteryCard } from "@/features/adjust-roster";

import type { AttendanceStage } from "../model/attendance-stage";
import type { ManagedMember } from "../model/managed-member";
import type { RosterSummary } from "../model/roster-summary";
import { RosterQueues } from "./roster-queues";

interface DrawStageProps {
  gameId: string;
  confirmed: ManagedMember[];
  waiting: ManagedMember[];
  maxPlayers: number;
  summary: RosterSummary;
  isCoordinate: boolean;
  locked: boolean;
  attendanceStage: AttendanceStage | null;
}

// 뽑기 전에도 직접 확정한 사람은 확정 목록에 서고, 나머지는 순번 없는 신청자로 남는다.
export function DrawStage({
  gameId,
  confirmed,
  waiting,
  maxPlayers,
  summary,
  isCoordinate,
  locked,
  attendanceStage,
}: DrawStageProps) {
  return (
    <>
      {!locked && (
        <DrawLotteryCard
          gameId={gameId}
          applicantCount={summary.applicantCount}
          preConfirmedCount={summary.preConfirmedCount}
          drawCount={summary.drawCount}
          deadlinePassed={summary.deadlinePassed}
        />
      )}
      <RosterQueues
        gameId={gameId}
        confirmed={confirmed}
        waiting={waiting}
        maxPlayers={maxPlayers}
        summary={summary}
        isCoordinate={isCoordinate}
        locked={locked}
        attendanceStage={attendanceStage}
      />
    </>
  );
}
