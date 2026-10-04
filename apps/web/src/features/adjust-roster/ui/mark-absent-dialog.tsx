"use client";

import { Callout, Field, Textarea, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { useId, useState, useTransition } from "react";

import { ConfirmDialog, handleActionResult, toast } from "@/shared/ui";

import { removeParticipant } from "../api/remove-participant";
import { ABSENCE_REASON_MAX_LENGTH } from "../model/absence-reason-of";
import type { MemberSummary } from "../model/member-summary";

interface MarkAbsentDialogProps {
  gameId: string;
  member: MemberSummary | null;
  onClose: () => void;
}

// 세션 시작 뒤 확정자를 불참으로 내보낸다. 네트워크 오류면 적은 사유를 남긴 채 다시 시도하게 한다.
export function MarkAbsentDialog({ gameId, member, onClose }: MarkAbsentDialogProps) {
  const [reason, setReason] = useState("");
  const [failed, setFailed] = useState(false);
  const [pending, startTransition] = useTransition();
  const reasonId = useId();

  function close(open: boolean) {
    if (open) return;
    setReason("");
    setFailed(false);
    onClose();
  }

  function markAbsent() {
    if (!member) return;
    startTransition(async () => {
      try {
        const result = await removeParticipant({
          gameId,
          userId: member.userId,
          absenceReason: reason,
        });
        setFailed(false);
        handleActionResult({
          result,
          onSuccess: () => {
            toast.success(`${member.username}님을 불참으로 내보냈습니다`);
            close(false);
          },
        });
      } catch {
        setFailed(true);
      }
    });
  }

  return (
    <ConfirmDialog
      open={!isNull(member)}
      onOpenChange={close}
      title="불참으로 내보내기"
      description={
        <>
          {member?.username}님을 명단에서 빼고 불참으로 기록합니다.
          <br />
          불참 기록은 프로필에 30일 동안 남습니다.
        </>
      }
      confirmLabel={failed ? "다시 시도" : "불참으로 내보내기"}
      danger
      pending={pending}
      onConfirm={markAbsent}
    >
      <VStack gap="150">
        <Field.Root
          label="불참 사유"
          htmlFor={reasonId}
          counter={`${reason.length}/${ABSENCE_REASON_MAX_LENGTH}`}
        >
          <Textarea
            id={reasonId}
            rows={2}
            value={reason}
            maxLength={ABSENCE_REASON_MAX_LENGTH}
            placeholder="사유(선택) · 운영진만 봅니다"
            onChange={(event) => setReason(event.target.value)}
          />
        </Field.Root>
        {failed ? (
          <Callout.Root colorPalette="danger" size="sm">
            <Callout.Icon />
            <Callout.Description>
              내보내지 못했습니다.
              <br />
              입력한 내용은 그대로 있습니다.
            </Callout.Description>
          </Callout.Root>
        ) : (
          <Callout.Root colorPalette="gray" size="sm">
            <Callout.Description>
              {member?.username}님에게 알림 탭으로 알립니다.
            </Callout.Description>
          </Callout.Root>
        )}
      </VStack>
    </ConfirmDialog>
  );
}
