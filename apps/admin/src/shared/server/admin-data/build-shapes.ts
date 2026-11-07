import type { AdminTables } from "@roll-and-call/database/moderation";
import { rulebookLabel } from "@roll-and-call/database/rulebooks/model";

import { MISSING_NAME } from "./actor-names";
import { SHAPE_REGISTRY } from "./shapes/registry";
import type { ShapeContext } from "./shapes/shape-context";
import type { AdminShapes } from "./types";

type ShapeKey = keyof AdminShapes;

// 고른 모양을 표에서 만든다. tables에는 그 모양들이 선언한 표가 있어야 한다. 일부 행만 담으면 그 행으로 만든 모양이 나온다.
// built는 이미 만든 모양을 다시 쓰는 칸이다.
export function buildShapes<Key extends ShapeKey>({
  tables: loadedTables,
  now,
  keys,
  built = new Map(),
}: {
  tables: Partial<AdminTables>;
  now: number;
  keys: readonly Key[];
  built?: Map<ShapeKey, unknown>;
}): Pick<AdminShapes, Key> {
  const tables = loadedTables as AdminTables;
  let nicknames: Map<string, string> | undefined;
  let rulebookLabels: Map<string, string> | undefined;
  const context: ShapeContext = {
    tables,
    now,
    nicknameOf: (id) => {
      nicknames ??= new Map(tables.profileRows.map((profile) => [profile.id, profile.nickname]));
      return id ? (nicknames.get(id) ?? MISSING_NAME) : MISSING_NAME;
    },
    rulebookLabelOf: (id) => {
      rulebookLabels ??= new Map(
        tables.rulebookRows.map((rulebook) => [rulebook.id, rulebookLabel(rulebook)]),
      );
      return rulebookLabels.get(id);
    },
    shape: (key) => {
      if (!built.has(key)) built.set(key, SHAPE_REGISTRY[key].build(context));
      return built.get(key) as never;
    },
  };
  const result: Partial<AdminShapes> = {};
  for (const key of keys) (result as Record<ShapeKey, unknown>)[key] = context.shape(key);
  return result as Pick<AdminShapes, Key>;
}
