"use server";

import { and, eq, isNull, sql } from "drizzle-orm";

import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { db, getCurrentUser, rulebookCategories, rulebookRequests } from "@/shared/server";

import {
  rulebookRequestSchema,
  UNKNOWN,
  type RulebookRequestValues,
} from "../model/rulebook-request-form";

export async function requestRulebook(input: RulebookRequestValues): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };
  const parsed = rulebookRequestSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "입력을 확인해 주세요." };
  const { name, edition, kind, category, link } = parsed.data;

  const [duplicate] = await db
    .select({ id: rulebookRequests.id })
    .from(rulebookRequests)
    .where(
      and(
        isNull(rulebookRequests.outcome),
        sql`lower(trim(${rulebookRequests.name} || ' ' || ${rulebookRequests.edition})) = lower(trim(${`${name} ${edition}`}))`,
      ),
    );
  if (duplicate) return { error: "이미 요청된 룰북입니다." };

  // 목록에 있는 카테고리면 잇고, 없으면 적은 이름을 그대로 남긴다.
  const [known] = category
    ? await db
        .select({ id: rulebookCategories.id })
        .from(rulebookCategories)
        .where(eq(rulebookCategories.name, category))
    : [];
  await db.insert(rulebookRequests).values({
    userId: user.id,
    name,
    edition,
    kind: kind === UNKNOWN ? null : kind,
    categoryId: known?.id ?? null,
    categoryName: known || !category ? null : category,
    note: link ? `참고 링크 ${link}` : "",
  });
  return {};
}
