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
    </Button>
  );
}
