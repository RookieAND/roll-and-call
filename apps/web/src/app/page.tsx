import { listMemberServers } from "@roll-and-call/database/servers";
import { redirect } from "next/navigation";

import { serverPath } from "@/shared/lib";
import { getCurrentSessionUser } from "@/shared/server";
import { IndexView } from "@/views/index";

// 서버가 하나뿐이면 바로 그 서버로 보낸다. ?stay=1이면 목록을 보여 준다.
export default async function IndexPage({ searchParams }: PageProps<"/">) {
  const [user, { stay }] = await Promise.all([getCurrentSessionUser(), searchParams]);
  const servers = user ? await listMemberServers(user.id) : [];
  const [onlyServer] = servers;
  if (servers.length === 1 && onlyServer && stay !== "1") {
    redirect(serverPath({ slug: onlyServer.slug, path: "/" }));
  }
  return <IndexView userId={user?.id ?? null} servers={servers} />;
}
