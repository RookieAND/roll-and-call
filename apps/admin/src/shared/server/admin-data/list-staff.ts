import "server-only";
import { loadSnapshot } from "./snapshot";
import type { Staff } from "./types";

export interface StaffRow extends Staff {
  lastActiveAt?: Date;
}

export async function listStaff(): Promise<StaffRow[]> {
  const db = await loadSnapshot();
  return db.staff
    .map((staff) => ({
      ...staff,
      lastActiveAt: db.auditLog
        .filter((entry) => entry.actor === staff.nickname)
        .reduce<Date | undefined>(
          (latest, entry) => (!latest || entry.at > latest ? entry.at : latest),
          undefined,
        ),
    }))
    .toSorted(
      (a, b) =>
        Number(b.role === "owner") - Number(a.role === "owner") ||
        a.since.getTime() - b.since.getTime(),
    );
}
