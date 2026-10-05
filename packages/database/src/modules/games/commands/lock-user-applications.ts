import { sql } from "drizzle-orm";

import type { Transaction } from "#/modules/transaction/transaction";

// 같은 사람이 서로 다른 구인에 동시에 신청해도 시간 겹침 검사가 줄을 서도록 트랜잭션이 끝날 때까지 잠근다.
export async function lockUserApplications({
  transaction,
  userId,
}: {
  transaction: Transaction;
  userId: string;
}) {
  await transaction.execute(
    sql`select pg_advisory_xact_lock(hashtext(${`participants.apply:${userId}`}))`,
  );
}
