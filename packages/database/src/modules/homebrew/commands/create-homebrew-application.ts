import { and, count, eq, sql } from "drizzle-orm";

import { db } from "#db/client";
import { homebrewRuleApplications } from "#db/schema";

import { HOMEBREW_LIMIT } from "../model/homebrew-limit";
import { hasHomebrewNameConflict } from "../queries/has-homebrew-name-conflict";

export const CREATE_HOMEBREW_ERROR = {
  pendingLimit: "pendingLimit",
  nameTaken: "nameTaken",
  previousInvalid: "previousInvalid",
} as const;

export type CreateHomebrewResult =
  | { ok: true; id: string }
  | { ok: false; error: (typeof CREATE_HOMEBREW_ERROR)[keyof typeof CREATE_HOMEBREW_ERROR] };

// 심사 중 신청은 사람마다 3건까지. 같은 사람이 동시에 내도 한도를 넘지 않게 사람 단위로 잠근다.
// 재신청(previousId)은 본인의 반려된 신청을 한 번만 이어받는다.
export async function createHomebrewApplication({
  serverId,
  userId,
  application,
}: {
  serverId: string;
  userId: string;
  application: {
    name: string;
    edition: string;
    summary: string;
    description: string;
    links: string[];
    imageUrls: string[];
    previousId: string | null;
  };
}): Promise<CreateHomebrewResult> {
  return db.transaction(async (tx) => {
    await tx.execute(
      sql`select pg_advisory_xact_lock(hashtext(${`homebrew:${serverId}:${userId}`}))`,
    );
    const mine = and(
      eq(homebrewRuleApplications.serverId, serverId),
      eq(homebrewRuleApplications.userId, userId),
    );
    const [pending] = await tx
      .select({ total: count() })
      .from(homebrewRuleApplications)
      .where(and(mine, eq(homebrewRuleApplications.status, "pending")));
    if ((pending?.total ?? 0) >= HOMEBREW_LIMIT.pendingPerUser) {
      return { ok: false, error: CREATE_HOMEBREW_ERROR.pendingLimit };
    }
    if (application.previousId) {
      const [previous] = await tx
        .select({
          status: homebrewRuleApplications.status,
          reapplied: sql<boolean>`exists(select 1 from ${homebrewRuleApplications} as "next" where "next"."previous_id" = ${homebrewRuleApplications.id})`,
        })
        .from(homebrewRuleApplications)
        .where(and(mine, eq(homebrewRuleApplications.id, application.previousId)));
      if (previous?.status !== "rejected" || previous.reapplied) {
        return { ok: false, error: CREATE_HOMEBREW_ERROR.previousInvalid };
      }
    }
    if (await hasHomebrewNameConflict({ executor: tx, serverId, name: application.name })) {
      return { ok: false, error: CREATE_HOMEBREW_ERROR.nameTaken };
    }
    const [row] = await tx
      .insert(homebrewRuleApplications)
      .values({ serverId, userId, ...application })
      .returning({ id: homebrewRuleApplications.id });
    return { ok: true, id: row!.id };
  });
}
