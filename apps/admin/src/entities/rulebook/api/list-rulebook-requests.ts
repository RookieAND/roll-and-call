import "server-only";
import type { RulebookKind } from "@roll-and-call/database";

import { waitedDays } from "@/shared/lib";
import { loadSnapshot } from "@/shared/server";

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
  waitedDays: number;
  similarTo?: string;
  // 구인에서 직접 입력해 생긴 요청이면 그 이름을 적은 구인 목록이다. 사용자가 낸 요청이면 null.
  games: RequestGame[] | null;
  otherRequesterCount: number;
}

export interface RequestGame {
  id: string;
  title: string;
  gmNickname: string;
}

export async function listRulebookRequests(): Promise<RulebookRequestRow[]> {
  const db = await loadSnapshot();
  return db.rulebookRequests
    .filter((request) => !request.processed)
    .toSorted((a, b) => a.requestedAt.getTime() - b.requestedAt.getTime())
    .map((request) => {
      const games = request.gameIds.flatMap((gameId) => {
        const session = db.sessions.find((candidate) => candidate.id === gameId);
        if (!session) return [];
        const gmNickname = db.users.find((user) => user.id === session.gmId)?.nickname ?? "";
        return [{ id: session.id, title: session.title, gmId: session.gmId, gmNickname }];
      });
      const gmIds = new Set(games.map((game) => game.gmId));
      gmIds.delete(request.userId);
      return {
        id: request.id,
        name: request.name,
        bookName: request.bookName,
        edition: request.edition,
        kind: request.kind,
        category: request.category,
        note: request.note,
        requesterNickname: db.users.find((user) => user.id === request.userId)?.nickname ?? "",
        requestedAt: request.requestedAt,
        waitedDays: waitedDays(request.requestedAt),
        similarTo: request.similarTo,
        games:
          request.source === "game"
            ? games.map(({ id, title, gmNickname }) => ({ id, title, gmNickname }))
            : null,
        otherRequesterCount: request.source === "game" ? gmIds.size : 0,
      };
    });
}
