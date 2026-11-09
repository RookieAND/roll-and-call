import { and, eq, inArray, isNull, sql } from "drizzle-orm";

import { db } from "#db/client";
import { RULEBOOK_REQUEST_MAX_BOOKS, rulebookRequestKey } from "#db/modules/rulebooks/model";
import { rulebookRequests } from "#db/schema";

import { lockRulebookRequests } from "./lock-rulebook-requests";

type RequestInput = Pick<
  typeof rulebookRequests.$inferInsert,
  "name" | "edition" | "kind" | "categoryId" | "categoryName" | "note"
>;

export async function createRulebookRequests({
  serverId,
  userId,
  requests,
}: {
  serverId: string;
  userId: string;
  requests: RequestInput[];
}) {
  if (requests.length < 1 || requests.length > RULEBOOK_REQUEST_MAX_BOOKS) {
    throw new Error("요청할 책 수를 확인해 주세요.");
  }
  const normalizedRequests = requests.map((request) => ({
    ...request,
    name: request.name.trim(),
    edition: (request.edition ?? "").trim(),
  }));
  const keys = normalizedRequests.map((request) =>
    rulebookRequestKey({ ...request, edition: request.edition ?? "" }),
  );
  if (new Set(keys).size !== keys.length) throw new Error("같은 책이 두 번 들어 있습니다.");

  return db.transaction(async (tx) => {
    await lockRulebookRequests(tx, serverId);
    const duplicates = await tx
      .select({ name: rulebookRequests.name, edition: rulebookRequests.edition })
      .from(rulebookRequests)
      .where(
        and(
          eq(rulebookRequests.serverId, serverId),
          isNull(rulebookRequests.outcome),
          inArray(
            sql<string>`lower(trim(${rulebookRequests.name} || ' ' || ${rulebookRequests.edition}))`,
            keys,
          ),
        ),
      );
    if (duplicates.length > 0) {
      return { ok: false as const, duplicateKeys: duplicates.map(rulebookRequestKey) };
    }
    const groupId = crypto.randomUUID();
    // ID를 미리 만들어 입력 순서와 반환 행 순서에 관계없이 알림을 정확하게 연결한다.
    const rows = normalizedRequests.map((request) => ({
      ...request,
      id: crypto.randomUUID(),
      serverId,
      userId,
      source: "user" as const,
      groupId,
    }));
    await tx.insert(rulebookRequests).values(rows);
    return { ok: true as const, groupId, requests: rows };
  });
}
