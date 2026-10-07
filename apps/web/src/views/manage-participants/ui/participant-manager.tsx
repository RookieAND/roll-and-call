import { Container, VStack } from "@roll-and-call/ui";

import type { ScheduleMode } from "@/entities/game";
import { AppBar } from "@/shared/ui";

import type { ManagedMember } from "../model/managed-member";
import type { RosterSummary } from "../model/roster-summary";
import { NextRoundBanner } from "./next-round-banner";
import { RosterBody } from "./roster-body";
import { RosterHeader } from "./roster-header";
import { RosterStats } from "./roster-stats";
import { RosterStatusCard } from "./roster-status-card";

interface ParticipantManagerProps {
  game: { id: string; title: string; maxPlayers: number; scheduleMode: ScheduleMode };
  confirmedRows: ManagedMember[];
  confirmedCount: number;
  waiting: ManagedMember[];
  summary: RosterSummary;
  nextRoundBaseDate: string;
}

export function ParticipantManager({
  game,
  confirmedRows,
  confirmedCount,
  waiting,
  summary,
  nextRoundBaseDate,
}: ParticipantManagerProps) {
  const showNextRound = waiting.length > 0 && !summary.beforeDraw;

  return (
    <>
      <AppBar back={`/games/${game.id}/manage`} title="참여자 관리" />
      <Container size="md">
        <VStack gap="250" className="py-200">
          <VStack gap="150">
            <RosterHeader
              title={game.title}
              methodLabel={summary.methodLabel}
              recruitMethod={summary.recruitMethod}
              maxPlayers={game.maxPlayers}
            />
            <RosterStats
              confirmedCount={confirmedCount}
              waitingCount={waiting.length}
              maxPlayers={game.maxPlayers}
              summary={summary}
            />
            <RosterStatusCard gameId={game.id} summary={summary} />
          </VStack>

          <RosterBody
            gameId={game.id}
            confirmedRows={confirmedRows}
            confirmedCount={confirmedCount}
            waiting={waiting}
            maxPlayers={game.maxPlayers}
            summary={summary}
          />

          {showNextRound && (
            <NextRoundBanner
              game={game}
              waitingCount={waiting.length}
              baseDate={nextRoundBaseDate}
            />
          )}
        </VStack>
      </Container>
    </>
  );
}
