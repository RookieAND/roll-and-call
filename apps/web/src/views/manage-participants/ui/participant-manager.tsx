"use client";

import { Container, VStack } from "@trpg/ui";
import type { ManagedMember } from "../model/managed-member";
import { summarizeRoster } from "../model/roster-summary";
import { AppBar } from "@/shared/ui";
import { ConfirmedRoster } from "./confirmed-roster";
import { NextRoundBanner } from "./next-round-banner";
import { RosterStats } from "./roster-stats";
import { WaitingRoster } from "./waiting-roster";

type Props = {
  gameId: string;
  title: string;
  endDate: Date;
  confirmedAt: Date | null;
  maxPlayers: number;
  confirmed: ManagedMember[];
  waiting: ManagedMember[];
};

// GM 전용 참여자 관리 화면. 요약 → 확정 목록 → 대기 목록 → 다음 회차 순으로 쌓는다.
// 각 블록이 자기 동작과 열림 상태를 들고 있어서, 여기서는 순서와 여백만 정한다.
export function ParticipantManager({
  gameId,
  title,
  endDate,
  confirmedAt,
  maxPlayers,
  confirmed,
  waiting,
}: Props) {
  const { total, isFull, urgent, deadlineLabel } = summarizeRoster({
    confirmedCount: confirmed.length,
    waitingCount: waiting.length,
    maxPlayers,
    endDate,
  });
  const hasWaiting = waiting.length > 0;

  return (
    <>
      <AppBar back={`/games/${gameId}`} title="참여자 관리" />
      <Container size="md">
        <VStack gap={5} className="py-4">
          <RosterStats
            total={total}
            maxPlayers={maxPlayers}
            deadlineLabel={deadlineLabel}
            urgent={urgent}
            endDate={endDate}
          />

          <ConfirmedRoster
            gameId={gameId}
            members={confirmed}
            maxPlayers={maxPlayers}
            waitingHead={waiting[0]?.username}
          />

          {hasWaiting && (
            <>
              <WaitingRoster gameId={gameId} members={waiting} isFull={isFull} />
              <NextRoundBanner
                gameId={gameId}
                title={title}
                waitingCount={waiting.length}
                confirmedAt={confirmedAt}
              />
            </>
          )}
        </VStack>
      </Container>
    </>
  );
}
