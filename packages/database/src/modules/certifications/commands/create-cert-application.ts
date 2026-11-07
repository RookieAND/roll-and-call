import { db } from "#db/client";
import { isUniqueViolation } from "#db/modules/transaction";
import { certApplications } from "#db/schema";

// 같은 룰북에 대기 중인 신청이 이미 있으면(두 번 눌러 동시에 들어온 경우) null.
const PENDING_UNIQUE = "cert_applications_pending_unique";

type NewCertApplication = typeof certApplications.$inferInsert;

export async function createCertApplication({
  serverId,
  application,
}: {
  serverId: string;
  application: Omit<NewCertApplication, "serverId">;
}) {
  try {
    const [created] = await db
      .insert(certApplications)
      .values({ ...application, serverId })
      .returning({ id: certApplications.id });
    return created!;
  } catch (error) {
    if (isUniqueViolation(error, PENDING_UNIQUE)) return null;
    throw error;
  }
}
