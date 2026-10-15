import { and, eq } from "drizzle-orm";

import type { RulebookDescription } from "#/modules/rulebooks/model/rulebook-description";
import type { Executor } from "#/modules/transaction/executor";
import { rulebookCategories, rulebooks } from "#/schema";

import { rulebookLabel } from "../model/rulebook-label";

// 활동 기록에 전후 값을 남기려고 룰북 한 권을 칸 단위로 읽는다. 조치 앞뒤로 같은 트랜잭션에서 부른다.
export async function describeRulebook({
  executor,
  serverId,
  id,
}: {
  executor: Executor;
  serverId: string;
  id: string;
}): Promise<RulebookDescription> {
  const [row] = await executor
    .select({
      name: rulebooks.name,
      edition: rulebooks.edition,
      kind: rulebooks.kind,
      supersedesId: rulebooks.supersedesId,
      aliases: rulebooks.aliases,
      certRequired: rulebooks.certRequired,
      category: rulebookCategories.name,
      categoryAlias: rulebookCategories.alias,
    })
    .from(rulebooks)
    .innerJoin(rulebookCategories, eq(rulebooks.categoryId, rulebookCategories.id))
    .where(and(eq(rulebooks.serverId, serverId), eq(rulebooks.id, id)));
  if (!row) throw new Error("룰북을 찾을 수 없습니다");
  const [superseded] = row.supersedesId
    ? await executor
        .select({ name: rulebooks.name, edition: rulebooks.edition })
        .from(rulebooks)
        .where(and(eq(rulebooks.serverId, serverId), eq(rulebooks.id, row.supersedesId)))
    : [];
  const { supersedesId: _supersedesId, ...rest } = row;
  return { ...rest, supersedes: superseded ? rulebookLabel(superseded) : "" };
}
