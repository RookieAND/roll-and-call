import { Container, VStack } from "@roll-and-call/ui";

import { AppBar, PageShell } from "@/shared/ui";

import type { ManagedMember } from "../model/managed-member";
import type { RosterSummary } from "../model/roster-summary";
import type { SplitCandidate } from "../model/split-candidate";
import { RosterBody } from "./roster-body";
import { RosterHeader } from "./roster-header";
import { RosterStats } from "./roster-stats";
import { RosterStatusCard } from "./roster-status-card";
import { SplitTeamsBanner } from "./split-teams-banner";

interface ParticipantManagerProps {
  game: { id: string; title: string; maxPlayers: number };
  confirmedRows: ManagedMember[];
  confirmedCount: number;
  waiting: ManagedMember[];
  summary: RosterSummary;
  isCoordinate: boolean;
  // 신청글 받기 구인이면 GM의 질문. 신청글 창 맨 위에 보인다.
  applicationQuestion: string | null;
  // 팀 나누기에서 고를 수 있는 대기자(판정 전에는 신청자). 세션이 시작되면 비어 있다.
  splitCandidates: SplitCandidate[];
}

export function ParticipantManager({
  game,
  confirmedRows,
  confirmedCount,
  waiting,
  summary,
  isCoordinate,
  applicationQuestion,
  splitCandidates,
}: ParticipantManagerProps) {
  const showSplitTeams = splitCandidates.length > 0;

  // 제목·지표·상태 카드는 모바일에서는 명단 위에, 1100px 이상에서는 우측 패널에 둔다.
  const header = (
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
  );

  return (
    <PageShell
      appBar={<AppBar back={`/games/${game.id}/manage`} title="참여자 관리" />}
      panel={header}
    >
      <Container size="md" className="desktop:px-0 desktop:max-w-none">
        <VStack gap="250" className="py-200 desktop:pt-0 desktop:pb-0">
          <div className="desktop:hidden">{header}</div>

          <RosterBody
            gameId={game.id}
            confirmedRows={confirmedRows}
            confirmedCount={confirmedCount}
            waiting={waiting}
            maxPlayers={game.maxPlayers}
            summary={summary}
            isCoordinate={isCoordinate}
            applicationQuestion={applicationQuestion}
          />

          {showSplitTeams && (
            <div className="desktop:-order-1">
              <SplitTeamsBanner
                gameId={game.id}
                gameTitle={game.title}
                candidates={splitCandidates}
                beforeResult={summary.beforeDraw}
                carriesApplicationNote={applicationQuestion !== null}
              />
            </div>
          )}
        </VStack>
      </Container>
    </PageShell>
  );
}
