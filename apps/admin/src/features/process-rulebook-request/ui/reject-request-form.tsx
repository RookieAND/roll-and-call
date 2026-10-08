"use client";

import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";
import { Button, Dialog, Field, Text, TextInput, Textarea, VStack, toast } from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

import {
  conflictToastText,
  quoteWithParticle,
  useActionSubmit,
  withObjectParticle,
  withSubjectParticle,
} from "@/shared/lib";
import type { RulebookRequestRow } from "@/shared/server";
import {
  ActionNetworkError,
  ModalServerLabel,
  NotificationPreview,
  MODAL_FOOTER_CLASS,
} from "@/shared/ui";

import { rejectRequest } from "../api/reject-request";
import { REJECT_REASON_MAX_LENGTH } from "../model/reject-reason-max-length";

interface RejectRequestFormProps {
  request: RulebookRequestRow;
  viewerId: string;
  onDone: () => void;
}

export function RejectRequestForm({ request, viewerId, onDone }: RejectRequestFormProps) {
  const { pending, networkError, submit } = useActionSubmit(rejectRequest);
  const [userReason, setUserReason] = useState("");
  const [staffMemo, setStaffMemo] = useState("");

  const canConfirm = Boolean(userReason.trim()) && !pending;

  const confirm = async () => {
    const result = await submit(request.id, { userReason, staffMemo });
    if (isUndefined(result)) return;
    if (!result.ok) {
      const { conflict } = result;
      toast.info(
        conflictToastText({ conflict, self: conflict?.byId === viewerId, target: "요청" }),
      );
      onDone();
      return;
    }
    toast.success(`「${request.name}」 추가 요청을 반려했습니다`);
    onDone();
  };

  return (
    <>
      <Dialog.Header>
        <ModalServerLabel />
        <Dialog.Title>룰북 추가 요청 반려</Dialog.Title>
        <Dialog.Description>
          {withSubjectParticle(request.requesterNickname)} 요청한{" "}
          {quoteWithParticle(request.name, withObjectParticle)} 등록하지 않습니다
        </Dialog.Description>
      </Dialog.Header>
      <Dialog.Body>
        <VStack gap="150">
          {networkError ? <ActionNetworkError /> : null}
          <Field.Root
            label="사용자에게 보이는 사유"
            htmlFor="reject-request-user-reason"
            required
            description="요청자의 내 룰북 화면에 그대로 보입니다."
          >
            <TextInput
              id="reject-request-user-reason"
              value={userReason}
              maxLength={REJECT_REASON_MAX_LENGTH}
              onChange={(event) => setUserReason(event.target.value)}
            />
          </Field.Root>
          <Field.Root label="운영진 메모 (사용자에게 안 보임)" htmlFor="reject-request-staff-memo">
            <Textarea
              id="reject-request-staff-memo"
              rows={1}
              placeholder="선택"
              value={staffMemo}
              onChange={(event) => setStaffMemo(event.target.value)}
            />
          </Field.Root>
          <NotificationPreview
            payload={{
              kind: NOTIFICATION_KIND.rulebookRequestDeclined,
              params: { rulebookName: request.name },
            }}
            recipients="요청자의 알림 탭으로 알립니다."
          />
          <Text typography="body4" foreground="hint">
            사유를 입력해야 반려할 수 있습니다.
          </Text>
        </VStack>
      </Dialog.Body>
      <Dialog.Footer layout="row" className={MODAL_FOOTER_CLASS}>
        <Dialog.Close render={<Button variant="outline" colorPalette="gray" />} disabled={pending}>
          취소
        </Dialog.Close>
        <Button
          colorPalette="danger"
          loading={pending}
          disabled={!canConfirm}
          onClick={() => void confirm()}
        >
          {networkError ? <RotateCcw size={16} aria-hidden /> : null}
          {networkError ? "다시 시도" : "반려"}
        </Button>
      </Dialog.Footer>
    </>
  );
}
