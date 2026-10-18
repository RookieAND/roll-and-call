import "server-only";
import {
  loadAdminTable,
  type AdminTableKey,
  type AdminTables,
} from "@roll-and-call/database/moderation";

// 목록의 행 링크가 한꺼번에 프리페치되면 요청마다 표를 읽느라 커넥션 풀(3) 앞에 줄이 쌓여 300초 타임아웃이 났다(2026-10-02).
// ponytail: 같은 서버의 같은 표를 이미 읽는 중이면 같이 기다린다. 끝나면 버려서 다음 요청은 새로 읽지만, 저장 직전에 시작된 읽기에 붙으면 한 번 옛 값을 볼 수 있다.
const inFlightTables = new Map<string, Promise<unknown>>();

export function loadTable<Key extends AdminTableKey>(
  serverId: string,
  key: Key,
): Promise<AdminTables[Key]> {
  const flightKey = `${serverId}:${key}`;
  const running = inFlightTables.get(flightKey);
  if (running) return running as Promise<AdminTables[Key]>;
  const loading = loadAdminTable(serverId, key).finally(() => inFlightTables.delete(flightKey));
  inFlightTables.set(flightKey, loading);
  return loading;
}
