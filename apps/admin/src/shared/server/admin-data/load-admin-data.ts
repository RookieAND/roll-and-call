import "server-only";
import type { AdminTableKey, AdminTables } from "@roll-and-call/database/moderation";
import { rulebookLabel } from "@roll-and-call/database/rulebooks/model";
import { cache } from "react";

import { getCurrentServer } from "../auth/get-current-server";
import { requireStaff } from "../auth/require-staff";
import { loadTable } from "./load-table";
import { SHAPE_REGISTRY } from "./shapes/registry";
import type { ShapeContext } from "./shapes/shape-context";
import type { AdminShapes } from "./types";

type ShapeKey = keyof AdminShapes;

const MISSING_NAME = "알 수 없음";

// 한 요청 안에서 읽은 표와 만든 모양은 다시 쓴다.
const requestStore = cache(() => ({
  now: Date.now(),
  tables: new Map<AdminTableKey, Promise<unknown>>(),
  shapes: new Map<ShapeKey, unknown>(),
}));

function tablesOf(keys: readonly ShapeKey[], seen = new Set<ShapeKey>()): Set<AdminTableKey> {
  const tables = new Set<AdminTableKey>();
  for (const key of keys) {
    if (seen.has(key)) continue;
    seen.add(key);
    const spec = SHAPE_REGISTRY[key];
    for (const table of spec.tables) tables.add(table);
    for (const table of tablesOf(spec.needs ?? [], seen)) tables.add(table);
  }
  return tables;
}

// 화면이 쓰는 모양만 골라 읽는다. 표는 그 모양이 선언한 것만 읽고, 레이아웃 가드는 클라이언트 이동 때 다시 돌지 않을 수 있어 여기서 운영진인지 다시 확인한다.
export const loadAdminData = async <Key extends ShapeKey>(
  keys: readonly Key[],
): Promise<Pick<AdminShapes, Key>> => {
  await requireStaff();
  const server = await getCurrentServer();
  const store = requestStore();
  // 트랜잭션 풀러에 Promise.all로 한꺼번에 보내면 응답이 멈추므로 표는 순서대로 읽는다(같은 요청의 다른 호출이 읽는 중이면 그 결과를 기다린다).
  const loaded: Partial<Record<AdminTableKey, unknown>> = {};
  for (const table of tablesOf(keys)) {
    const running = store.tables.get(table) ?? loadTable(server.id, table);
    store.tables.set(table, running);
    loaded[table] = await running;
  }
  const tables = loaded as AdminTables;

  let nicknames: Map<string, string> | undefined;
  let rulebookLabels: Map<string, string> | undefined;
  const context: ShapeContext = {
    tables,
    now: store.now,
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
      if (!store.shapes.has(key)) store.shapes.set(key, SHAPE_REGISTRY[key].build(context));
      return store.shapes.get(key) as never;
    },
  };
  const result: Partial<AdminShapes> = {};
  for (const key of keys) (result as Record<ShapeKey, unknown>)[key] = context.shape(key);
  return result as Pick<AdminShapes, Key>;
};
