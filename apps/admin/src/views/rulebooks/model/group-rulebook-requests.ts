import type { RulebookRequestRow } from "@/entities/rulebook/server";

// 목록에는 미처리 책만 오지만, 전체/완료 권수는 처리된 책까지 포함한 서버 집계를 쓴다.
export function groupRulebookRequests(requests: RulebookRequestRow[]) {
  const groups = new Map<string, RulebookRequestRow[]>();
  for (const request of requests) {
    const key = request.groupId ? `group:${request.groupId}` : `request:${request.id}`;
    const books = groups.get(key) ?? [];
    books.push(request);
    groups.set(key, books);
  }
  return [...groups.values()];
}

export function reviewRequest(requests: RulebookRequestRow[], selectedId?: string) {
  return (
    requests.find((request) => request.id === selectedId) ??
    requests.find((request) => !request.processed) ??
    requests[0]
  );
}
