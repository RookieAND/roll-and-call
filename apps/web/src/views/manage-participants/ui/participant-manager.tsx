import { Container, VStack } from "@roll-and-call/ui";

import { AppBar } from "@/shared/ui";

import type { AttendanceStage } from "../model/attendance-stage";
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
  attendanceStage: AttendanceStage | null;
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
  attendanceStage,
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
              recruitMethod={summary.recruitMethod}
              maxPlayers={maxPlayers}
            />
            <RosterStats
              confirmed={confirmed}
              waitingCount={waiting.length}
              summary={summary}
              attendanceStage={attendanceStage}
            />
            <RosterStatusCard
              gameId={gameId}
              confirmedAt={confirmedAt}
              confirmedCount={confirmed.length}
              summary={summary}
              locked={locked}
              attendanceStage={attendanceStage}
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
            attendanceStage={attendanceStage}
          />

          {showNextRound && <NextRoundBanner gameId={gameId} waitingCount={waiting.length} />}
        </VStack>
      </Container>
    </>
  );
}
