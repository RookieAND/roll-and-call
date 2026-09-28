"use client";

import { Button } from "@roll-and-call/ui";
import { useState } from "react";

import { ConfirmDialog, toast, useAction } from "@/shared/ui";

import { discardRejectedApplication } from "../api/discard-rejected-application";

interface DiscardRejectedButtonProps {
  rulebookId: string;
  className?: string;
}

// 반려된 신청을 기록째 지운다. 다시 신청하지 않을 책을 목록에서 치운다.
export function DiscardRejectedButton({ rulebookId, className }: DiscardRejectedButtonProps) {
  const [open, setOpen] = useState(false);
  const { pending, run } = useAction();

  const discard = () =>
    run(() => discardRejectedApplication(rulebookId), {
      onSuccess: () => {
        setOpen(false);
        toast.success("신청을 취소했습니다");
      },
    });

  return (
    <>
      <Button
        variant="outline"
        colorPalette="danger"
        className={className}
        onClick={() => setOpen(true)}
      >
        신청 취소
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="신청을 취소할까요?"
        description="반려된 신청 기록과 올린 사진이 모두 지워집니다. 인증이 필요하면 처음부터 다시 신청해야 합니다."
        cancelLabel="돌아가기"
        confirmLabel="신청 취소"
        danger
        pending={pending}
        onConfirm={discard}
      />
    </>
  );
}
