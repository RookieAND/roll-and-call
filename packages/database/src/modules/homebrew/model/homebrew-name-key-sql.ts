import { sql, type SQL } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";

export function homebrewNameKeySql(column: AnyPgColumn): SQL {
  return sql`lower(regexp_replace(btrim(${column}), '\\s+', ' ', 'g'))`;
}
