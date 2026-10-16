import "server-only";
import { loadTodos } from "./load-todos";

// 서버마다 할 일 수를 센다. 서버 하나가 쿼리 여섯 개라 한꺼번에 돌리면 연결이 서버 수만큼 늘어난다.
// 풀러의 클라이언트 연결 한도(200)를 아끼려고 firstId 서버(보통 지금 보는 서버, 배너와 캐시를 같이 쓴다)부터 하나씩 센다.
export async function loadTodoCounts({
  serverIds,
  userId,
  firstId,
}: {
  serverIds: string[];
  userId: string;
  firstId?: string;
}) {
  const ordered = firstId ? [firstId, ...serverIds.filter((id) => id !== firstId)] : serverIds;
  const counts = new Map<string, number>();
  for (const serverId of ordered) {
    counts.set(serverId, (await loadTodos(serverId, userId)).count);
  }
  return counts;
}
