import "server-only";
import { getRulebookRecords, hasRejectedCertRecord } from "@roll-and-call/database/certifications";

import { CERT_STATE, toMyRulebooks, type MyRulebook } from "@/entities/rulebook";

export async function loadRejectedRulebooks({
  serverId,
  userId,
}: {
  serverId: string;
  userId: string;
}): Promise<MyRulebook[]> {
  if (!(await hasRejectedCertRecord({ serverId, userId }))) return [];
  const records = await getRulebookRecords({ serverId, userId });
  return toMyRulebooks(records).rulebooks.filter(
    (rulebook) => rulebook.state === CERT_STATE.rejected,
  );
}
