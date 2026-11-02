import { Badge, Button } from "@roll-and-call/ui";

import { CancelWaitlistButton } from "@/features/join-game";
import { ServerLink } from "@/shared/ui";

import {
  SESSION_ACTION_KIND,
  type SessionActionKind,
  type SessionCardModel,
} from "../model/session-card-model";

type ActionLook = {
  variant: "solid" | "outline" | "tinted";
  colorPalette: "primary" | "success" | "gray";
};

const ACTION_LOOK: Partial<Record<SessionActionKind, ActionLook>> = {
  [SESSION_ACTION_KIND.submitAvailability]: { variant: "solid", colorPalette: "primary" },
  [SESSION_ACTION_KIND.confirmTime]: { variant: "solid", colorPalette: "success" },
  [SESSION_ACTION_KIND.writeReview]: { variant: "solid", colorPalette: "primary" },
  [SESSION_ACTION_KIND.viewReview]: { variant: "outline", colorPalette: "gray" },
};
// 꽉 찬 버튼 위에서는 반투명 흰 알약, 나머지 버튼 위에서는 회색 알약이다.
const ACTION_BADGE_CLASS: Record<ActionLook["variant"], string> = {
  solid: "bg-white/20 text-current",
  outline: "bg-secondary text-current",
  tinted: "bg-secondary text-current",
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
      render={<ServerLink path={action.href} />}
      variant={look.variant}
      colorPalette={look.colorPalette}
      className="mt-050 w-full"
    >
      {action.label}
      {action.badge && (
        <Badge colorPalette="gray" className={ACTION_BADGE_CLASS[look.variant]}>
          {action.badge}
        </Badge>
      )}
    </Button>
  );
}
