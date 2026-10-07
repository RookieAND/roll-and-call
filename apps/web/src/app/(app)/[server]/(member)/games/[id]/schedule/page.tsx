import { redirect } from "next/navigation";

import { serverPath } from "@/shared/lib";
import { getCurrentServer, requireMembership } from "@/shared/server";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireMembership();
  const [{ id }, server] = await Promise.all([params, getCurrentServer()]);
  redirect(serverPath({ slug: server.slug, path: `/games/${id}` }));
}
