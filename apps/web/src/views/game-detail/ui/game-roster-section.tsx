"use client";

import { Avatar, AvatarGroup, Badge, Button, HStack, Progress, Text, VStack } from "@trpg/ui";
import Link from "next/link";
import { useState } from "react";
import { GAME_STATUS, type GameStatus, type RosterMember } from "@/entities/game";
import { formatDateTime } from "@/shared/lib";
import { Sheet } from "@/shared/ui";

const MAX_AVATARS = 5;

type Member = RosterMember<{
  userId: string;
  user: { username: string; avatarUrl: string | null } | null;
}>;

function MemberRow({ rank, member, note }: { rank: number; member: Member; note?: string }) {
  return (
    <div className="flex min-h-12 items-center gap-2.5 border-b border-gray-100 py-2 last:border-b-0">
      <Text typography="code2" foreground="hint" className="w-5 shrink-0 text-center tabular-nums">
        {rank}
      </Text>
      <Avatar src={member.user?.avatarUrl} name={member.user?.username} />
      <div className="min-w-0 flex-1">
        <Text typography="subtitle1" className="block truncate">
          {member.user?.username ?? "?"}
        </Text>
        {note && (
          <Text typography="body4" foreground="hint" className="block truncate">
            {note}
          </Text>
        )}
      </div>
    </div>
  );
}

// 참여자 한 곳: 인원(진행바) · 얼굴 · 명단 보기 시트, 그 아래 대기 섹션.
// 인원은 여기서만 보여준다(정보 표에서 뺐다). 명단 시트는 hover 툴팁의 터치 대안이다.
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
  confirmed: Member[];
  waiting: Member[];
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
          <AvatarGroup
            max={MAX_AVATARS}
            size="stack"
            people={confirmed.map((p) => ({ src: p.user?.avatarUrl, name: p.user?.username }))}
          />
        )}
      </section>

      {waiting.length > 0 && (
        <section className="flex flex-col gap-1">
          <HStack align="center" gap={2}>
            <Text typography="heading3" render={<h2 />}>
              대기
            </Text>
            <Badge color="gray">{waiting.length}명</Badge>
            <span className="flex-1" />
            <Text typography="body4" foreground="hint">
              자리가 나면 순서대로 확정
            </Text>
          </HStack>
          <div>
            {waiting.map((member) => {
              const note =
                member.userId === viewerId ? `나 · 마감 ${formatDateTime(endDate)}까지` : undefined;
              return (
                <MemberRow
                  key={member.userId}
                  rank={member.waitlistRank!}
                  member={member}
                  note={note}
                />
              );
            })}
          </div>
        </section>
      )}

      <Sheet.Root open={open} onOpenChange={setOpen}>
        <Sheet.Content>
          <Sheet.Title>명단 · 신청 순서</Sheet.Title>
          <div className="max-h-[60vh] overflow-y-auto">
            {confirmed.map((member) => (
              <MemberRow key={member.userId} rank={member.applicationRank} member={member} />
            ))}
            {waiting.length > 0 && (
              <Text typography="subtitle2" foreground="muted" render={<div />} className="pt-3 pb-1">
                대기
              </Text>
            )}
            {waiting.map((member) => (
              <MemberRow
                key={member.userId}
                rank={member.applicationRank}
                member={member}
                note={`대기 ${member.waitlistRank}번`}
              />
            ))}
          </div>
        </Sheet.Content>
      </Sheet.Root>
    </VStack>
  );
}
