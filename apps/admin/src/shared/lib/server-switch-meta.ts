import { STAFF_ROLE_LABEL } from "@roll-and-call/database/moderation/model";

interface ServerSwitchMetaInput {
  slug: string;
  role: keyof typeof STAFF_ROLE_LABEL;
  pending: number;
  platformAdmin: boolean;
}

export function serverSwitchMeta({ slug, role, pending, platformAdmin }: ServerSwitchMetaInput) {
  const where = platformAdmin ? `/${slug}` : STAFF_ROLE_LABEL[role];
  return pending > 0 ? `${where} · 처리 대기 ${pending}건` : where;
}
