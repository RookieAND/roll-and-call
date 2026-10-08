import { getCurrentServer, getCurrentStaff, getServerOwnerProfile } from "@/shared/server";
import { OwnerOnlyView } from "@/shared/ui";

export default async function DiscordOwnerLayout({ children }: LayoutProps<"/[server]/discord">) {
  const staff = await getCurrentStaff();
  if (staff.status === "staff" && staff.role === "owner") return children;
  const server = await getCurrentServer();
  const owner = await getServerOwnerProfile({ serverId: server.id });
  return (
    <OwnerOnlyView
      title="Discord"
      scope="디스코드 연동과 포럼 태그"
      ownerNickname={owner?.nickname}
    />
  );
}
