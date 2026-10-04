import { SanctionUserForm } from "@/features/sanction-user";
import type { UserDetail } from "@/shared/server";
import { AdminHeader } from "@/shared/ui";

interface UserSanctionViewProps {
  user: UserDetail;
}

export function UserSanctionView({ user }: UserSanctionViewProps) {
  const backHref = `/users/${user.id}`;
  return (
    <>
      <AdminHeader
        title={`${user.nickname} 제재`}
        sub="유저 상세"
        trail={[{ href: backHref, label: user.nickname }]}
      />
      <SanctionUserForm
        userId={user.id}
        nickname={user.nickname}
        ongoing={user.ongoing}
        backHref={backHref}
      />
    </>
  );
}
