"use client";

import { Button } from "@roll-and-call/ui";
import { useState } from "react";

import { ConfirmDialog, toast, useAction } from "@/shared/ui";

import { cancelCertification } from "../api/cancel-certification";

interface CancelApplicationButtonProps {
  rulebookId: string;
  className?: string;
}

export function CancelApplicationButton({
  rulebookId,
  className = "w-full",
}: CancelApplicationButtonProps) {
  const [open, setOpen] = useState(false);
  const { pending, run } = useAction();

  const cancel = () =>
    run(() => cancelCertification(rulebookId), {
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
        size="lg"
        className={className}
        onClick={() => setOpen(true)}
      >
        신청 취소
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="신청을 취소할까요?"
        description="신청을 취소하면 올린 사진도 함께 지워집니다."
        cancelLabel="돌아가기"
        confirmLabel="신청 취소"
        danger
        pending={pending}
        onConfirm={cancel}
      />
    </>
  );
}
