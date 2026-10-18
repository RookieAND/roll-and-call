import type { LastActive } from "../types";
import type { ShapeContext } from "./shape-context";

export function buildLastActive({ tables }: ShapeContext): LastActive[] {
  return tables.lastActiveRows.flatMap((row) =>
    row.actorId ? [{ userId: row.actorId, at: row.lastAt }] : [],
  );
}
