import { getCurrentUser } from "@/shared/server";
import { getScheduleAvailability } from "@/views/game-schedule";

export const dynamic = "force-dynamic";

// 조율 화면이 열람자에게도 겹침을 보여주므로 참여 여부로 막지 않는다. blocked만 뷰어 기준이다.
export async function GET(
  _request: Request,
  context: RouteContext<"/api/games/[id]/availability">,
) {
  const { id } = await context.params;
  const user = await getCurrentUser();
  return Response.json(await getScheduleAvailability(id, user?.id ?? null));
}
