"use client";

import { Button, type ButtonProps } from "@roll-and-call/ui";
import { useState } from "react";

import { ConfirmDialog, toast, useAction } from "@/shared/ui";

import { discardApplicationRecord } from "../api/discard-application-record";

interface DiscardApplicationButtonProps {
  rulebookId: string;
  stay?: boolean;
  size?: ButtonProps["size"];
  className?: string;
}

export function DiscardApplicationButton({
  rulebookId,
  stay = false,
  size,
  className,
}: DiscardApplicationButtonProps) {
  const [open, setOpen] = useState(false);
  const { pending, run } = useAction();

  const discard = () =>
    run(() => discardApplicationRecord({ rulebookId, stay }), {
      onSuccess: () => {
        setOpen(false);
        toast.success("기록을 지웠습니다");
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
        기록 지우기
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="기록을 지울까요?"
        description={
          <>
            신청 기록과 올린 사진이 모두 지워집니다.
            <br />
            인증이 필요하면 처음부터 다시 신청해야 합니다.
          </>
        }
        cancelLabel="돌아가기"
        confirmLabel="기록 지우기"
        danger
        pending={pending}
        onConfirm={discard}
      />
    </>
  );
}
