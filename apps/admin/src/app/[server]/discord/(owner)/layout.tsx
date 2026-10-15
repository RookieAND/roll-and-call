import { getCurrentServer, getCurrentStaff, getServerOwnerProfile } from "@/shared/server";
import { OwnerOnlyMobileView, OwnerOnlyView } from "@/shared/ui";

export default async function DiscordOwnerLayout({ children }: LayoutProps<"/[server]/discord">) {
  const staff = await getCurrentStaff();
  if (staff.status === "staff" && staff.role === "owner") return children;
  const server = await getCurrentServer();
  const owner = await getServerOwnerProfile({ serverId: server.id });
  const props = {
    title: "Discord",
    scope: "디스코드 연동과 포럼 태그",
    ownerNickname: owner?.nickname,
  };
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
