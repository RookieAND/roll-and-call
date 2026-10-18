import type { db } from "#db/client";

import type { Transaction } from "./transaction";

// 트랜잭션 안팎 어디서든 부를 수 있는 쿼리가 받는 실행기.
export type Executor = typeof db | Transaction;
