import { listMemberServers } from "@roll-and-call/database/servers";

import { getCurrentSessionUser } from "@/shared/server";
import { ServerSwitcher } from "@/shared/ui";

export async function GamesServerSwitch() {
  const user = await getCurrentSessionUser();
  if (!user) return <ServerSwitcher />;
  const servers = await listMemberServers(user.id);
  return <ServerSwitcher servers={servers} destination="games" />;
}
