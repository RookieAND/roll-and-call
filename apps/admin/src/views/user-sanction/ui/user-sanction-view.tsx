import { SanctionUserForm } from "@/features/sanction-user";
import type { UserDetail } from "@/shared/server";
import { AdminHeader } from "@/shared/ui";

interface UserSanctionViewProps {
  user: UserDetail;
}

// 입력 묶음이 셋이고 확정 전에 볼 내용이 많아 룰북 인증 취소처럼 별도 페이지로 둔다.
export function UserSanctionView({ user }: UserSanctionViewProps) {
  const backHref = `/users/${user.id}`;
  return (
    <>
      <AdminHeader
        title={`${user.nickname} 제재`}
        sub="유저 상세"
        back={{ href: backHref, label: user.nickname }}
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
