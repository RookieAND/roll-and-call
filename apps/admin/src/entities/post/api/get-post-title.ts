import "server-only";
import { getAdminGameTitle } from "@roll-and-call/database/moderation";

import { getCurrentServer, requireStaff } from "@/shared/server";

// 탭 제목만 필요할 때 쓴다. 상세 전체를 계산하지 않는다.
export async function getPostTitle(id: string) {
  await requireStaff();
  return getAdminGameTitle({ serverId: (await getCurrentServer()).id, id });
}
