import "server-only";
import { certSellers, db } from "@roll-and-call/database";

// 전자책 판매처 목록. 운영진이 어드민에서 관리한다.
export async function getCertSellers() {
  const rows = await db
    .select({ name: certSellers.name })
    .from(certSellers)
    .orderBy(certSellers.createdAt);
  return rows.map((row) => row.name);
}
