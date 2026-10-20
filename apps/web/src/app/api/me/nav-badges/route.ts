import { countUnreadNotifications } from "@roll-and-call/database/notifications";

import { getCurrentServer, getCurrentSessionUser } from "@/shared/server";
import { loadBlockedTodo } from "@/widgets/session-list/server";

// 서버 액션은 한 번에 하나씩 줄 서서 사용자의 변경 요청을 막으므로 GET으로 읽는다.
// 지금 서버 것만 센다. 다른 서버의 안 읽은 알림은 어디에도 알리지 않는다(R15).
export async function GET() {
  const user = await getCurrentSessionUser();
  if (!user) return Response.json({ unread: 0, blockedTodo: false });
  const server = await getCurrentServer();
  const [unread, blockedTodo] = await Promise.all([
    countUnreadNotifications({ serverId: server.id, userId: user.id }),
    loadBlockedTodo(server.id, user.id),
  ]);
  return Response.json({ unread, blockedTodo });
}
