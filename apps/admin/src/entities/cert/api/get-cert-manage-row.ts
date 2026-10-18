import "server-only";
import { loadAdminData } from "@/shared/server";

import { certManageRows } from "../model/cert-manage-rows";

export async function getCertManageRow(key: string) {
  const db = await loadAdminData(["users", "rulebooks", "certifications", "certApplications"]);
  return certManageRows({ records: db, now: Date.now() }).find((row) => row.key === key) ?? null;
}
