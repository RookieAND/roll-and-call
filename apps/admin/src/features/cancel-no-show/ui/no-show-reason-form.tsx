"use client";

import type { NotificationPayload } from "@roll-and-call/database/notifications/model";
import { Button, Dialog, Field, Textarea, VStack, toast } from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";
import { RotateCcw } from "lucide-react";
import { useState, type ReactNode } from "react";

import { conflictToastText, useActionSubmit } from "@/shared/lib";
import { ActionNetworkError, ModalServerLabel, NotificationPreview } from "@/shared/ui";

type SubmitResult =
  | { ok: true }
  | { ok: false; self: boolean; conflict: { by: string; at: Date } | null };

export interface NoShowReasonCopy {
  title: string;
  description: string;
  reasonLabel: string;
  placeholder: string;
  confirmLabel: string;
  successMessage: string;
}

interface NoShowReasonFormProps {
  copy: NoShowReasonCopy;
  summary: ReactNode;
  notification: NotificationPayload;
  submit: (reason: string) => Promise<SubmitResult>;
  onClose: () => void;
}

export const NO_SHOW_REASON_FIELD_ID = "no-show-reason";

// 취소와 되돌리기가 같이 쓴다. 다른 운영진이 먼저 처리했으면 창을 닫고 목록을 새로 읽은 뒤 토스트로 알린다(D296).
export function NoShowReasonForm({
  copy,
  summary,
  notification,
  submit,
  onClose,
}: NoShowReasonFormProps) {
  const [reason, setReason] = useState("");
  const action = useActionSubmit(submit);
  const canConfirm = Boolean(reason.trim()) && !action.pending;
  const confirmLabel = action.networkError ? "다시 시도" : copy.confirmLabel;

  const confirm = async () => {
    const result = await action.submit(reason.trim());
    if (isUndefined(result)) return;
    if (result.ok) {
      toast.success(copy.successMessage);
    } else {
      toast.info(
        conflictToastText({ conflict: result.conflict, self: result.self, target: "불참 기록" }),
      );
    }
    onClose();
  };

  return (
    <>
      <Dialog.Header>
        <ModalServerLabel />
        <Dialog.Title>{copy.title}</Dialog.Title>
        <Dialog.Description>{copy.description}</Dialog.Description>
      </Dialog.Header>
      <Dialog.Body>
        <VStack gap="150">
          {action.networkError ? <ActionNetworkError /> : null}
          {summary}
          <Field.Root
            label={copy.reasonLabel}
            htmlFor={NO_SHOW_REASON_FIELD_ID}
            required
            description="운영진 기록에만 남습니다."
          >
            <Textarea
              id={NO_SHOW_REASON_FIELD_ID}
              rows={2}
              value={reason}
              disabled={action.pending}
              placeholder={copy.placeholder}
              onChange={(event) => setReason(event.target.value)}
            />
          </Field.Root>
          <NotificationPreview payload={notification} recipients="당사자와 GM에게 알립니다." />
        </VStack>
      </Dialog.Body>
      <Dialog.Footer layout="row" className="items-center">
        <Dialog.Close
          render={<Button variant="ghost" colorPalette="gray" />}
          disabled={action.pending}
          className="ml-auto"
        >
          닫기
        </Dialog.Close>
        <Button disabled={!canConfirm} loading={action.pending} onClick={() => void confirm()}>
          {action.networkError ? <RotateCcw size={16} aria-hidden /> : null}
          {confirmLabel}
        </Button>
      </Dialog.Footer>
    </>
  );
}
