export const HOMEBREW_APPLICATION_STATUS = {
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
  withdrawn: "withdrawn",
} as const;

export const HOMEBREW_APPLICATION_STATUSES = [
  HOMEBREW_APPLICATION_STATUS.pending,
  HOMEBREW_APPLICATION_STATUS.approved,
  HOMEBREW_APPLICATION_STATUS.rejected,
  HOMEBREW_APPLICATION_STATUS.withdrawn,
] as const;

export type HomebrewApplicationStatus = (typeof HOMEBREW_APPLICATION_STATUSES)[number];
