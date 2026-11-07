import "server-only";
import { countCertifiedBySeller } from "@roll-and-call/database/moderation";

import { getCurrentServer, loadAdminData } from "@/shared/server";

export interface CertSellerRow {
  id: string;
  name: string;
  certifiedCount: number;
}

export async function listCertSellers(): Promise<CertSellerRow[]> {
  const db = await loadAdminData(["sellers"]);
  const counts = await countCertifiedBySeller({ serverId: (await getCurrentServer()).id });
  const countOf = new Map(counts.map((row) => [row.seller, row.count]));
  return db.sellers.map((seller) => ({ ...seller, certifiedCount: countOf.get(seller.name) ?? 0 }));
}
