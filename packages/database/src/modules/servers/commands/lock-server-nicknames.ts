import { sql } from "drizzle-orm";

import type { Transaction } from "#/modules/transaction/transaction";

// 같은 서버의 닉네임 배정이 동시에 돌지 않게 트랜잭션이 끝날 때까지 잠근다.
export async function lockServerNicknames({
  transaction,
  serverId,
}: {
  transaction: Transaction;
  serverId: string;
}) {
  await transaction.execute(
    sql`select pg_advisory_xact_lock(hashtext(${`server_members.nickname:${serverId}`}))`,
  );
}
