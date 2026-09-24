import { RevokeCertForm } from "@/features/revoke-certification";
import type { UserDetail } from "@/shared/server";
import { AdminHeader } from "@/shared/ui";

interface CertRevokeViewProps {
  user: UserDetail;
  initialRulebook?: string;
}

// 입력 묶음이 셋이라 모달 대신 별도 페이지로 둔다.
export function CertRevokeView({ user, initialRulebook }: CertRevokeViewProps) {
  const backHref = `/users/${user.id}?tab=cert`;
  return (
    <>
      <AdminHeader
        title={`${user.nickname} 룰북 인증 취소`}
        sub="유저 상세 · 룰북 인증"
        back={{ href: backHref, label: user.nickname }}
      />
      <RevokeCertForm
        userId={user.id}
        nickname={user.nickname}
        certifications={user.certifications}
        initialRulebook={initialRulebook}
        ongoing={user.ongoing}
        backHref={backHref}
      />
    </>
  );
}
