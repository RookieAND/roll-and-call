"use client";

import { Field, Textarea } from "@roll-and-call/ui";
import { useId, useState } from "react";

import { ConfirmDialog } from "@/shared/ui";

import { ABSENCE_REASON_MAX_LENGTH } from "../model/absences-error";

interface AbsenceReasonDialogProps {
  open: boolean;
  username: string;
  initialReason: string;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}

// 부모가 key를 사람마다 바꿔 끼워 입력칸이 그 사람의 사유로 시작한다.
export function AbsenceReasonDialog({
  open,
  username,
  initialReason,
  onCancel,
  onConfirm,
}: AbsenceReasonDialogProps) {
  const [reason, setReason] = useState(initialReason);
  const reasonId = useId();

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onCancel();
      }}
      title="불참 사유를 남겨 주세요"
      description={`${username}님이 불참으로 기록됩니다. 사유는 운영진만 봅니다.`}
      confirmLabel="확정"
      onConfirm={() => onConfirm(reason)}
    >
      <Field.Root
        label="불참 사유"
        htmlFor={reasonId}
        counter={`${reason.length}/${ABSENCE_REASON_MAX_LENGTH}`}
      >
        <Textarea
          id={reasonId}
          autoComplete="off"
          rows={3}
          value={reason}
          maxLength={ABSENCE_REASON_MAX_LENGTH}
          placeholder="사유(선택) · 운영진만 봅니다"
          onChange={(event) => setReason(event.target.value)}
        />
      </Field.Root>
    </ConfirmDialog>
  );
}
