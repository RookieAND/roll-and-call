import { redirect } from "next/navigation";

import { serverPath } from "@/shared/lib";
import { getCurrentServer, requireMembership } from "@/shared/server";

export default async function Page() {
  await requireMembership();
  const server = await getCurrentServer();
  redirect(serverPath({ slug: server.slug, path: "/me" }));
}
