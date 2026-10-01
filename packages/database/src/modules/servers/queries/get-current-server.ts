import { eq } from "drizzle-orm";

import { db } from "../../../client";
import { servers } from "../../../schema";

// 지금은 DEFAULT_SERVER_SLUG 하나로 정한다. /[server] 라우트가 생기면 이 함수만 라우트 값을 읽게 바꾼다.
export async function getCurrentServer() {
  const slug = process.env.DEFAULT_SERVER_SLUG;
  if (!slug) throw new Error("DEFAULT_SERVER_SLUG not set");
  const [server] = await db.select().from(servers).where(eq(servers.slug, slug));
  if (!server) throw new Error(`server "${slug}" not found`);
  return server;
}
