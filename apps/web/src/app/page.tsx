import { listMemberServers } from "@roll-and-call/database/servers";
import { redirect } from "next/navigation";

import { serverPath } from "@/shared/lib";
import { getCurrentSessionUser } from "@/shared/server";
import { IndexView } from "@/views/index";

// 가입한 서버가 있으면 최근 방문한 서버 홈으로 바로 보낸다. 소개를 다시 보려면 /about.
export default async function IndexPage() {
  const user = await getCurrentSessionUser();
  const servers = user ? await listMemberServers(user.id) : null;
  const [recent] = servers ?? [];
  if (recent) redirect(serverPath({ slug: recent.slug, path: "/" }));
  return <IndexView servers={servers} />;
}
