import { getCurrentServer, getCurrentStaff, getServerOwnerProfile } from "@/shared/server";
import { OwnerOnlyMobileView, OwnerOnlyView } from "@/shared/ui";

export default async function SettingsLayout({ children }: LayoutProps<"/[server]/settings">) {
  const staff = await getCurrentStaff();
  if (staff.status === "staff" && staff.role === "owner") return children;
  const server = await getCurrentServer();
  const owner = await getServerOwnerProfile({ serverId: server.id });
  const props = { title: "설정", scope: "운영진 관리와 서버 설정", ownerNickname: owner?.nickname };
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <OwnerOnlyView {...props} />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <OwnerOnlyMobileView {...props} />
      </div>
    </>
  );
}
