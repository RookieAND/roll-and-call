import { eq } from "drizzle-orm";

import { db } from "#db/client";
import { rulebooks } from "#db/schema";

// 이름·판만. 활동 기록 대상 글자에서 룰북을 찾을 때 쓴다.
export function listAdminRulebookLabels({ serverId }: { serverId: string }) {
  return db
    .select({ id: rulebooks.id, name: rulebooks.name, edition: rulebooks.edition })
    .from(rulebooks)
    .where(eq(rulebooks.serverId, serverId));
}
