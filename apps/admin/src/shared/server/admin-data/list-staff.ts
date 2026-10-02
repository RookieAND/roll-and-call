import "server-only";
import { getServerOwnerProfile } from "@roll-and-call/database/servers";

import { getCurrentServer } from "../auth/get-current-server";
import { loadSnapshot } from "./snapshot";
import type { Staff } from "./types";

export interface StaffRow extends Omit<Staff, "since"> {
  since?: Date;
  lastActiveAt?: Date;
}

// 소유자는 디스코드 서버장이라 staff 표에 없을 수 있다. 맨 위에 두고, 나머지는 모두 운영진이다.
// ponytail: 서버장을 아직 못 읽은 서버(owner_discord_id가 비어 있음)는 staff 표의 예전 owner 역할을 그대로 쓴다.
export async function listStaff(): Promise<StaffRow[]> {
  const [db, server] = await Promise.all([loadSnapshot(), getCurrentServer()]);
  const owner = await getServerOwnerProfile({ serverId: server.id });
  const lastActiveOf = (nickname: string) =>
    db.auditLog
      .filter((entry) => entry.actor === nickname)
      .reduce<Date | undefined>(
        (latest, entry) => (!latest || entry.at > latest ? entry.at : latest),
        undefined,
      );
  const members: StaffRow[] = db.staff
    .filter((staff) => staff.userId !== owner?.userId)
    .map((staff) => ({
      ...staff,
      role: server.ownerDiscordId ? "staff" : staff.role,
      lastActiveAt: lastActiveOf(staff.nickname),
    }));
  const ownerRow: StaffRow[] = owner
    ? [
        {
          userId: owner.userId,
          nickname: owner.nickname,
          role: "owner",
          discordId: server.ownerDiscordId ?? undefined,
          lastActiveAt: lastActiveOf(owner.nickname),
        },
      ]
    : [];
  return [
    ...ownerRow,
    ...members.toSorted(
      (a, b) =>
        Number(b.role === "owner") - Number(a.role === "owner") ||
        (a.since?.getTime() ?? 0) - (b.since?.getTime() ?? 0),
    ),
  ];
}
