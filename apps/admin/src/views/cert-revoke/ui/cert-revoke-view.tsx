import { RevokeCertForm } from "@/features/revoke-certification";
import type { UserDetail } from "@/shared/server";
import { AdminHeader } from "@/shared/ui";

interface CertRevokeViewProps {
  user: UserDetail;
  initialRulebookId: string;
}

export function CertRevokeView({ user, initialRulebookId }: CertRevokeViewProps) {
  const backHref = `/users/${user.id}?tab=cert`;
  return (
    <>
      <AdminHeader
        title={`${user.nickname} 룰북 인증 반려로 돌리기`}
        sub="유저 상세 · 룰북 인증"
        back={{ href: backHref, label: user.nickname }}
      />
      <RevokeCertForm
        userId={user.id}
        nickname={user.nickname}
        certifications={user.certifications}
        initialRulebookId={initialRulebookId}
        ongoing={user.ongoing}
        backHref={backHref}
      />
    </>
  );
}
