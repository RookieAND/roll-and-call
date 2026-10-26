import { isPublicGame } from "@roll-and-call/database/games";

import { isUuid } from "@/shared/lib";
import { getCurrentServer, getCurrentSessionUser } from "@/shared/server";
import { getScheduleAvailability } from "@/views/game-schedule";

// 조율 화면이 열람자에게도 겹침을 보여주므로 참여 여부로 막지 않는다. blocked만 뷰어 기준이다.
export async function GET(
  _request: Request,
  context: RouteContext<"/api/games/[id]/availability">,
) {
  const { id } = await context.params;
  if (!isUuid(id)) return new Response(null, { status: 404 });
  const server = await getCurrentServer();
  // 가능 시간은 조율형만 쓰고 비공개는 일시 지정형뿐이라, 비공개 구인은 없는 구인으로 답한다.
  if (!(await isPublicGame({ serverId: server.id, gameId: id })))
    return new Response(null, { status: 404 });
  const sessionUser = await getCurrentSessionUser();
  const body = await getScheduleAvailability({ gameId: id, userId: sessionUser?.id ?? null });
  return Response.json(body);
}
