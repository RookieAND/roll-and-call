import { listMemberServers } from "@roll-and-call/database/servers";

import { getCurrentSessionUser } from "@/shared/server";
import { IndexView } from "@/views/index";

// 인덱스와 같은 소개 페이지를 자동 이동 없이 보여 준다.
export default async function AboutPage() {
  const user = await getCurrentSessionUser();
  const servers = user ? await listMemberServers(user.id) : null;
  return <IndexView servers={servers} />;
}
