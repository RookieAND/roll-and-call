import "server-only";
import type { AdminTableKey, AdminTables } from "@roll-and-call/database/moderation";
import { cache } from "react";

import { getCurrentServer } from "../auth/get-current-server";
import { requireStaff } from "../auth/require-staff";
import { buildShapes } from "./build-shapes";
import { loadTable } from "./load-table";
import { SHAPE_REGISTRY } from "./shapes/registry";
import type { AdminShapes } from "./types";

type ShapeKey = keyof AdminShapes;

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
  const loaded: Partial<AdminTables> = {};
  for (const table of tablesOf(keys)) {
    const running = store.tables.get(table) ?? loadTable(server.id, table);
    store.tables.set(table, running);
    (loaded as Record<AdminTableKey, unknown>)[table] = await running;
  }
  return buildShapes({ tables: loaded, now: store.now, keys, built: store.shapes });
};
