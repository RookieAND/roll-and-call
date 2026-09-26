import "server-only";
import { loadSnapshot } from "./snapshot";

export interface CertSellerRow {
  id: string;
  name: string;
  // 이 판매처의 전자책으로 인증된 책 수.
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
