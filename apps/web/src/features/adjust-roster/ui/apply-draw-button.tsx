"use client";

import { Button } from "@trpg/ui";

import { toast, useAction } from "@/shared/ui";

import { applyDrawResult } from "../api/apply-draw-result";

interface ApplyDrawButtonProps {
  gameId: string;
  className?: string;
}

export function ApplyDrawButton({ gameId, className }: ApplyDrawButtonProps) {
  const { pending, run } = useAction();

  function apply() {
    run(() => applyDrawResult(gameId), {
      onSuccess: () => toast.success("추첨 결과를 확정하고 알림을 보냈습니다"),
    });
  }

  return (
    <Button className={className} loading={pending} onClick={apply}>
      결과 확정하기
    </Button>
  );
}
