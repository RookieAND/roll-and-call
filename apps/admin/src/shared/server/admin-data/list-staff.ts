import "server-only";
import { loadSnapshot } from "./snapshot";
import type { Staff } from "./types";

export interface StaffRow extends Staff {
  lastActiveAt?: Date;
}

// 소유자가 먼저, 그다음 추가한 순서. 최근 활동은 그 운영진이 남긴 마지막 활동 기록이다.
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
