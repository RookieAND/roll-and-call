"use client";

import { AlertDialog, Button } from "@roll-and-call/ui";
import { useRef } from "react";

import { formatDate } from "@/shared/lib";

interface ConfirmDateChangeDialogProps {
  change: { date: Date; kind: "set" | "postpone" } | null;
  currentDate: Date | null;
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

// 적용일은 모든 GM의 구인 개설에 걸리므로 확정 전에 바뀌는 날짜를 한 번 더 보여 준다.
export function ConfirmDateChangeDialog({
  change,
  currentDate,
  pending,
  onCancel,
  onConfirm,
}: ConfirmDateChangeDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const from = currentDate ? `${formatDate(currentDate)}에서 ` : "";
  const title = change?.kind === "postpone" ? "룰북 인증 적용일 연기" : "룰북 인증 적용일 지정";
  return (
    <AlertDialog.Root open={Boolean(change)} onOpenChange={(open) => (open ? null : onCancel())}>
      <AlertDialog.Popup initialFocus={cancelRef}>
        <AlertDialog.Header>
          <AlertDialog.Title>{title}</AlertDialog.Title>
          <AlertDialog.Description>
            {change
              ? `적용일을 ${from}${formatDate(change.date)}로 바꿉니다. 이 날부터 인증이 필요한 룰북은 인증을 받아야 구인을 열 수 있습니다.`
              : null}
          </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer layout="row" className="justify-end">
          <AlertDialog.Close
            ref={cancelRef}
            disabled={pending}
            render={<Button variant="ghost" colorPalette="gray" />}
          >
            취소
          </AlertDialog.Close>
          <Button loading={pending} onClick={onConfirm}>
            적용일 변경
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  );
}
