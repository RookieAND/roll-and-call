"use client";

import { Avatar, Button, Card, Container, HStack, IconButton, Text, VStack } from "@trpg/ui";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import {
  MemberActionSheet,
  type MemberSummary,
  PromoteButton,
  RoundSheet,
} from "@/features/manage-participants";
import { dday, formatDateTime } from "@/shared/lib";
import { AppBar, StatCard } from "@/shared/ui";

export type ManagedMember = MemberSummary & {
  waitlistRank: number | null;
  hasAvailability: boolean;
};

type Props = {
  gameId: string;
  title: string;
  endDate: Date;
  confirmedAt: Date | null;
  maxPlayers: number;
  confirmed: ManagedMember[];
  waiting: ManagedMember[];
};

const URGENT_MS = 24 * 60 * 60 * 1000;

// GM 전용 참여자 관리 화면. 요약 → 확정 목록 → 대기 목록 → 다음 회차 순.
// 동작(승격·강등·내보내기·회차 생성)은 feature 컴포넌트가 각자 수행하고, 위젯은 배치와 열림 상태만 든다.
export function ParticipantManager({
  gameId,
  title,
  endDate,
  confirmedAt,
  maxPlayers,
  confirmed,
  waiting,
}: Props) {
  const [sheetMember, setSheetMember] = useState<ManagedMember | null>(null);
  const [roundOpen, setRoundOpen] = useState(false);

  const total = confirmed.length + waiting.length;
  const isFull = confirmed.length >= maxPlayers;
  const remainingMs = endDate.getTime() - Date.now();
  const closed = remainingMs <= 0;
  const urgent = !closed && remainingMs < URGENT_MS;
  const deadlineLabel = closed ? "마감" : `D-${dday(endDate)}`;

  return (
    <>
      <AppBar back={`/games/${gameId}`} title="참여자 관리" />
      <Container size="md">
        <VStack gap={5} className="py-4">
          <VStack gap={2}>
            <div className="grid grid-cols-3 gap-2">
              <StatCard value={total} label="신청" />
              <StatCard value={maxPlayers} label="정원" />
              <StatCard value={deadlineLabel} label="마감" urgent={urgent} />
            </div>
            <Card padding="none" className="px-3.5 py-3">
              <Text typography="body3" foreground="muted" render={<p />}>
                마감일 | {formatDateTime(endDate)}
              </Text>
              <Text typography="body3" foreground="muted" render={<p />}>
                마감되면 아래 확정 목록이 그대로 확정됩니다.
              </Text>
            </Card>
          </VStack>

          <VStack gap={2}>
            <HStack justify="between" align="center">
              <Text typography="body3" foreground="muted" className="font-bold">
                확정 {confirmed.length}/{maxPlayers}
              </Text>
              <Text typography="body3" foreground="muted">
                신청 순서 기준
              </Text>
            </HStack>
            <div className="overflow-hidden rounded-xl border border-gray-200">
              {confirmed.map((m) => (
                <RosterRow key={m.userId} member={m} onMenu={() => setSheetMember(m)} />
              ))}
              {confirmed.length === 0 && (
                <div className="px-3 py-4">
                  <Text typography="body3" foreground="muted">
                    아직 확정된 참여자가 없어요.
                  </Text>
                </div>
              )}
            </div>
          </VStack>

          {waiting.length > 0 && (
            <VStack gap={2}>
              <HStack justify="between" align="center">
                <Text typography="body3" foreground="muted" className="font-bold">
                  대기 {waiting.length}명
                </Text>
                <Text typography="body3" foreground="muted">
                  {isFull ? "정원이 차서 승격하려면 먼저 자리를 비워야 해요" : "상한 없음"}
                </Text>
              </HStack>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                {waiting.map((m) => (
                  <HStack
                    key={m.userId}
                    align="center"
                    gap={3}
                    className="min-h-13 border-b border-gray-100 px-3 py-2 last:border-b-0"
                  >
                    <Text
                      typography="body4"
                      foreground="hint"
                      className="w-5 text-center font-mono"
                    >
                      {m.waitlistRank}
                    </Text>
                    <Avatar src={m.avatarUrl} name={m.username} size="md" />
                    <Text typography="subtitle2" className="flex-1">
                      {m.username}
                    </Text>
                    <PromoteButton gameId={gameId} member={m} disabled={isFull} />
                  </HStack>
                ))}
              </div>
            </VStack>
          )}

          {waiting.length > 0 && (
            <VStack gap={3} className="rounded-2xl border border-primary-100 bg-primary-50/40 p-4">
              <VStack gap={1}>
                <Text typography="subtitle2">대기 {waiting.length}명으로 다음 회차 열기</Text>
                <Text typography="body3" foreground="muted">
                  같은 게임을 새 일정으로 한 번 더 진행합니다. 대기자는 자동 초대돼요.
                </Text>
              </VStack>
              <Button className="w-full" onClick={() => setRoundOpen(true)}>
                다음 회차 만들기
              </Button>
            </VStack>
          )}
        </VStack>
      </Container>

      <MemberActionSheet
        gameId={gameId}
        member={sheetMember}
        waitingHead={waiting[0]?.username}
        onClose={() => setSheetMember(null)}
      />

      <RoundSheet
        open={roundOpen}
        onOpenChange={setRoundOpen}
        gameId={gameId}
        title={title}
        waitingCount={waiting.length}
        confirmedAt={confirmedAt}
      />
    </>
  );
}

function RosterRow({ member, onMenu }: { member: ManagedMember; onMenu: () => void }) {
  const availText = member.hasAvailability ? "가능 시간 입력" : "가능 시간 미입력";
  return (
    <HStack
      align="center"
      gap={3}
      className="min-h-14 border-t border-gray-100 px-3 py-2 first:border-t-0"
    >
      <Avatar src={member.avatarUrl} name={member.username} size="stack" />
      <VStack gap={0} className="flex-1">
        <Text typography="subtitle2">{member.username}</Text>
        <Text
          typography="body4"
          className={member.hasAvailability ? "text-gray-500" : "text-amber-600"}
        >
          {member.applicationRank}번째 신청 · {availText}
        </Text>
      </VStack>
      <IconButton
        variant="outline"
        aria-label="참여자 메뉴"
        onClick={onMenu}
        className="shrink-0 rounded-[10px] border-gray-200 text-gray-500"
      >
        <MoreHorizontal size={16} aria-hidden />
      </IconButton>
    </HStack>
  );
}
