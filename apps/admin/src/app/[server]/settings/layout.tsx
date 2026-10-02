import { getCurrentServer, getCurrentStaff, getServerOwnerProfile } from "@/shared/server";
import { SettingsDeniedView } from "@/views/settings";

export default async function SettingsLayout({ children }: LayoutProps<"/[server]/settings">) {
  const staff = await getCurrentStaff();
  if (staff.status === "staff" && staff.role === "owner") return children;
  const server = await getCurrentServer();
  const owner = await getServerOwnerProfile({ serverId: server.id });
  return <SettingsDeniedView ownerNickname={owner?.nickname} />;
}
