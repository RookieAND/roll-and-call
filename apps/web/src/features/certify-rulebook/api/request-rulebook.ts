"use server";

import { eq } from "drizzle-orm";

import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { db, getCurrentUser, rulebookCategories, rulebookRequests } from "@/shared/server";

import {
  needsCategory,
  rulebookRequestSchema,
  type RulebookRequestValues,
} from "../model/rulebook-request-form";

export async function requestRulebook(input: RulebookRequestValues): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };
  const parsed = rulebookRequestSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "입력을 확인해 주세요." };

  const { name, edition, kind, category, publisher, note } = parsed.data;
  // 목록에 있는 룰이면 카테고리로 잇고, 없으면 적은 이름을 그대로 남긴다.
  const categoryName = needsCategory(kind) ? category : "";
  const [known] = categoryName
    ? await db
        .select({ id: rulebookCategories.id })
        .from(rulebookCategories)
        .where(eq(rulebookCategories.name, categoryName))
    : [];
  await db.insert(rulebookRequests).values({
    userId: user.id,
    name,
    edition,
    kind: kind === "unknown" ? null : kind,
    categoryId: known?.id ?? null,
    categoryName: known || !categoryName ? null : categoryName,
    publisher: publisher || null,
    note,
  });
  return {};
}
