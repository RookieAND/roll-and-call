import "server-only";
import { db } from "./mock-db";

export interface RulebookRequestRow {
  id: string;
  name: string;
  note: string;
  requesterNickname: string;
  requestedAt: Date;
  similarTo?: string;
}

// 아직 처리하지 않은 추가 요청만, 오래 기다린 순으로.
export async function listRulebookRequests(): Promise<RulebookRequestRow[]> {
  return db.rulebookRequests
    .filter((request) => !request.processed)
    .toSorted((a, b) => a.requestedAt.getTime() - b.requestedAt.getTime())
    .map((request) => ({
      id: request.id,
      name: request.name,
      note: request.note,
      requesterNickname: db.users.find((user) => user.id === request.userId)?.nickname ?? "",
      requestedAt: request.requestedAt,
      similarTo: request.similarTo,
    }));
}
