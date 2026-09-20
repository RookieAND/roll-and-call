import { Button } from "@trpg/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { CancelWaitlistButton } from "@/features/join-game";

import { SESSION_ACTION_KIND, type SessionCardModel } from "../model/session-card-model";

// 세션 시간을 정하는 한 수만 초록이다 — 03 확정 버튼과 같은 일이라서다.
// 출석 확인은 03이 아니라 11의 일이고, 시안에서 보라다.
const CONFIRM_KINDS: string[] = [SESSION_ACTION_KIND.confirmTime];

interface SessionCardActionProps {
  model: SessionCardModel;
}

export function SessionCardAction({ model }: SessionCardActionProps) {
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
