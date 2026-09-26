import "server-only";
import { rulebookCategories, rulebooks } from "@roll-and-call/database";
import { and, eq } from "drizzle-orm";

import type { Executor } from "./record-audit";
import type { RulebookFields } from "./rulebook-fields";

// 카테고리는 이름으로 고르고, 새 카테고리는 기본 룰북만 만들 수 있다. 포함하는 구판은 같은 카테고리의 다른 기본 룰북만 된다.
export async function toRulebookValues(tx: Executor, fields: RulebookFields, selfId?: string) {
  const { category, supersedesId, ...rest } = fields;
  if (fields.kind === "core") {
    await tx.insert(rulebookCategories).values({ name: category }).onConflictDoNothing();
  }
  const [categoryRow] = await tx
    .select({ id: rulebookCategories.id })
    .from(rulebookCategories)
    .where(eq(rulebookCategories.name, category));
  if (!categoryRow) throw new Error("서플리먼트와 핸드북은 기존 카테고리에만 넣을 수 있습니다");
  if (fields.kind !== "core" || !supersedesId || supersedesId === selfId) {
    return { ...rest, categoryId: categoryRow.id, supersedesId: null };
  }
  const [superseded] = await tx
    .select({ id: rulebooks.id })
    .from(rulebooks)
    .where(
      and(
        eq(rulebooks.id, supersedesId),
        eq(rulebooks.categoryId, categoryRow.id),
        eq(rulebooks.kind, "core"),
      ),
    );
  if (!superseded) throw new Error("포함하는 구판은 같은 카테고리의 기본 룰북이어야 합니다");
  return { ...rest, categoryId: categoryRow.id, supersedesId: superseded.id };
}
