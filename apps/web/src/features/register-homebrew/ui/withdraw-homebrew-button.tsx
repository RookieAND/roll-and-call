"use client";

import { Button } from "@roll-and-call/ui";
import { useState } from "react";

import { ConfirmDialog, LARGE_DIALOG_TITLE_CLASS, LineBreaks, toast, useAction } from "@/shared/ui";

import { withdrawHomebrew } from "../api/withdraw-homebrew";

interface WithdrawHomebrewButtonProps {
  applicationId: string;
  className?: string;
}

export function WithdrawHomebrewButton({ applicationId, className }: WithdrawHomebrewButtonProps) {
  const [open, setOpen] = useState(false);
  const { pending, run } = useAction();

  return (
    <>
      <Button
        variant="outline"
        colorPalette="danger"
        size="lg"
        className={className}
        onClick={() => setOpen(true)}
      >
        신청 거두기
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="신청을 거둘까요?"
        titleClassName={LARGE_DIALOG_TITLE_CLASS}
        description={
          <LineBreaks
            lines={[
              "거둔 신청의 자료는 30일 뒤에 삭제됩니다.",
              "다시 신청하려면 처음부터 입력해야 합니다.",
            ]}
          />
        }
        confirmLabel="거두기"
        danger
        pending={pending}
        onConfirm={() =>
          run(() => withdrawHomebrew(applicationId), {
            onSuccess: () => toast.success("신청을 거두었습니다"),
          })
        }
      />
    </>
  );
}
