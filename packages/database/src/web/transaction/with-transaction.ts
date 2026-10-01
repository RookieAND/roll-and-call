import { db } from "../../client";
import type { Transaction } from "./transaction";

// 앱의 가드(명단 조정·출석)가 잠금·확인·쓰기를 한 트랜잭션으로 묶을 때 쓴다. 던지면 모두 되돌린다.
export function withTransaction<Result>(work: (transaction: Transaction) => Promise<Result>) {
  return db.transaction(work);
}
