import { getCurrentServer, getGamesByGm, getJoinedGames, getProfile } from "@/shared/server";

import { buildProfileSessions } from "../model/build-profile-sessions";
import { recentAbsences } from "../model/recent-absences";

// uuid가 아닌 값을 넘기면 Postgres가 캐스팅 에러를 던지므로 없는 사용자로 본다.
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function loadProfile(userId: string) {
  if (!UUID_PATTERN.test(userId)) return null;
  const server = await getCurrentServer();
  const [profile, hosted, joined] = await Promise.all([
    getProfile(server.id, userId),
    getGamesByGm({ serverId: server.id, userId }),
    getJoinedGames({ serverId: server.id, userId }),
  ]);
  if (!profile) return null;
  return {
    profile,
    sessions: buildProfileSessions({ hosted, joined, userId }),
    absences: recentAbsences({ joined, userId }),
  };
}
