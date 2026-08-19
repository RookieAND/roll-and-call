import type { Availability } from "@/shared/api/db";

export type AvailabilityRow = Pick<Availability, "slotStart" | "userId"> & {
  user: { username: string } | null;
};

export type AvailabilityAggregate = {
  counts: Record<string, number>;
  names: Record<string, string[]>;
  mine: string[];
};
