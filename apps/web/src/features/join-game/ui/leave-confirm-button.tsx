"use client";

import { Button, type ButtonProps } from "@roll-and-call/ui";
import { Fragment, useState } from "react";

import { TRIAL_HANDLER, useTrialHandler } from "@/shared/trial";
import { ConfirmDialog, toast, useAction } from "@/shared/ui";

import { leaveGame } from "../api/leave-game";
import { leaveDialogCopy } from "../model/leave-dialog-copy";
import type { LeaveKind } from "../model/leave-kind";

interface LeaveConfirmButtonProps {
  gameId: string;
  kind: LeaveKind;
  waitlistRank?: number | null;
  label?: string;
  size?: ButtonProps["size"];
  className?: string;
}

// 구인 상세의 모든 취소는 확인 창을 거친다(D261, R4). 서버가 거절하면 창을 닫고 서버 문구를 토스트로 띄운다.
export function LeaveConfirmButton({
  gameId,
  kind,
  waitlistRank = null,
  label,
  size,
  className,
}: LeaveConfirmButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const { pending, run } = useAction();
  const leaveAction = useTrialHandler(TRIAL_HANDLER.leaveGame, leaveGame);
  const copy = leaveDialogCopy({ kind, waitlistRank });

  function leave() {
    run(() => leaveAction(gameId), {
      onSuccess: () => {
        setConfirming(false);
        toast.success(copy.successMessage);
      },
      onError: ({ error }) => {
        setConfirming(false);
        toast.danger(error);
      },
    });
  }

  return (
    <>
      <Button
        variant="outline"
        size={size}
        className={className}
        onClick={() => setConfirming(true)}
      >
        {label ?? copy.buttonLabel}
      </Button>
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title={copy.title}
        description={copy.lines.map((line, index) => (
          <Fragment key={line}>
            {index > 0 && <br />}
            {line}
          </Fragment>
        ))}
        cancelLabel="돌아가기"
        confirmLabel={copy.confirmLabel}
        danger
        pending={pending}
        onConfirm={leave}
      />
    </>
  );
}
