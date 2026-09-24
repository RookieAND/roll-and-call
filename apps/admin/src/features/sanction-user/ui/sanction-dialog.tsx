"use client";

import { Button, Dialog, HStack, Text, toast } from "@roll-and-call/ui";
import { TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { formatMonthDay, formatSessionTime } from "@/shared/lib";
import type { OngoingActivity, Sanction, StaffRole } from "@/shared/server";
import type { OngoingChoiceRow } from "@/shared/ui";

import { sanctionUser } from "../api/sanction-user";
import { EMPTY_SANCTION_DRAFT, type SanctionDraft } from "../model/sanction-draft";
import { SanctionConflict } from "./sanction-conflict";
import { SanctionForm } from "./sanction-form";
import { SanctionPreviewDialog } from "./sanction-preview-dialog";

const DAY = 86_400_000;

interface SanctionDialogProps {
  userId: string;
  nickname: string;
  ongoing: OngoingActivity[];
  viewer: { nickname: string; role: StaffRole };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SanctionDialog({
  userId,
  nickname,
  ongoing,
  viewer,
  open,
  onOpenChange,
}: SanctionDialogProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [wasOpen, setWasOpen] = useState(open);
  const [draft, setDraft] = useState(EMPTY_SANCTION_DRAFT);
  const [previewing, setPreviewing] = useState(false);
  const [conflict, setConflict] = useState<Sanction | null>(null);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setDraft(EMPTY_SANCTION_DRAFT);
      setPreviewing(false);
      setConflict(null);
    }
  }

  const now = new Date();
  const days =
    draft.period === "indefinite"
      ? null
      : Number(draft.period === "custom" ? draft.customDays : draft.period);
  const validDays = days === null || (Number.isInteger(days) && days > 0);
  const end = days && validDays ? formatMonthDay(new Date(now.getTime() + days * DAY)) : null;
  const periodHint = !validDays
    ? "1일 이상의 일수를 입력해 주세요."
    : end
      ? `${formatMonthDay(now)}에 확정하면 ${end}까지 적용됩니다.`
      : "해제하기 전까지 적용됩니다.";
  const hasReason = Boolean(draft.userReason.trim());
  const canPreview = hasReason && validDays;

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
  const closedMemberCount = ongoing
    .filter((activity) => activity.hosted && draft.leftSessionIds.includes(activity.sessionId))
    .reduce((total, activity) => total + activity.memberCount, 0);

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
      setPreviewing(false);
      if (result.ok) {
        toast.success(`${nickname}님을 제재했습니다`);
        onOpenChange(false);
      } else setConflict(result.conflict);
    });

  const refresh = () => {
    router.refresh();
    onOpenChange(false);
  };

  return (
    <>
      <Dialog.Root open={open && !previewing} onOpenChange={(nextOpen) => onOpenChange(nextOpen)}>
        <Dialog.Popup className="max-w-[620px]">
          <Dialog.Header>
            <Dialog.Title>{nickname} 제재</Dialog.Title>
            {conflict ? null : (
              <Dialog.Description>
                모든 활동을 정지합니다. 참가 신청과 대기 신청, 구인 개설을 모두 할 수 없게 됩니다.
              </Dialog.Description>
            )}
          </Dialog.Header>
          <Dialog.Body className="mt-200">
            {conflict ? (
              <SanctionConflict
                nickname={nickname}
                conflict={conflict}
                userReason={draft.userReason}
                staffMemo={draft.staffMemo}
              />
            ) : (
              <SanctionForm
                draft={draft}
                periodHint={periodHint}
                rows={rows}
                onDraftChange={changeDraft}
                onChoiceChange={changeChoice}
              />
            )}
          </Dialog.Body>
          {conflict ? (
            <Dialog.Footer layout="row" className="items-center justify-end">
              <Dialog.Close render={<Button variant="ghost" colorPalette="gray" />}>
                닫기
              </Dialog.Close>
              <Button onClick={refresh}>유저 상세 새로고침</Button>
            </Dialog.Footer>
          ) : (
            <Dialog.Footer layout="row" className="items-center justify-end">
              {hasReason ? null : (
                <HStack align="center" gap="075" className="mr-auto text-hint">
                  <TriangleAlert size={14} aria-hidden />
                  <Text typography="body4" foreground="hint">
                    사유를 입력해야 확정할 수 있습니다
                  </Text>
                </HStack>
              )}
              <Dialog.Close render={<Button variant="ghost" colorPalette="gray" />}>
                취소
              </Dialog.Close>
              <Button
                colorPalette="danger"
                disabled={!canPreview}
                onClick={() => setPreviewing(true)}
              >
                미리보기 후 확정
              </Button>
            </Dialog.Footer>
          )}
        </Dialog.Popup>
      </Dialog.Root>
      <SanctionPreviewDialog
        open={open && previewing}
        nickname={nickname}
        days={days}
        end={end}
        userReason={draft.userReason}
        staffMemo={draft.staffMemo}
        rows={rows}
        closedMemberCount={closedMemberCount}
        viewer={viewer}
        pending={pending}
        onBack={() => setPreviewing(false)}
        onConfirm={confirm}
      />
    </>
  );
}
