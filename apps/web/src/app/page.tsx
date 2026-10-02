import { listMemberServers } from "@roll-and-call/database/servers";

import { getCurrentSessionUser } from "@/shared/server";
import { IndexView } from "@/views/index";

export default async function IndexPage() {
  const user = await getCurrentSessionUser();
  const servers = user ? await listMemberServers(user.id) : null;
  return <IndexView servers={servers} />;
}
