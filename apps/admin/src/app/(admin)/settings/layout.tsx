import { getCurrentStaff, listStaff } from "@/shared/server";
import { SettingsDeniedView } from "@/views/settings";

export default async function SettingsLayout({ children }: LayoutProps<"/settings">) {
  const staff = await getCurrentStaff();
  if (staff.status === "staff" && staff.role === "owner") return children;
  const owner = (await listStaff()).find((member) => member.role === "owner");
  return <SettingsDeniedView ownerNickname={owner?.nickname} />;
}
