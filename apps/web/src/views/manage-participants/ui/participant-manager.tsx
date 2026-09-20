import { Container, VStack } from "@trpg/ui";

import { AppBar } from "@/shared/ui";

import type { ManagedMember } from "../model/managed-member";
import type { RosterSummary } from "../model/roster-summary";
import { NextRoundBanner } from "./next-round-banner";
import { RosterBody } from "./roster-body";
import { RosterHeader } from "./roster-header";
import { RosterStats } from "./roster-stats";
import { RosterStatusCard } from "./roster-status-card";

interface ParticipantManagerProps {
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
}

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
}: ParticipantManagerProps) {
  const showNextRound = waiting.length > 0 && !summary.beforeDraw;

  return (
    <>
      <AppBar back={`/games/${gameId}`} title="참여자 관리" />
      <Container size="md">
        <VStack gap="250" className="py-200">
          <VStack gap="150">
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
            <RosterStatusCard
              gameId={gameId}
              confirmedAt={confirmedAt}
              confirmedCount={confirmed.length}
              summary={summary}
              locked={locked}
              attendanceDue={attendanceDue}
            />
          </VStack>

          <RosterBody
            gameId={gameId}
            confirmed={confirmed}
            waiting={waiting}
            maxPlayers={maxPlayers}
            summary={summary}
            isCoordinate={isCoordinate}
            locked={locked}
          />

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
