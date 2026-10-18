import type { StaffMemo } from "../types";
import type { ShapeContext } from "./shape-context";

export function buildStaffMemos({ tables, nicknameOf }: ShapeContext): StaffMemo[] {
  return tables.memoRows.map((row) => ({
    id: row.id,
    userId: row.userId,
    authorId: row.authorId,
    author: nicknameOf(row.authorId),
    at: row.createdAt,
    body: row.body,
  }));
}
