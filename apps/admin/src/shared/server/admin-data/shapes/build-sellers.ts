import type { CertSeller } from "../types";
import type { ShapeContext } from "./shape-context";

export function buildSellers({ tables }: ShapeContext): CertSeller[] {
  return tables.sellerRows.map((row) => ({ id: row.id, name: row.name }));
}
