import "server-only";
import { listAdminMemberNicknames } from "@roll-and-call/database/moderation";

import { getCurrentServer, requireStaff } from "@/shared/server";

export async function getUserNickname(id: string) {
  await requireStaff();
  const [user] = await listAdminMemberNicknames({
    serverId: (await getCurrentServer()).id,
    userIds: [id],
  });
  return user?.nickname;
}
