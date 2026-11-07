import "server-only";
import { getAdminReviewGameTitle } from "@roll-and-call/database/moderation";

import { getCurrentServer, requireStaff } from "@/shared/server";

// 후기 상세의 탭 제목은 구인 제목이다. 지운 후기는 없는 것으로 본다.
export async function getReviewTitle(id: string) {
  await requireStaff();
  return getAdminReviewGameTitle({ serverId: (await getCurrentServer()).id, id });
}
