import "server-only";
import { listSanctionedUserIds } from "@roll-and-call/database/moderation";
import type { Transaction } from "@roll-and-call/database/transaction";

import type { RosterTiming } from "../model/roster-timing";
import { RosterError } from "./roster-error";

// GM 본인이 정지 중이어도 명단 수정은 막지 않는다. 넣을 사람만 본다.
export async function rejectSanctioned({
  transaction,
  serverId,
  userIds,
  timing,
}: {
  transaction: Transaction;
  serverId: string;
  userIds: readonly string[];
  timing: RosterTiming;
}) {
  const sanctioned = await listSanctionedUserIds({
    executor: transaction,
    serverId,
    userIds,
    now: timing.now,
  });
  if (sanctioned.length > 0) throw new RosterError("활동 정지 중인 사람은 넣을 수 없습니다.");
}
