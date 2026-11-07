import { PGlite } from "@electric-sql/pglite";
import { generateDrizzleJson, generateMigration } from "drizzle-kit/api";
import { drizzle } from "drizzle-orm/pglite";

import * as schema from "#db/schema";

// 테스트 전용 메모리 Postgres. 마이그레이션 SQL(Supabase 전용 auth·cron 포함)이 아니라 drizzle 스키마에서 표를 만든다.
export async function createTestDb() {
  const client = new PGlite();
  const statements = await generateMigration(
    generateDrizzleJson({}),
    generateDrizzleJson(schema as Record<string, unknown>),
  );
  for (const statement of statements) await client.exec(statement);
  return drizzle(client, { schema });
}
