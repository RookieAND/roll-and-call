import { Button } from "@roll-and-call/ui";

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
  [SESSION_ACTION_KIND.viewGame]: { variant: "outline", colorPalette: "gray" },
};
const DEFAULT_LOOK: ActionLook = { variant: "tinted", colorPalette: "primary" };
// 하단 액션은 링크·취소 여부와 관계없이 같은 높이·글자 크기를 쓴다.
const ACTION_SIZE = "lg";

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
        size={ACTION_SIZE}
        className="w-full"
      />
    );
  }

  const look = ACTION_LOOK[action.kind] ?? DEFAULT_LOOK;
  return (
    <Button
      render={<ServerLink path={action.href} />}
      variant={look.variant}
      colorPalette={look.colorPalette}
      size={ACTION_SIZE}
      className="w-full"
    >
      {action.label}
    </Button>
  );
}
