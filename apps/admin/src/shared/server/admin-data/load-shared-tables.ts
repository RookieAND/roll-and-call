import "server-only";
import { loadAdminTables } from "@roll-and-call/database/moderation";

// 목록의 행 링크가 한꺼번에 프리페치되면 요청마다 표 18개를 읽느라 커넥션 풀(3) 앞에 줄이 쌓여 300초 타임아웃이 났다(2026-10-02).
// ponytail: 이미 읽는 중인 게 있으면 같이 기다린다. 끝나면 버려서 다음 요청은 새로 읽지만, 저장 직전에 시작된 읽기에 붙으면 한 번 옛 값을 볼 수 있다.
const inFlightTables = new Map<string, ReturnType<typeof loadAdminTables>>();

export function loadSharedTables(serverId: string) {
  const running = inFlightTables.get(serverId);
  if (running) return running;
  const loading = loadAdminTables(serverId).finally(() => inFlightTables.delete(serverId));
  inFlightTables.set(serverId, loading);
  return loading;
}
