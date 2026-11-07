import { db } from "#db/client";
import { isUniqueViolation } from "#db/modules/transaction";
import { certApplications } from "#db/schema";

type NewCertApplication = typeof certApplications.$inferInsert;

// 여러 권을 한 번에 신청하면 권마다 신청을 한 건씩 만들고 같은 groupId와 같은 사진을 나눠 쓴다.
// 한 번의 insert라서 일부만 만들어지는 일이 없다. 대기 중인 신청과 겹치는 권이 있으면 하나도 만들지 않고 null. 심사와 반려는 기존처럼 권마다 한다.
export async function createCertApplicationGroup({
  serverId,
  applications,
}: {
  serverId: string;
  applications: Omit<NewCertApplication, "serverId" | "groupId">[];
}) {
  const groupId = crypto.randomUUID();
  try {
    const created = await db
      .insert(certApplications)
      .values(applications.map((application) => ({ ...application, serverId, groupId })))
      .returning({ id: certApplications.id, rulebookId: certApplications.rulebookId });
    return { groupId, applications: created };
  } catch (error) {
    if (isUniqueViolation(error, "cert_applications_pending_unique")) return null;
    throw error;
  }
}
