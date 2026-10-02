import "server-only";
import { cache } from "react";

import { getStaffRole, type StaffRole } from "../admin-data";
import { getCurrentServer } from "./get-current-server";
import { getSessionAccount } from "./get-session-account";

export type CurrentStaff =
  | { status: "anonymous" }
  | { status: "denied"; nickname: string }
  | {
      status: "staff";
      id: string;
      nickname: string;
      role: StaffRole;
      platformAdmin: boolean;
      kind: "staff" | "platform";
    };

// 지금 서버(주소의 slug)에서의 역할. 플랫폼 관리자는 모든 서버에서 소유자다.
export const getCurrentStaff = cache(async (): Promise<CurrentStaff> => {
  const account = await getSessionAccount();
  if (!account) return { status: "anonymous" };
  const server = await getCurrentServer();
  const role = account.discordId
    ? await getStaffRole({ server, userId: account.userId, discordId: account.discordId })
    : null;
  if (!role) return { status: "denied", nickname: account.nickname };
  return {
    status: "staff",
    id: account.userId,
    nickname: account.nickname,
    role,
    platformAdmin: account.platformAdmin,
    kind: account.platformAdmin ? "platform" : "staff",
  };
});
