"use client";

import { isNull } from "es-toolkit";

import { LEAVE_KIND } from "../model/leave-kind";
import { LeaveConfirmButton } from "./leave-confirm-button";

interface CancelWaitlistButtonProps {
  gameId: string;
  title: string;
  label: string;
  waitlistRank: number | null;
  className?: string;
}

// 마이페이지 내 세션 카드의 대기·신청 취소. 순번이 없으면 추첨 신청자다. 창은 구인 상세와 같다(D2·D3).
export function CancelWaitlistButton({
  gameId,
  label,
  waitlistRank,
  className,
}: CancelWaitlistButtonProps) {
  const kind = isNull(waitlistRank) ? LEAVE_KIND.lottery : LEAVE_KIND.waitlist;
  return (
    <LeaveConfirmButton
      gameId={gameId}
      kind={kind}
      waitlistRank={waitlistRank}
      label={label}
      className={className}
    />
  );
}
