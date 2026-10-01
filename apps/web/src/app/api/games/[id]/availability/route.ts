import { aggregateAvailability, type ScheduleAvailability } from "@/entities/availability";
import {
  getCurrentServer,
  getCurrentSessionUser,
  getScheduleAvailabilityRows,
} from "@/shared/server";

// 조율 화면이 열람자에게도 겹침을 보여주므로 참여 여부로 막지 않는다. blocked만 뷰어 기준이다.
export async function GET(
  _request: Request,
  context: RouteContext<"/api/games/[id]/availability">,
) {
  const { id } = await context.params;
  const [server, sessionUser] = await Promise.all([getCurrentServer(), getCurrentSessionUser()]);
  const userId = sessionUser?.id ?? null;
  const { availabilities, blocked } = await getScheduleAvailabilityRows({
    serverId: server.id,
    gameId: id,
    userId,
  });
  const body: ScheduleAvailability = {
    aggregate: aggregateAvailability({ avails: availabilities, userId }),
    blocked,
  };
  return Response.json(body);
}
