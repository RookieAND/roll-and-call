import { Button } from "@trpg/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { CancelWaitlistButton } from "@/features/join-game";

import { SESSION_ACTION_KIND, type SessionCardModel } from "../model/session-card-model";

const SOLID_KINDS: string[] = [
  SESSION_ACTION_KIND.confirmTime,
  SESSION_ACTION_KIND.confirmAttendance,
];

export function SessionCardAction({ model }: { model: SessionCardModel }) {
  const { action } = model;
  if (!action) return null;

  if (action.kind === SESSION_ACTION_KIND.cancelWaitlist) {
    return <CancelWaitlistButton gameId={model.id} title={model.title} className="mt-2.5 h-11" />;
  }

  const variant = SOLID_KINDS.includes(action.kind) ? "solid" : "tinted";
  const isHostMenu = action.kind === SESSION_ACTION_KIND.hostMenu;

  return (
    <Button asChild variant={variant} className="mt-2.5 h-11 w-full gap-1.5">
      <Link href={action.href}>
        {action.label}
        {isHostMenu && <ChevronRight size={14} aria-hidden />}
      </Link>
    </Button>
  );
}
