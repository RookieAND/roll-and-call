"use client";

import { Button } from "@roll-and-call/ui";
import { useState } from "react";

import { ConfirmDialog, toast, useAction } from "@/shared/ui";

import { withdrawApplication } from "../api/withdraw-application";

interface CancelApplicationButtonProps {
  rulebookId: string;
  // 함께 낸 책 수. 두 권 이상이면 묶음 전체를 거둔다고 알린다.
  bookCount: number;
  className?: string;
}

export function CancelApplicationButton({
  rulebookId,
  bookCount,
  className = "w-full",
}: CancelApplicationButtonProps) {
  const [open, setOpen] = useState(false);
  const { pending, run } = useAction();
  const description =
    bookCount > 1
      ? `함께 낸 ${bookCount}권의 신청을 모두 거둡니다. 올린 사진도 함께 지워집니다.`
      : "신청을 거두면 올린 사진도 함께 지워집니다.";

  const withdraw = () =>
    run(() => withdrawApplication(rulebookId), {
      onSuccess: () => {
        setOpen(false);
        toast.success("신청을 거뒀습니다");
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
        신청 거두기
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="신청을 거둘까요?"
        description={description}
        cancelLabel="돌아가기"
        confirmLabel="신청 거두기"
        danger
        pending={pending}
        onConfirm={withdraw}
      />
    </>
  );
}
