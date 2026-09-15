"use client";

import { AvatarGroup, Button, HStack, Progress, Text, VStack } from "@trpg/ui";
import Link from "next/link";
import { useState } from "react";

import { GAME_STATUS, type GameStatus } from "@/entities/game";

import type { DetailRosterMember } from "./roster-member-row";
import { RosterSheet } from "./roster-sheet";
import { WaitlistSection } from "./waitlist-section";

const MAX_AVATARS = 5;

export function GameRosterSection({
  gameId,
  confirmed,
  waiting,
  maxPlayers,
  status,
  isGm,
  viewerId,
  endDate,
}: {
  gameId: string;
  confirmed: DetailRosterMember[];
  waiting: DetailRosterMember[];
  maxPlayers: number;
  status: GameStatus;
  isGm: boolean;
  viewerId: string | null;
  endDate: Date;
}) {
  const [open, setOpen] = useState(false);
  // 꽉 찬 바는 "자리 없음"이라 좋은 상태 색을 주지 않는다. 초록은 배지 하나만.
  const barColor = status === GAME_STATUS.recruiting ? "recruiting" : "closed";
  const hasMembers = confirmed.length + waiting.length > 0;
  const avatarPeople = confirmed.map((participant) => ({
    src: participant.user?.avatarUrl,
    name: participant.user?.username,
  }));

  return (
    <VStack gap={5}>
      <section className="flex flex-col gap-2.5">
        <HStack align="center" gap={2}>
          <Text typography="heading3" render={<h2 />}>
            참여자
          </Text>
          <Text typography="code2" foreground="hint" className="tabular-nums">
            {confirmed.length}/{maxPlayers}
          </Text>
          <span className="flex-1" />
          {isGm ? (
            <Button asChild variant="ghost" size="sm" className="text-primary-ink">
              <Link href={`/games/${gameId}/participants`}>관리</Link>
            </Button>
          ) : (
            hasMembers && (
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-ink"
                onClick={() => setOpen(true)}
              >
                명단 보기
              </Button>
            )
          )}
        </HStack>
        <Progress value={confirmed.length} max={maxPlayers} color={barColor} className="w-full" />
        {confirmed.length === 0 ? (
          <Text typography="body3" foreground="muted" render={<p />}>
            아직 참여자가 없어요.
          </Text>
        ) : (
          <AvatarGroup max={MAX_AVATARS} size="stack" people={avatarPeople} />
        )}
      </section>

      {waiting.length > 0 && (
        <WaitlistSection waiting={waiting} viewerId={viewerId} endDate={endDate} />
      )}

      <RosterSheet open={open} onOpenChange={setOpen} confirmed={confirmed} waiting={waiting} />
    </VStack>
  );
}
