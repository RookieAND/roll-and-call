import type { NextRequest } from "next/server";

import { getActingMember, getCurrentUser, listNotifications } from "@/shared/server";

// 서버 액션은 한 번에 하나씩 줄 서서 사용자의 변경 요청을 막으므로 GET으로 읽는다.
export async function GET(request: NextRequest) {
  if (!(await getCurrentUser())) return new Response(null, { status: 401 });
  const member = await getActingMember();
  if (!member) return new Response(null, { status: 403 });
  const page = await listNotifications({
    serverId: member.server.id,
    userId: member.user.id,
    cursor: request.nextUrl.searchParams.get("cursor"),
  });
  return Response.json(page);
}
