import "server-only";
import { loadUserBadges } from "@roll-and-call/database/web";
import { cache } from "react";

// cache는 인자를 Object.is로 견주므로 객체 대신 값 둘을 받는다.
export const getUserBadges = cache((serverId: string, userId: string) =>
  loadUserBadges({ serverId, userId }),
);
