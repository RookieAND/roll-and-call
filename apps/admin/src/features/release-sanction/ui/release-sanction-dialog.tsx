"use client";

import { USER_ACTION_REASON } from "@roll-and-call/database/moderation/model";
import { Button, Dialog, Field, TextInput, VStack, toast } from "@roll-and-call/ui";
import { isNull, isUndefined } from "es-toolkit";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { draftReason, formatDate, useActionSubmit } from "@/shared/lib";
import type { Sanction } from "@/shared/server";
import {
  ActionNetworkError,
  FactBox,
  FactSub,
  ModalServerLabel,
  NotificationPreview,
  ReasonChips,
  MODAL_FOOTER_CLASS,
} from "@/shared/ui";

import { releaseUserSanction } from "../api/release-user-sanction";

const DAY = 86_400_000;

interface ReleaseSanctionDialogProps {
  userId: string;
  nickname: string;
  sanction: Sanction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReleaseSanctionDialog({
  userId,
  nickname,
  sanction,
  open,
  onOpenChange,
}: ReleaseSanctionDialogProps) {
  const router = useRouter();
  const { pending, networkError, submit } = useActionSubmit(releaseUserSanction);
  const [code, setCode] = useState<string | null>(null);
  const [otherText, setOtherText] = useState("");
  const [staffMemo, setStaffMemo] = useState("");
  const reason = draftReason({ code, otherText });
  const canRelease = Boolean(reason) && !pending;

  const until = sanction.until;
  const description = "해제하는 즉시 참가 신청·구인 개설·룰북 인증 신청을 다시 할 수 있습니다.";
  const remaining = isNull(until)
    ? null
    : `${Math.max(1, Math.ceil((until.getTime() - Date.now()) / DAY))}일 남음`;

  const release = async () => {
    if (!reason) return;
    const result = await submit({ userId, input: { reason, staffMemo } });
    if (isUndefined(result)) return;
    onOpenChange(false);
    router.refresh();
    if (result.ok) toast.success(`${nickname}님의 제재를 해제했습니다`);
    else toast.info("이미 해제된 제재입니다");
  };

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => pending || onOpenChange(nextOpen)}>
      <Dialog.Popup className="max-w-[540px]">
        <Dialog.Header>
          <ModalServerLabel />
          <Dialog.Title>{nickname} 제재 해제</Dialog.Title>
          <Dialog.Description>{description}</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <VStack gap="175">
            {networkError ? <ActionNetworkError /> : null}
            <FactBox
              items={[
                {
                  label: "현재 제재",
                  value: (
                    <>
                      {until ? `${formatDate(until)}까지` : "무기한"}
                      {remaining ? <FactSub>{remaining}</FactSub> : null}
                    </>
                  ),
                },
                { label: "제재 사유", value: sanction.reason },
              ]}
            />
            <ReasonChips
              label="해제 사유 (운영진 기록)"
              reasons={USER_ACTION_REASON}
              value={code}
              otherText={otherText}
              onValueChange={setCode}
              onOtherTextChange={setOtherText}
              help="사용자에게는 보이지 않고 활동 기록에 남습니다."
              disabled={pending}
            />
            <Field.Root label="운영진 메모 (사용자에게 안 보임)" htmlFor="release-staff-memo">
              <TextInput
                id="release-staff-memo"
                placeholder="선택"
                value={staffMemo}
                disabled={pending}
                onChange={(event) => setStaffMemo(event.target.value)}
              />
            </Field.Root>
            <NotificationPreview payload={{ kind: "sanction_released", params: {} }} />
          </VStack>
        </Dialog.Body>
        <Dialog.Footer layout="row" className={MODAL_FOOTER_CLASS}>
          <Dialog.Close
            render={<Button variant="outline" colorPalette="gray" />}
            disabled={pending}
          >
            취소
          </Dialog.Close>
          <Button loading={pending} disabled={!canRelease} onClick={() => void release()}>
            {networkError ? <RotateCcw size={16} aria-hidden /> : null}
            {networkError ? "다시 시도" : "해제 확정"}
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog.Root>
  );
}
