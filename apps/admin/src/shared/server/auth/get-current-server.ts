import "server-only";
import { getDefaultServer } from "@roll-and-call/database/servers";
import { connection } from "next/server";
import { cache } from "react";

// 어드민에는 아직 서버 선택이 없어 기본 서버를 다룬다.
// connection()으로 요청 시점에만 돌게 해, 빌드의 정적 렌더링이 DB를 읽지 않게 한다.
export const getCurrentServer = cache(async () => {
  await connection();
  return getDefaultServer();
});
