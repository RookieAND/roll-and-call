import { DrawLotteryCard } from "@/features/adjust-roster";

import type { ManagedMember } from "../model/managed-member";
import type { RosterSummary } from "../model/roster-summary";
import { ApplicantList } from "./applicant-list";

// 뽑기 전에는 확정·대기가 갈리지 않아 한 목록으로 보여 준다.
export function DrawStage({
  gameId,
  applicants,
  maxPlayers,
  summary,
  isCoordinate,
  locked,
}: {
  gameId: string;
  applicants: ManagedMember[];
  maxPlayers: number;
  summary: RosterSummary;
  isCoordinate: boolean;
  locked: boolean;
}) {
  return (
    <>
      {!locked && (
        <DrawLotteryCard
          gameId={gameId}
          applicantCount={summary.applicantCount}
          maxPlayers={maxPlayers}
          deadlinePassed={summary.deadlinePassed}
          daysLeft={summary.daysLeft}
        />
      )}
      <ApplicantList
        applicants={applicants}
        unsubmittedCount={summary.unsubmittedCount}
        isCoordinate={isCoordinate}
      />
    </>
  );
}
