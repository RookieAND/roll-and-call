import { sql } from "drizzle-orm";

import { db } from "#db/client";
import type { Transaction } from "#db/modules/transaction";

// 읽기 이전(C36-3) 동안 games가 진실이라, 시간·출석·취소를 바꾼 명령이 끝나면 회차 1을 games 행에서 다시 맞춘다.
export async function syncFirstRound({
  transaction,
  gameId,
}: {
  transaction?: Transaction;
  gameId: string;
}) {
  await (transaction ?? db).execute(sql`select public.sync_game_first_round(${gameId}::uuid)`);
}
