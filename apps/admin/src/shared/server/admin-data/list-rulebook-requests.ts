import "server-only";
import type { RulebookKind } from "@roll-and-call/database";

import { loadSnapshot } from "./snapshot";

export interface RulebookRequestRow {
  id: string;
  name: string;
  bookName: string;
  edition: string;
  kind: RulebookKind | null;
  category: string | null;
  note: string;
  requesterNickname: string;
  requestedAt: Date;
  similarTo?: string;
}

// 아직 처리하지 않은 추가 요청만, 오래 기다린 순으로.
export async function listRulebookRequests(): Promise<RulebookRequestRow[]> {
  const db = await loadSnapshot();
  return db.rulebookRequests
    .filter((request) => !request.processed)
    .toSorted((a, b) => a.requestedAt.getTime() - b.requestedAt.getTime())
    .map((request) => ({
      id: request.id,
      name: request.name,
      bookName: request.bookName,
      edition: request.edition,
      kind: request.kind,
      category: request.category,
      note: request.note,
      requesterNickname: db.users.find((user) => user.id === request.userId)?.nickname ?? "",
      requestedAt: request.requestedAt,
      similarTo: request.similarTo,
    }));
}
