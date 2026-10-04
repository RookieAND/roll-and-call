import { db } from "#/client";
import { certApplications } from "#/schema";

type NewCertApplication = typeof certApplications.$inferInsert;

export async function createCertApplication({
  serverId,
  application,
}: {
  serverId: string;
  application: Omit<NewCertApplication, "serverId">;
}) {
  const [created] = await db
    .insert(certApplications)
    .values({ ...application, serverId })
    .returning({ id: certApplications.id });
  return created!;
}
