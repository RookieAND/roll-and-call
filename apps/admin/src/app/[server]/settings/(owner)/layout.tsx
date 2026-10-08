import { getCurrentServer, getCurrentStaff, getServerOwnerProfile } from "@/shared/server";
import { OwnerOnlyView } from "@/shared/ui";

export default async function SettingsLayout({ children }: LayoutProps<"/[server]/settings">) {
  const staff = await getCurrentStaff();
  if (staff.status === "staff" && staff.role === "owner") return children;
  const server = await getCurrentServer();
  const owner = await getServerOwnerProfile({ serverId: server.id });
  return (
    <OwnerOnlyView title="설정" scope="운영진 관리와 서버 설정" ownerNickname={owner?.nickname} />
  );
}
