import { Container, HStack, Text, VStack } from "@trpg/ui";
import { CircleAlert } from "lucide-react";

import { AppBar, EmptyState } from "@/shared/ui";

import type { ManagedMember } from "../model/managed-member";
import type { RosterSummary } from "../model/roster-summary";
import { CopyLinkButton } from "./copy-link-button";
import { NextRoundBanner } from "./next-round-banner";
import { RosterHeader } from "./roster-header";
import { RosterList } from "./roster-list";

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
}: Props) {
  const isEmpty = confirmed.length + waiting.length === 0;
  const showFullNote = summary.isFull && waiting.length > 0 && !locked;

  return (
    <>
      <AppBar back={`/games/${gameId}`} title="참여자 관리" />
      <Container size="md">
        <VStack gap={5} className="py-4">
          <RosterHeader
            title={title}
            confirmedCount={confirmed.length}
            waitingCount={waiting.length}
            maxPlayers={maxPlayers}
            summary={summary}
            locked={locked}
          />

          {isEmpty ? (
            <EmptyState
              image="/empty-states/empty-hosted.png"
              size="section"
              title="아직 신청한 사람이 없습니다"
              description="구인글 링크를 디스코드에 공유하면 모집이 빨라집니다."
              action={<CopyLinkButton gameId={gameId} />}
            />
          ) : (
            <VStack gap={2}>
              <RosterList
                gameId={gameId}
                confirmed={confirmed}
                waiting={waiting}
                maxPlayers={maxPlayers}
                isFull={summary.isFull}
                isCoordinate={isCoordinate}
                locked={locked}
              />

              {summary.unsubmittedCount > 0 && (
                <HStack align="center" gap={2} className="text-warning-600">
                  <CircleAlert size={14} strokeWidth={2.2} aria-hidden className="shrink-0" />
                  <Text typography="body4" render={<p />}>
                    {summary.unsubmittedCount}명이 아직 가능 시간을 내지 않았습니다.
                  </Text>
                </HStack>
              )}

              {showFullNote && (
                <Text typography="body4" foreground="hint" render={<p />}>
                  정원이 차서 대기자를 바로 올릴 수 없습니다.
                  <br />
                  대기자 ⋯ 메뉴의 &quot;교체&quot;를 누르면 내릴 사람을 고르고 한 번에 바꿉니다.
                </Text>
              )}
            </VStack>
          )}

          {waiting.length > 0 && (
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
