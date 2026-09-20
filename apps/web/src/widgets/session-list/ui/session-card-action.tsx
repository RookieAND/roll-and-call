import { Button } from "@trpg/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { CancelWaitlistButton } from "@/features/join-game";

import { SESSION_ACTION_KIND, type SessionCardModel } from "../model/session-card-model";

// 세션을 여는 마지막 한 수는 초록이다 — 03 확정 버튼과 같은 색이어야 같은 일로 읽힌다.
const CONFIRM_KINDS: string[] = [
  SESSION_ACTION_KIND.confirmTime,
  SESSION_ACTION_KIND.confirmAttendance,
];

export function SessionCardAction({ model }: { model: SessionCardModel }) {
  const { action } = model;
  if (!action) return null;

  if (action.kind === SESSION_ACTION_KIND.cancelWaitlist) {
    return <CancelWaitlistButton gameId={model.id} title={model.title} className="mt-125 h-11" />;
  }

  const variant = CONFIRM_KINDS.includes(action.kind) ? "confirm" : "tinted";
  const isHostMenu = action.kind === SESSION_ACTION_KIND.hostMenu;

  return (
    <Button asChild variant={variant} className="mt-125 h-11 w-full gap-075">
      <Link href={action.href}>
        {action.label}
        {isHostMenu && <ChevronRight size={14} aria-hidden />}
      </Link>
    </Button>
  );
}
