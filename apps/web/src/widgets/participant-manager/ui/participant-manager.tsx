"use client";

import { Avatar, Button, Card, cn, Container, HStack, Text, VStack } from "@trpg/ui";
import { Check, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { dday } from "@/entities/game";
import {
  createSecondRound,
  demoteParticipant,
  promoteParticipant,
  removeParticipant,
} from "@/features/game";
import { formatDateTime } from "@/shared/lib/format";
import { AppBar } from "@/shared/ui/app-bar";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { DatePicker } from "@/shared/ui/date-picker";
import { Sheet } from "@/shared/ui/sheet";
import { toast } from "@/shared/lib/toast";

export type ManagedMember = {
  userId: string;
  username: string;
  avatarUrl: string | null;
  applicationRank: number;
  waitlistRank: number | null;
  hasAvailability: boolean;
};

type Props = {
  gameId: string;
  title: string;
  endDate: string;
  confirmedAt: string | null;
  maxPlayers: number;
  confirmed: ManagedMember[];
  waiting: ManagedMember[];
};

export function ParticipantManager({
  gameId,
  title,
  endDate,
  confirmedAt,
  maxPlayers,
  confirmed,
  waiting,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [sheetMember, setSheetMember] = useState<ManagedMember | null>(null);
  const [removing, setRemoving] = useState<ManagedMember | null>(null);
  const [roundOpen, setRoundOpen] = useState(false);

  const total = confirmed.length + waiting.length;
  const isFull = confirmed.length >= maxPlayers;
  const remainingDays = dday(endDate);
  const urgent = new Date(endDate).getTime() - Date.now() < 24 * 60 * 60 * 1000;

  function run(action: () => Promise<{ error?: string }>, success: string) {
    startTransition(async () => {
      const result = await action();
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(success);
      setSheetMember(null);
      setRemoving(null);
    });
  }

  return (
    <>
      <AppBar back={`/games/${gameId}`} title="참여자 관리" />
      <Container size="md">
        <VStack gap={5} className="py-4">
          <HStack gap={2}>
            <StatCard value={total} label="신청" />
            <StatCard value={maxPlayers} label="정원" />
          </HStack>

          <Card
            padding="none"
            className={cn("px-3.5 py-3", urgent ? "border-red-200 bg-red-50/40" : "border-gray-200")}
          >
            <HStack justify="between" align="baseline" gap={2}>
              <Text typography="subtitle2">마감 {formatDateTime(endDate)}</Text>
              <Text
                typography="subtitle2"
                className={cn("shrink-0 font-extrabold", urgent ? "text-red-600" : "text-gray-500")}
              >
                D-{remainingDays}
              </Text>
            </HStack>
            <Text typography="body3" foreground="muted" render={<p />} className="mt-1.5">
              마감되면 아래 확정 목록이 그대로 확정됩니다.
            </Text>
          </Card>

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
                <RosterRow
                  key={m.userId}
                  member={m}
                  subtitle={`${m.applicationRank}번째 신청`}
                  onMenu={() => setSheetMember(m)}
                />
              ))}
              {confirmed.length === 0 && (
                <div className="border-t border-gray-100 px-3 py-4">
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
                  상한 없음
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
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pending || isFull}
                      onClick={() =>
                        run(
                          () => promoteParticipant(gameId, m.userId),
                          `${m.username}님을 확정했습니다`,
                        )
                      }
                    >
                      확정으로
                    </Button>
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
        member={sheetMember}
        pending={pending}
        onOpenChange={(open) => !open && setSheetMember(null)}
        onDemote={(m) =>
          run(() => demoteParticipant(gameId, m.userId), `${m.username}님을 대기로 옮겼습니다`)
        }
        onRemove={(m) => {
          setSheetMember(null);
          setRemoving(m);
        }}
        waitingHead={waiting[0]?.username}
      />

      <ConfirmDialog
        open={removing !== null}
        onOpenChange={(open) => !open && setRemoving(null)}
        title="참여자 내보내기"
        description={
          removing
            ? `${removing.username}님을 내보내면 신청이 취소됩니다. 되돌릴 수 없어요.`
            : undefined
        }
        confirmLabel="내보내기"
        danger
        pending={pending}
        onConfirm={() =>
          removing && run(() => removeParticipant(gameId, removing.userId), "내보냈습니다")
        }
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

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <Card padding="none" className="flex-1 px-3.5 py-3.5">
      <Text className="text-[26px] font-extrabold leading-none tracking-tight tabular-nums">
        {value}
      </Text>
      <Text typography="body3" className="mt-1.5 font-semibold text-gray-600">
        {label}
      </Text>
    </Card>
  );
}

function RosterRow({
  member,
  subtitle,
  onMenu,
}: {
  member: ManagedMember;
  subtitle: string;
  onMenu: () => void;
}) {
  const availText = member.hasAvailability ? "가능 시간 입력" : "가능 시간 미입력";
  return (
    <HStack align="center" gap={3} className="min-h-14 border-t border-gray-100 px-3 py-2 first:border-t-0">
      <Avatar src={member.avatarUrl} name={member.username} size="stack" />
      <VStack gap={0} className="flex-1">
        <Text typography="subtitle2">{member.username}</Text>
        <Text
          typography="body4"
          className={member.hasAvailability ? "text-gray-500" : "text-amber-600"}
        >
          {subtitle} · {availText}
        </Text>
      </VStack>
      <button
        type="button"
        aria-label="참여자 메뉴"
        onClick={onMenu}
        className="flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-gray-200 text-gray-500 hover:bg-gray-50"
      >
        <MoreHorizontal size={16} aria-hidden />
      </button>
    </HStack>
  );
}

function MemberActionSheet({
  member,
  pending,
  onOpenChange,
  onDemote,
  onRemove,
  waitingHead,
}: {
  member: ManagedMember | null;
  pending: boolean;
  onOpenChange: (open: boolean) => void;
  onDemote: (m: ManagedMember) => void;
  onRemove: (m: ManagedMember) => void;
  waitingHead?: string;
}) {
  return (
    <Sheet.Root open={member !== null} onOpenChange={onOpenChange}>
      <Sheet.Content>
        {member && (
          <VStack gap={0}>
            <HStack align="center" gap={3} className="border-b border-gray-100 pb-3.5">
              <Avatar src={member.avatarUrl} name={member.username} size="lg" />
              <VStack gap={0}>
                <Text typography="subtitle1">{member.username}</Text>
                <Text typography="body4" foreground="muted">
                  확정 예정 · {member.applicationRank}번째 신청
                </Text>
              </VStack>
            </HStack>
            <button
              type="button"
              disabled={pending}
              onClick={() => onDemote(member)}
              className="flex min-h-13 items-center justify-between border-b border-gray-100 text-left text-[14.5px] text-gray-800 disabled:opacity-50"
            >
              대기로 이동
              <Text typography="body4" foreground="muted">
                대기 맨 앞
              </Text>
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => onRemove(member)}
              className="flex min-h-13 items-center text-left text-[14.5px] font-semibold text-red-600 disabled:opacity-50"
            >
              내보내기
            </button>
            {waitingHead && (
              <div className="mt-1.5 rounded-xl bg-gray-50 px-3 py-3">
                <Text typography="body4" foreground="muted" render={<p />}>
                  빈 자리는 대기 맨 앞({waitingHead})이 자동으로 채웁니다.
                </Text>
              </div>
            )}
          </VStack>
        )}
      </Sheet.Content>
    </Sheet.Root>
  );
}

const INHERITED = [
  { title: "게임 정보", desc: "룰 · 시놉시스 · 플레이타임" },
  { title: "대기자 자동 초대", desc: "확정 참여로 승계" },
  { title: "입력한 가능 시간표", desc: "조율을 처음부터 다시 안 함" },
];

function RoundSheet({
  open,
  onOpenChange,
  gameId,
  title,
  waitingCount,
  confirmedAt,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: string;
  title: string;
  waitingCount: number;
  confirmedAt: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");

  const minDate = confirmedAt
    ? new Date(new Date(confirmedAt).getTime() + 86_400_000).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  function submit() {
    startTransition(async () => {
      const result = await createSecondRound(gameId, { rangeStart, rangeEnd });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("다음 회차를 열었습니다");
      onOpenChange(false);
      if (result.redirect) router.push(result.redirect);
    });
  }

  return (
    <Sheet.Root open={open} onOpenChange={onOpenChange}>
      <Sheet.Content>
        <VStack gap={4}>
          <VStack gap={1}>
            <Text typography="heading3">다음 회차 만들기</Text>
            <Text typography="body3" foreground="muted">
              {title} · 대기 {waitingCount}명
            </Text>
          </VStack>

          <VStack gap={2}>
            <Text typography="body4" foreground="muted" className="font-bold">
              승계할 항목
            </Text>
            <div className="overflow-hidden rounded-xl border border-gray-200">
              {INHERITED.map((item) => (
                <HStack
                  key={item.title}
                  align="center"
                  gap={3}
                  className="min-h-13 border-b border-gray-100 px-3 py-2.5 last:border-b-0"
                >
                  <span className="flex size-5 items-center justify-center rounded-md bg-primary-600 text-white">
                    <Check size={12} aria-hidden />
                  </span>
                  <VStack gap={0}>
                    <Text typography="subtitle2">{item.title}</Text>
                    <Text typography="body4" foreground="hint">
                      {item.desc}
                    </Text>
                  </VStack>
                </HStack>
              ))}
            </div>
          </VStack>

          <HStack gap={3} align="start">
            <VStack gap={2} className="flex-1">
              <Text typography="body4" className="font-bold">
                조율 시작일
              </Text>
              <DatePicker value={rangeStart} onChange={setRangeStart} min={minDate} />
            </VStack>
            <VStack gap={2} className="flex-1">
              <Text typography="body4" className="font-bold">
                조율 종료일
              </Text>
              <DatePicker value={rangeEnd} onChange={setRangeEnd} min={rangeStart || minDate} />
            </VStack>
          </HStack>

          <HStack gap={2}>
            <Button variant="outline" className="w-24" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button
              className="flex-1"
              disabled={pending || !rangeStart || !rangeEnd}
              onClick={submit}
            >
              회차 열기
            </Button>
          </HStack>
        </VStack>
      </Sheet.Content>
    </Sheet.Root>
  );
}
