"use client";

import { Button, cn } from "@trpg/ui";
import { useState } from "react";

import { ConfirmDialog, toast, useAction } from "@/shared/ui";

import { leaveGame } from "../api/leave-game";

interface CancelWaitlistButtonProps {
  gameId: string;
  title: string;
  className?: string;
}

// 지금은 대기를 물릴 방법이 앱 안에 없어 구인 상세로 되돌아가야 한다. 목록에서 바로 끝낸다.
export function CancelWaitlistButton({ gameId, title, className }: CancelWaitlistButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const { pending, run } = useAction();

  return (
    <>
      <Button
        variant="outline"
        className={cn("w-full text-danger-600", className)}
        loading={pending}
        onClick={() => setConfirming(true)}
      >
        대기 취소
      </Button>
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="대기 취소"
        description={`${title}의 대기를 취소할까요?\n대기 순번이 사라지고, 자리가 나도 더는 알리지 않습니다.`}
        cancelLabel="돌아가기"
        confirmLabel="대기 취소"
        danger
        onConfirm={() =>
          run(() => leaveGame(gameId), {
            onSuccess: () => toast.success("대기를 취소했습니다"),
          })
        }
      />
    </>
  );
}
