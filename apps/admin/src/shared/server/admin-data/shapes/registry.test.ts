import type { AdminTableKey, AdminTables } from "@roll-and-call/database/moderation";
import { describe, expect, it, vi } from "vitest";

import { SHAPE_REGISTRY } from "./registry";
import type { ShapeContext } from "./shape-context";

vi.mock("server-only", () => ({}));

// 모양이 선언한 표만 채워 만든다. 선언하지 않은 표를 읽으면 undefined라 터진다.
function contextFor(key: keyof typeof SHAPE_REGISTRY): ShapeContext {
  const needed = new Set<AdminTableKey>();
  const visit = (shapeKey: keyof typeof SHAPE_REGISTRY) => {
    for (const table of SHAPE_REGISTRY[shapeKey].tables) needed.add(table);
    for (const dependency of SHAPE_REGISTRY[shapeKey].needs ?? []) visit(dependency);
  };
  visit(key);
  const tables = Object.fromEntries(
    [...needed].map((table) => [table, []]),
  ) as unknown as AdminTables;
  const context: ShapeContext = {
    tables,
    now: Date.now(),
    nicknameOf: (id) => {
      void tables.profileRows.length;
      return id ?? "";
    },
    rulebookLabelOf: (id) => {
      void tables.rulebookRows.length;
      return id;
    },
    shape: (shapeKey) => SHAPE_REGISTRY[shapeKey].build({ ...context, tables }) as never,
  };
  return context;
}

describe("SHAPE_REGISTRY", () => {
  for (const key of Object.keys(SHAPE_REGISTRY) as (keyof typeof SHAPE_REGISTRY)[]) {
    it(`${key}는 선언한 표만으로 만들어진다`, () => {
      expect(() => SHAPE_REGISTRY[key].build(contextFor(key))).not.toThrow();
    });
  }
});
