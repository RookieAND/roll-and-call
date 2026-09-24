"use client";

import { Button, Grid, HStack, Text, VStack, cn, toast } from "@roll-and-call/ui";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { formatDate, formatSessionTime } from "@/shared/lib";
import type { OngoingActivity, Sanction } from "@/shared/server";
import type { OngoingChoiceRow } from "@/shared/ui";

import { sanctionUser } from "../api/sanction-user";
import { EMPTY_SANCTION_DRAFT, type SanctionDraft } from "../model/sanction-draft";
import { SanctionConfirmDialog } from "./sanction-confirm-dialog";
import { SanctionConflict } from "./sanction-conflict";
import { SanctionForm } from "./sanction-form";
import { SanctionSummary } from "./sanction-summary";

const DAY = 86_400_000;
const RESTRICTION = "제재 중에는 참가 신청과 대기 신청, 구인 개설을 모두 할 수 없습니다.";

interface SanctionUserFormProps {
  userId: string;
  nickname: string;
  ongoing: OngoingActivity[];
  backHref: string;
}

export function SanctionUserForm({ userId, nickname, ongoing, backHref }: SanctionUserFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [draft, setDraft] = useState<SanctionDraft>(EMPTY_SANCTION_DRAFT);
  const [confirming, setConfirming] = useState(false);
  const [conflict, setConflict] = useState<Sanction | null>(null);

  const now = new Date();
  const days =
    draft.period === "indefinite"
      ? null
      : Number(draft.period === "custom" ? draft.customDays : draft.period);
  const validDays = days === null || (Number.isInteger(days) && days > 0);
  const end = days && validDays ? formatDate(new Date(now.getTime() + days * DAY)) : null;
  const periodHint = !validDays
    ? "1일 이상의 일수를 입력해 주세요."
    : end
      ? `오늘(${formatDate(now)}) 확정하면 ${end}까지 적용됩니다. ${RESTRICTION}`
      : `해제하기 전까지 적용됩니다. ${RESTRICTION}`;
  const hasReason = Boolean(draft.userReason.trim());
  const canConfirm = hasReason && validDays && !pending;

  const rows: OngoingChoiceRow[] = ongoing.map((activity) => {
    const alternativeAction = activity.hosted ? "close" : "leave";
    return {
      id: activity.sessionId,
      title: activity.title,
      meta: activity.hosted
        ? `${formatSessionTime(activity.startsAt)} · 모집 중 ${activity.memberCount}/${activity.capacity} · 본인이 GM`
        : `${formatSessionTime(activity.startsAt)} · 참여 확정 · GM ${activity.gmNickname}`,
      alternativeLabel: activity.hosted ? "구인 닫기" : "참여 빼기",
      alternativeAction,
      action: draft.leftSessionIds.includes(activity.sessionId) ? alternativeAction : "keep",
    };
  });
  const closedCount = rows.filter((row) => row.action === "close").length;
  const keptCount = rows.filter((row) => row.action === "keep").length;
  const closedMemberCount = ongoing
    .filter((activity) => activity.hosted && draft.leftSessionIds.includes(activity.sessionId))
    .reduce((total, activity) => total + activity.memberCount, 0);
  const confirmDescription = [
    end
      ? `${days}일 동안, ${end}까지 모든 활동을 정지합니다.`
      : "해제하기 전까지 모든 활동을 정지합니다.",
    closedCount
      ? `구인 ${closedCount}건이 닫히고 참여자 ${closedMemberCount}명에게 알림이 갑니다.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const changeDraft = (changes: Partial<SanctionDraft>) => setDraft({ ...draft, ...changes });

  const changeChoice = (sessionId: string, action: string) =>
    changeDraft({
      leftSessionIds:
        action === "keep"
          ? draft.leftSessionIds.filter((item) => item !== sessionId)
          : [...draft.leftSessionIds, sessionId],
    });

  const confirm = () =>
    startTransition(async () => {
      const result = await sanctionUser(userId, {
        days,
        userReason: draft.userReason,
        staffMemo: draft.staffMemo,
        ongoing: rows.map((row) => ({ sessionId: row.id, action: row.action })),
      });
      setConfirming(false);
      if (!result.ok) {
        setConflict(result.conflict);
        return;
      }
      toast.success(`${nickname}님을 제재했습니다`);
      router.push(backHref);
    });

  return (
    <>
      <VStack gap="150" className="mx-auto w-full max-w-[1000px] flex-1 p-200">
        {conflict ? <SanctionConflict nickname={nickname} conflict={conflict} /> : null}
        <Grid
          aria-hidden={conflict ? true : undefined}
          className={cn(
            "grid-cols-[minmax(0,1fr)_320px] items-start gap-200",
            conflict && "pointer-events-none opacity-50",
          )}
        >
          <SanctionForm
            draft={draft}
            periodHint={periodHint}
            rows={rows}
            onDraftChange={changeDraft}
            onChoiceChange={changeChoice}
          />
          <SanctionSummary
            days={days}
            end={end}
            userReason={draft.userReason}
            closedCount={closedCount}
            closedMemberCount={closedMemberCount}
            keptCount={keptCount}
          />
        </Grid>
      </VStack>
      <HStack
        align="center"
        gap="125"
        className="sticky bottom-0 z-(--rc-z-sticky) border-t border-gray-200 bg-surface px-200 py-150"
      >
        {hasReason || conflict ? (
          <Text typography="body4" foreground="hint">
            확정하면 다른 운영진에게 디스코드 알림이 갑니다. 제재는 활동 기록에 남습니다.
          </Text>
        ) : (
          <HStack align="center" gap="075" className="text-hint">
            <TriangleAlert size={14} aria-hidden />
            <Text typography="body4" foreground="hint">
              사유를 입력해야 확정할 수 있습니다
            </Text>
          </HStack>
        )}
        <HStack gap="100" className="ml-auto">
          {conflict ? (
            <>
              <Button variant="ghost" colorPalette="gray" render={<Link href={backHref} />}>
                닫기
              </Button>
              <Button onClick={() => router.push(backHref)}>유저 상세 새로고침</Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                colorPalette="gray"
                disabled={pending}
                render={<Link href={backHref} />}
              >
                취소
              </Button>
              <Button
                colorPalette="danger"
                disabled={!canConfirm}
                onClick={() => setConfirming(true)}
                className="min-w-[128px]"
              >
                제재 확정
              </Button>
            </>
          )}
        </HStack>
      </HStack>
      <SanctionConfirmDialog
        open={confirming}
        nickname={nickname}
        description={confirmDescription}
        pending={pending}
        onBack={() => setConfirming(false)}
        onConfirm={confirm}
      />
    </>
  );
}
