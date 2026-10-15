import type { MemberOngoingRow, UserDetail } from "@/entities/user/server";
import { SanctionUserForm } from "@/features/sanction-user";
import { AdminHeader } from "@/shared/ui";

interface UserSanctionViewProps {
  user: UserDetail;
  ongoing: MemberOngoingRow[];
  staffChannel: boolean;
  now: Date;
}

export function UserSanctionView({ user, ongoing, staffChannel, now }: UserSanctionViewProps) {
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
        now={now}
      />
    </>
  );
}
