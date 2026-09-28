import { Button } from "@roll-and-call/ui";
import Link from "next/link";

import { CancelWaitlistButton } from "@/features/join-game";

import {
  SESSION_ACTION_KIND,
  type SessionActionKind,
  type SessionCardModel,
} from "../model/session-card-model";

type ActionLook = {
  variant: "solid" | "outline" | "tinted";
  colorPalette: "primary" | "success" | "gray";
};

// 세션 시간을 정하는 한 수만 초록이다 — 03 확정 버튼과 같은 일이라서다. 후기 쓰기는 기한이 있어 채우고, 내 후기 보기는 옅게 둔다.
const ACTION_LOOK: Partial<Record<SessionActionKind, ActionLook>> = {
  [SESSION_ACTION_KIND.confirmTime]: { variant: "solid", colorPalette: "success" },
  [SESSION_ACTION_KIND.writeReview]: { variant: "solid", colorPalette: "primary" },
  [SESSION_ACTION_KIND.viewReview]: { variant: "outline", colorPalette: "gray" },
};
const DEFAULT_LOOK: ActionLook = { variant: "tinted", colorPalette: "primary" };

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

  const look = ACTION_LOOK[action.kind] ?? DEFAULT_LOOK;
  return (
    <Button
      render={<Link href={action.href} />}
      variant={look.variant}
      colorPalette={look.colorPalette}
      className="mt-050 w-full"
    >
      {action.label}
    </Button>
  );
}
