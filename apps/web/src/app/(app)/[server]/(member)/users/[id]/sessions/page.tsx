import { redirect } from "next/navigation";

import { SESSION_ROLE } from "@/entities/game";
import { serverPath } from "@/shared/lib";
import { getCurrentServer, requireMembership } from "@/shared/server";

// 옛 ?tab=host 주소가 계속 열리도록 역할 경로로 보낸다.
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  await requireMembership();
  const [{ id }, { tab }, server] = await Promise.all([params, searchParams, getCurrentServer()]);
  const role = tab === SESSION_ROLE.host ? SESSION_ROLE.host : SESSION_ROLE.player;
  redirect(serverPath({ slug: server.slug, path: `/users/${id}/sessions/${role}` }));
}
