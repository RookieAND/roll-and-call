import "server-only";
import { getCurrentServer as loadCurrentServer } from "@roll-and-call/database/servers";
import { connection } from "next/server";
import { cache } from "react";

// 레이아웃·페이지·액션이 같은 요청에서 여러 번 불러도 servers는 한 번만 읽는다.
// connection()으로 요청 시점에만 돌게 해, 빌드의 정적 렌더링이 DB를 읽지 않게 한다.
export const getCurrentServer = cache(async () => {
  await connection();
  return loadCurrentServer();
});
