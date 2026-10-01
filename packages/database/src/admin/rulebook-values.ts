import { and, eq } from "drizzle-orm";

import { rulebookCategories, rulebooks } from "../schema";
import type { Executor } from "./record-audit";
import type { RulebookFields } from "./rulebook-fields";

export async function toRulebookValues({
  executor,
  fields,
  selfId,
}: {
  executor: Executor;
  fields: RulebookFields;
  selfId?: string;
}) {
  const { category, supersedesId, ...rest } = fields;
  if (fields.kind === "core") {
    await executor.insert(rulebookCategories).values({ name: category }).onConflictDoNothing();
  }
  const [categoryRow] = await executor
    .select({ id: rulebookCategories.id })
    .from(rulebookCategories)
    .where(eq(rulebookCategories.name, category));
  if (!categoryRow) throw new Error("서플리먼트와 핸드북은 기존 카테고리에만 넣을 수 있습니다");
  if (fields.kind !== "core" || !supersedesId || supersedesId === selfId) {
    return { ...rest, categoryId: categoryRow.id, supersedesId: null };
  }
  const [superseded] = await executor
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
