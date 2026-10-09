import { SanctionUserForm } from "@/features/sanction-user";
import type { MemberOngoingRow, UserDetail } from "@/shared/server";
import { AdminHeader } from "@/shared/ui";

interface UserSanctionViewProps {
  user: UserDetail;
  ongoing: MemberOngoingRow[];
  staffChannel: boolean;
}

export function UserSanctionView({ user, ongoing, staffChannel }: UserSanctionViewProps) {
  const backHref = `/users/${user.id}`;
  return (
    <>
      <AdminHeader
        title={`${user.nickname} 제재`}
        trail={[
          { href: "/users", label: "유저" },
          { href: backHref, label: user.nickname },
        ]}
        contentWidth={1000}
      />
      <SanctionUserForm
        userId={user.id}
        nickname={user.nickname}
        ongoing={ongoing}
        staffChannel={staffChannel}
        backHref={backHref}
      />
    </>
  );
}
