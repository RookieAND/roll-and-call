import type { Availability } from "@roll-and-call/database";
export type AvailabilityRow = Pick<Availability, "slotStart" | "userId"> & {
  user: { username: string } | null;
};

export type AvailabilityAggregate = {
  counts: Record<string, number>;
  names: Record<string, string[]>;
  mine: string[];
};
