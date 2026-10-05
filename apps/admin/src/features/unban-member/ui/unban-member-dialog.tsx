"use client";

import { reasonLabel, USER_ACTION_REASON } from "@roll-and-call/database/moderation/model";
import { Button, Dialog, Text, VStack, toast } from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { conflictToastText, draftReason, formatDate, useActionSubmit } from "@/shared/lib";
import {
  ActionNetworkError,
  FactRows,
  ManualNoticePreview,
  ModalServerLabel,
  ReasonChips,
} from "@/shared/ui";

import { unbanServerMember } from "../api/unban-server-member";
import { unbanNoticeText } from "../model/unban-notice-text";

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
  const { pending, networkError, submit } = useActionSubmit(unbanServerMember);
  const [code, setCode] = useState<string | null>(null);
  const [otherText, setOtherText] = useState("");
  const reason = draftReason({ code, otherText });
  const reasonText = reason ? reasonLabel({ ...reason, reasons: USER_ACTION_REASON }) : "";
  const canUnban = Boolean(reason) && !pending;

  const unban = async () => {
    if (!reason) return;
    const result = await submit({ userId, reason });
    if (isUndefined(result)) return;
    onOpenChange(false);
    router.refresh();
    if (!result.ok) {
      toast.info(
        conflictToastText({ conflict: result.conflict, self: result.self, target: "차단 해제" }),
      );
      return;
    }
    if (result.discordUnbanned) toast.success(`${nickname}의 차단을 해제했습니다`);
  };

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
            {networkError ? <ActionNetworkError /> : null}
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
            <ReasonChips
              label="해제 사유"
              reasons={USER_ACTION_REASON}
              value={code}
              otherText={otherText}
              onValueChange={setCode}
              onOtherTextChange={setOtherText}
              disabled={pending}
            />
            <ManualNoticePreview text={unbanNoticeText(reasonText)} />
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
          <Button loading={pending} disabled={!canUnban} onClick={() => void unban()}>
            {networkError ? <RotateCcw size={16} aria-hidden /> : null}
            {networkError ? "다시 시도" : "차단 해제"}
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog.Root>
  );
}
