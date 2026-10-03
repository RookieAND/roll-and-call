import { db } from "#/client";
import { servers } from "#/schema";

// ponytail: 등록된 서버를 모두 읽는다. 크론만 쓰고, 서버가 수백 개로 늘면 나눠 돈다.
export async function listServers() {
  return db.select().from(servers);
}
