import type { MemberOngoingRow, UserDetail } from "@/entities/user/server";
import { MobileSanctionUserForm } from "@/features/sanction-user";
import { AdminHeader } from "@/shared/ui";

interface UserSanctionMobileViewProps {
  user: UserDetail;
  ongoing: MemberOngoingRow[];
  staffChannel: boolean;
  now: Date;
}

export function UserSanctionMobileView({
  user,
  ongoing,
  staffChannel,
  now,
}: UserSanctionMobileViewProps) {
  const backHref = `/users/${user.id}`;
  return (
    <>
      <AdminHeader
        title={`${user.nickname} 제재`}
        trail={[{ href: backHref, label: user.nickname }]}
      />
      <MobileSanctionUserForm
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
