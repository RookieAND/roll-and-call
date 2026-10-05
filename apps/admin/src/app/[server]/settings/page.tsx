import { redirect } from "next/navigation";

import { serverPath } from "@/shared/lib";
import { getCurrentServer, getCurrentStaff } from "@/shared/server";

// 소유자는 서버 설정으로, 서버 설정을 볼 수 없는 운영진은 읽기 전용인 디스코드 메시지로 보낸다.
export default async function SettingsPage() {
  const [server, staff] = await Promise.all([getCurrentServer(), getCurrentStaff()]);
  const owner = staff.status === "staff" && staff.role === "owner";
  redirect(
    serverPath({ slug: server.slug, path: owner ? "/settings/server" : "/settings/messages" }),
  );
}
