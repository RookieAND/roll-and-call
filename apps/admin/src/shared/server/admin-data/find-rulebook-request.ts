import "server-only";
import { db } from "./mock-db";

export function findRulebookRequest(id: string) {
  const request = db.rulebookRequests.find((candidate) => candidate.id === id);
  if (!request) throw new Error("추가 요청을 찾을 수 없습니다");
  const requester = db.users.find((user) => user.id === request.userId)?.nickname ?? "";
  return { request, requester };
}
