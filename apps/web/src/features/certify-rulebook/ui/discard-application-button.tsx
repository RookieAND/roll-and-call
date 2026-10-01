"use client";

import { Button, type ButtonProps } from "@roll-and-call/ui";
import { useState } from "react";

import { ConfirmDialog, toast, useAction } from "@/shared/ui";

import { discardApplicationRecord } from "../api/discard-application-record";

interface DiscardApplicationButtonProps {
  rulebookId: string;
  size?: ButtonProps["size"];
  className?: string;
}

export function DiscardApplicationButton({
  rulebookId,
  size,
  className,
}: DiscardApplicationButtonProps) {
  const [open, setOpen] = useState(false);
  const { pending, run } = useAction();

  const discard = () =>
    run(() => discardApplicationRecord(rulebookId), {
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
        size={size}
        className={className}
        onClick={() => setOpen(true)}
      >
        신청 취소
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="신청을 취소할까요?"
        description={
          <>
            신청 기록과 올린 사진이 모두 지워집니다.
            <br />
            인증이 필요하면 처음부터 다시 신청해야 합니다.
          </>
        }
        cancelLabel="돌아가기"
        confirmLabel="신청 취소"
        danger
        pending={pending}
        onConfirm={discard}
      />
    </>
  );
}
