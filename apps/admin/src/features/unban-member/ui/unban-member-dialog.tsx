"use client";

import { Button, Dialog, Field, Text, Textarea, VStack } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { formatDate } from "@/shared/lib";
import { FactRows, ModalServerLabel } from "@/shared/ui";

import { unbanServerMember } from "../api/unban-server-member";

interface UnbanMemberDialogProps {
  userId: string;
  nickname: string;
  ban: { at: Date; by: string; reason: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UnbanMemberDialog({
  userId,
  nickname,
  ban,
  open,
  onOpenChange,
}: UnbanMemberDialogProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [reason, setReason] = useState("");
  const canUnban = Boolean(reason.trim()) && !pending;

  const unban = () =>
    startTransition(async () => {
      await unbanServerMember(userId, reason);
      setReason("");
      onOpenChange(false);
      router.refresh();
    });

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => pending || onOpenChange(nextOpen)}>
      <Dialog.Popup className="max-w-[560px]">
        <Dialog.Header>
          <ModalServerLabel />
          <Dialog.Title>{nickname}의 차단을 해제할까요?</Dialog.Title>
          <Dialog.Description>디스코드 차단도 함께 해제됩니다.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body className="mt-200">
          <VStack gap="175">
            <div className="rounded-400 border border-gray-200 bg-gray-50 px-175 py-050">
              <FactRows
                labelWidth={88}
                items={[
                  { label: "추방한 날", value: formatDate(ban.at) },
                  { label: "추방한 운영진", value: ban.by },
                  { label: "추방 사유", value: ban.reason },
                ]}
              />
            </div>
            <Field.Root label="해제 사유" htmlFor="unban-reason" required>
              <Textarea
                id="unban-reason"
                rows={2}
                placeholder="활동 기록에 남습니다"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              />
            </Field.Root>
            <Text typography="body4" foreground="muted">
              당사자가 서버에 다시 들어오면 일반 재가입처럼 처리되어 이전 인증과 GM 권한이
              복구됩니다.
            </Text>
          </VStack>
        </Dialog.Body>
        <Dialog.Footer layout="row" className="items-center justify-end">
          <Dialog.Close render={<Button variant="ghost" colorPalette="gray" />} disabled={pending}>
            취소
          </Dialog.Close>
          <Button loading={pending} disabled={!canUnban} onClick={unban}>
            차단 해제
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog.Root>
  );
}
