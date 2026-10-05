import { isUuid } from "@/shared/lib";
import { getCurrentServer, getGamesByGm, getJoinedGames, getProfile } from "@/shared/server";

import { buildProfileSessions } from "../model/build-profile-sessions";
import { countRecordSessions } from "../model/count-record-sessions";
import { recentAbsences } from "../model/recent-absences";

export async function loadProfile({
  userId,
  viewerId,
}: {
  userId: string;
  viewerId: string | null;
}) {
  // uuid가 아닌 값을 넘기면 Postgres가 캐스팅 에러를 던지므로 없는 사용자로 본다.
  if (!isUuid(userId)) return null;
  const server = await getCurrentServer();
  const [profile, hosted, joined] = await Promise.all([
    getProfile(server.id, userId),
    getGamesByGm({ serverId: server.id, userId }),
    getJoinedGames({ serverId: server.id, userId }),
  ]);
  if (!profile) return null;
  const now = new Date();
  return {
    profile,
    sessions: buildProfileSessions({ hosted, joined, userId, viewerId, now }),
    counts: countRecordSessions({ hosted, joined, userId, now, includeUpcoming: true }),
    absences: recentAbsences({ joined, userId }),
  };
}
