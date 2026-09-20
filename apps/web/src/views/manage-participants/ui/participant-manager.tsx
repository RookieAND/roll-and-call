import { Container, VStack } from "@trpg/ui";

import { DrawLotteryCard } from "@/features/adjust-roster";
import { AppBar, EmptyState } from "@/shared/ui";

import type { ManagedMember } from "../model/managed-member";
import type { RosterSummary } from "../model/roster-summary";
import { ApplicantList } from "./applicant-list";
import { AttendanceCard } from "./attendance-card";
import { CopyLinkButton } from "./copy-link-button";
import { DeadlineCard } from "./deadline-card";
import { DrawResultNote } from "./draw-result-note";
import { NextRoundBanner } from "./next-round-banner";
import { RosterHeader } from "./roster-header";
import { RosterQueues } from "./roster-queues";
import { RosterStats } from "./roster-stats";

type Props = {
  gameId: string;
  title: string;
  confirmedAt: Date | null;
  maxPlayers: number;
  confirmed: ManagedMember[];
  waiting: ManagedMember[];
  summary: RosterSummary;
  isCoordinate: boolean;
  locked: boolean;
  attendanceDue: boolean;
};

export function ParticipantManager({
  gameId,
  title,
  confirmedAt,
  maxPlayers,
  confirmed,
  waiting,
  summary,
  isCoordinate,
  locked,
  attendanceDue,
}: Props) {
  const isEmpty = summary.applicantCount === 0;
  const showNextRound = waiting.length > 0 && !summary.beforeDraw;

  return (
    <>
      <AppBar back={`/games/${gameId}`} title="참여자 관리" />
      <Container size="md">
        <VStack gap={5} className="py-4">
          <VStack gap={3}>
            <RosterHeader
              title={title}
              methodLabel={summary.methodLabel}
              isLottery={summary.isLottery}
              maxPlayers={maxPlayers}
            />
            <RosterStats
              confirmedCount={confirmed.length}
              waitingCount={waiting.length}
              maxPlayers={maxPlayers}
              summary={summary}
            />
            {attendanceDue ? (
              <AttendanceCard gameId={gameId} confirmedAt={confirmedAt!} />
            ) : summary.drawnAtLabel ? (
              <DrawResultNote
                drawnAtLabel={summary.drawnAtLabel}
                applicantCount={summary.applicantCount}
              />
            ) : (
              <DeadlineCard summary={summary} locked={locked} />
            )}
          </VStack>

          {isEmpty ? (
            <EmptyState
              image="/empty-states/empty-hosted.png"
              size="section"
              title="아직 신청한 사람이 없습니다"
              description="구인글 링크를 디스코드에 공유하면 모집이 빨라집니다."
              action={<CopyLinkButton gameId={gameId} />}
            />
          ) : summary.beforeDraw ? (
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
                applicants={[...confirmed, ...waiting]}
                unsubmittedCount={summary.unsubmittedCount}
                isCoordinate={isCoordinate}
              />
            </>
          ) : (
            <RosterQueues
              gameId={gameId}
              confirmed={confirmed}
              waiting={waiting}
              maxPlayers={maxPlayers}
              summary={summary}
              isCoordinate={isCoordinate}
              locked={locked}
            />
          )}

          {showNextRound && (
            <NextRoundBanner
              gameId={gameId}
              title={title}
              waitingCount={waiting.length}
              maxPlayers={maxPlayers}
              confirmedAt={confirmedAt}
            />
          )}
        </VStack>
      </Container>
    </>
  );
}
