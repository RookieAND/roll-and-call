import "server-only";
import { getCertStatus } from "./get-cert-status";
import { db } from "./mock-db";

export async function getCertDateSettings() {
  const { summary } = await getCertStatus({ allTime: false });
  return {
    enforcementDate: db.settings.certEnforcementDate,
    gmCount: summary.gmCount,
    certifiedGmCount: summary.certifiedCount,
    rulebookCount: db.rulebooks.length,
  };
}
