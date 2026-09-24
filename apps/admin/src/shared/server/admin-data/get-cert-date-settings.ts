import "server-only";
import { getCertStatus } from "./get-cert-status";
import { loadSnapshot } from "./snapshot";

export async function getCertDateSettings() {
  const db = await loadSnapshot();
  const { summary } = await getCertStatus({ allTime: false });
  return {
    enforcementDate: db.settings.certEnforcementDate,
    gmCount: summary.gmCount,
    certifiedGmCount: summary.certifiedCount,
    rulebookCount: db.rulebooks.length,
  };
}
