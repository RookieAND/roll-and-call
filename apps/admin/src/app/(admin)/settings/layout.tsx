import { getCurrentStaff, listStaff } from "@/shared/server";
import { SettingsDeniedView } from "@/views/settings";

// 설정은 소유자만. 운영진이 주소로 들어오면 안내만 보여 준다.
export default async function SettingsLayout({ children }: LayoutProps<"/settings">) {
  const staff = await getCurrentStaff();
  if (staff.status === "staff" && staff.role === "owner") return children;
  const owner = (await listStaff()).find((member) => member.role === "owner");
  return <SettingsDeniedView ownerNickname={owner?.nickname} />;
}
