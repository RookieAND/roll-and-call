export const AVAILABILITY_CHANGE = { added: "added", removed: "removed" } as const;

export type AvailabilityChangeKind = (typeof AVAILABILITY_CHANGE)[keyof typeof AVAILABILITY_CHANGE];
