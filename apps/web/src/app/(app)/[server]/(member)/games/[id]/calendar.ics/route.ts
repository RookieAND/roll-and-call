import { calendarViewerRole, canAddToCalendar } from "@/entities/game";
import { buildIcs, calendarEvent } from "@/features/add-to-calendar";
import { serverPath } from "@/shared/lib";
import { getActingMember, getGameById, siteOrigin } from "@/shared/server";

// 라우트 핸들러에는 (member) 레이아웃의 멤버 리다이렉트가 걸리지 않아 여기서 직접 확인한다.
// 멤버 여부·참여 여부를 드러내지 않도록 받을 수 없으면 모두 404다.
export async function GET(
  request: Request,
  context: RouteContext<"/[server]/games/[id]/calendar.ics">,
) {
  const { id } = await context.params;
  const member = await getActingMember();
  if (!member) return new Response(null, { status: 404 });
  const game = await getGameById(member.server.id, id);
  const startsAt = game?.confirmedAt;
  if (!game || !startsAt) return new Response(null, { status: 404 });
  const viewerRole = calendarViewerRole({ game, viewerId: member.user.id });
  if (!canAddToCalendar({ game, viewerRole })) return new Response(null, { status: 404 });

  const origin = siteOrigin() ?? new URL(request.url).origin;
  const event = calendarEvent({
    title: game.title,
    rule: game.rule,
    gmNickname: game.gm.username,
    startsAt,
    playMinutes: game.playMinutes,
    gameUrl: origin + serverPath({ slug: member.server.slug, path: `/games/${game.id}` }),
  });
  return new Response(buildIcs({ event, gameId: game.id }), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="roll-and-call-${game.id}.ics"`,
      "Cache-Control": "private, no-store",
    },
  });
}
