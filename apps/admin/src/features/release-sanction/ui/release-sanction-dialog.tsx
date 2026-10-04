"use client";

import { Button, Dialog, Field, TextInput, VStack, toast } from "@roll-and-call/ui";
import { isNull, isUndefined } from "es-toolkit";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { chosenReason, formatDateTime, useActionSubmit, USER_ACTION_REASON } from "@/shared/lib";
import type { Sanction } from "@/shared/server";
import {
  ActionNetworkError,
  FactBox,
  FactSub,
  ModalServerLabel,
  NotificationPreview,
  ReasonChips,
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
  const [chip, setChip] = useState<string | null>(null);
  const [otherText, setOtherText] = useState("");
  const [staffMemo, setStaffMemo] = useState("");
  const reason = chosenReason({ chip, otherText });
  const canRelease = Boolean(reason) && !pending;

  const until = sanction.until;
  const description = isNull(until)
    ? "무기한 제재를 지금 해제합니다"
    : `${formatDateTime(until)}까지 남은 제재를 지금 해제합니다`;
  const remaining = isNull(until)
    ? "무기한"
    : `${Math.max(1, Math.ceil((until.getTime() - Date.now()) / DAY))}일`;

  const release = async () => {
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
        <Dialog.Body className="mt-200">
          <VStack gap="150">
            {networkError ? <ActionNetworkError /> : null}
            <FactBox
              items={[
                {
                  label: "남은 기간",
                  value: (
                    <>
                      {remaining}
                      {until ? <FactSub>{`${formatDateTime(until)}까지`}</FactSub> : null}
                    </>
                  ),
                },
                { label: "제재 사유", value: sanction.reason },
              ]}
            />
            <ReasonChips
              label="해제 사유 (운영진 기록)"
              reasons={USER_ACTION_REASON}
              value={chip}
              otherText={otherText}
              onValueChange={setChip}
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
        <Dialog.Footer layout="row" className="items-center justify-end">
          <Dialog.Close render={<Button variant="ghost" colorPalette="gray" />} disabled={pending}>
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
