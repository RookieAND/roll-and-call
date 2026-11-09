import { sql } from "drizzle-orm";

import type { Transaction } from "#db/modules/transaction";

// 사용자 제출과 구인 자동 요청이 같은 서버에서 중복 확인과 생성을 동시에 하지 않도록 한다.
// 기존 구인 경로의 분류별 동일성은 유지하므로 전역 UNIQUE 제약으로 바꾸지 않는다.
export async function lockRulebookRequests(transaction: Transaction, serverId: string) {
  await transaction.execute(
    sql`select pg_advisory_xact_lock(hashtextextended(${`rulebook-requests:${serverId}`}, 0))`,
  );
}
