"use client";

import { Button, type ButtonProps } from "@roll-and-call/ui";
import { useState } from "react";

import { ConfirmDialog, toast, useAction } from "@/shared/ui";

import { withdrawApplication } from "../api/withdraw-application";

interface WithdrawApplicationButtonProps {
  rulebookId: string;
  bookCount: number;
  size?: ButtonProps["size"];
  className?: string;
}

export function WithdrawApplicationButton({
  rulebookId,
  bookCount,
  size,
  className = "w-full",
}: WithdrawApplicationButtonProps) {
  const [open, setOpen] = useState(false);
  const { pending, run } = useAction();
  const description =
    bookCount > 1
      ? `함께 낸 ${bookCount}권의 신청을 모두 취소합니다. 올린 사진도 함께 지워집니다.`
      : "신청을 취소하면 올린 사진도 함께 지워집니다.";

  const withdraw = () =>
    run(() => withdrawApplication(rulebookId), {
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
        description={description}
        cancelLabel="돌아가기"
        confirmLabel="신청 취소"
        danger
        pending={pending}
        onConfirm={withdraw}
      />
    </>
  );
}
