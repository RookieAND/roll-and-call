import { redirect } from "next/navigation";

import { serverPath } from "@/shared/lib";
import { getCurrentServer, getCurrentStaff } from "@/shared/server";

// 소유자는 디스코드 연동으로, 운영진은 읽기 전용인 디스코드 메시지로 보낸다.
export default async function DiscordPage() {
  const [server, staff] = await Promise.all([getCurrentServer(), getCurrentStaff()]);
  const owner = staff.status === "staff" && staff.role === "owner";
  redirect(serverPath({ slug: server.slug, path: owner ? "/discord/link" : "/discord/messages" }));
}
