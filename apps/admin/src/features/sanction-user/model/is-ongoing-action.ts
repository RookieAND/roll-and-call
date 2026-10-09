import type { OngoingChoice } from "@/shared/server";

const ONGOING_ACTIONS: readonly OngoingChoice["action"][] = ["keep", "cancel", "leave"];

export function isOngoingAction(value: unknown): value is OngoingChoice["action"] {
  return ONGOING_ACTIONS.some((action) => action === value);
}
