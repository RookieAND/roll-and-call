import { readFileSync } from "node:fs";

import { PGlite } from "@electric-sql/pglite";
import { btree_gist } from "@electric-sql/pglite/contrib/btree_gist";
import { generateDrizzleJson, generateMigration } from "drizzle-kit/api";
import { drizzle } from "drizzle-orm/pglite";

import * as schema from "#db/schema";

const GUARD_MIGRATIONS = ["0136_game_round_guards.sql"];

// 테스트 전용 메모리 Postgres. 마이그레이션 SQL(Supabase 전용 auth·cron 포함)이 아니라 drizzle 스키마에서 표를 만든다.
// drizzle이 표현하지 못하는 제약·트리거만 손으로 쓴 마이그레이션 파일을 그대로 얹는다.
export async function createTestDb() {
  const client = new PGlite({ extensions: { btree_gist } });
  const statements = await generateMigration(
    generateDrizzleJson({}),
    generateDrizzleJson(schema as Record<string, unknown>),
  );
  for (const statement of statements) await client.exec(statement);
  await client.exec("create schema if not exists extensions");
  for (const file of GUARD_MIGRATIONS) {
    const sqlText = readFileSync(new URL(`../../drizzle/${file}`, import.meta.url), "utf8");
    for (const statement of sqlText.split("--> statement-breakpoint")) await client.exec(statement);
  }
  return drizzle(client, { schema });
}
