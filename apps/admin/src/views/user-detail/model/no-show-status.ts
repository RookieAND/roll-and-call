import { NO_SHOW_STATUS, type NoShowStatus } from "@/shared/lib";

interface NoShowState {
  cancelled: boolean;
  expired: boolean;
}

export function noShowStatus({ cancelled, expired }: NoShowState): NoShowStatus {
  if (cancelled) return NO_SHOW_STATUS.cancelled;
  if (expired) return NO_SHOW_STATUS.expired;
  return NO_SHOW_STATUS.valid;
}
