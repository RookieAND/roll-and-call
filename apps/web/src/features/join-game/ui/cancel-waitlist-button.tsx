"use client";

import { Button } from "@roll-and-call/ui";
import { useState } from "react";

import { ConfirmDialog, toast, useAction } from "@/shared/ui";

import { leaveGame } from "../api/leave-game";

interface CancelWaitlistButtonProps {
  gameId: string;
  title: string;
  label: string;
  waitlistRank: number | null;
  className?: string;
}

export function CancelWaitlistButton({
  gameId,
  title,
  label,
  waitlistRank,
  className,
}: CancelWaitlistButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const { pending, run } = useAction();

  return (
    <>
      <Button
        variant="outline"
        colorPalette="gray"
        className={className}
        onClick={() => setConfirming(true)}
      >
        {label}
      </Button>
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title={waitlistRank === null ? "신청을 취소할까요?" : "대기를 취소할까요?"}
        description={
          waitlistRank === null ? (
            <>‘{title}’ 신청이 취소됩니다.</>
          ) : (
            <>
              ‘{title}’ 대기 {waitlistRank}번 순번이 사라집니다.
              <br />
              다시 신청하면 맨 뒤 순번으로 들어갑니다.
            </>
          )
        }
        cancelLabel="돌아가기"
        confirmLabel={label}
        danger
        pending={pending}
        onConfirm={() =>
          run(() => leaveGame(gameId), {
            onSuccess: () => {
              setConfirming(false);
              toast.success(`${label}했습니다`);
            },
          })
        }
      />
    </>
  );
}
