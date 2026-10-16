import "server-only";
import { loadSnapshot } from "@/shared/server";

import { certManageRows } from "../model/cert-manage-rows";

export async function getCertManageRow(key: string) {
  const db = await loadSnapshot();
  return certManageRows({ records: db, now: Date.now() }).find((row) => row.key === key) ?? null;
}
