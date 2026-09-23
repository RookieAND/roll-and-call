import { Button } from "@roll-and-call/ui";
import Link from "next/link";

import { CancelWaitlistButton } from "@/features/join-game";

import { SESSION_ACTION_KIND, type SessionCardModel } from "../model/session-card-model";

// 세션 시간을 정하는 한 수만 초록이다 — 03 확정 버튼과 같은 일이라서다.
const CONFIRM_KINDS: string[] = [SESSION_ACTION_KIND.confirmTime];

interface SessionCardActionProps {
  model: SessionCardModel;
}

export function SessionCardAction({ model }: SessionCardActionProps) {
  const { action } = model;
  if (!action) return null;

  if (action.kind === SESSION_ACTION_KIND.cancelWaitlist) {
    return (
      <CancelWaitlistButton
        gameId={model.id}
        title={model.title}
        label={action.label}
        waitlistRank={model.waitlistRank}
        className="mt-050 w-full"
      />
    );
  }

  const confirmKind = CONFIRM_KINDS.includes(action.kind);
  return (
    <Button
      render={<Link href={action.href} />}
      variant={confirmKind ? "solid" : "tinted"}
      colorPalette={confirmKind ? "success" : "primary"}
      className="mt-050 w-full"
    >
      {action.label}
    </Button>
  );
}
