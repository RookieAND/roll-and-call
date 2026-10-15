import "server-only";
import { loadSnapshot } from "@/shared/server";

export interface CertSellerRow {
  id: string;
  name: string;
  certifiedCount: number;
}

export async function listCertSellers(): Promise<CertSellerRow[]> {
  const db = await loadSnapshot();
  return db.sellers.map((seller) => ({
    ...seller,
    certifiedCount: db.certApplications.filter(
      (application) =>
        application.status === "approved" &&
        application.format === "ebook" &&
        application.purchase.seller === seller.name,
    ).length,
  }));
}
