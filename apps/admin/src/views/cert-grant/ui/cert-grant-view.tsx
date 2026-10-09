import { GrantCertForm } from "@/features/grant-certification";
import type { GrantOptions } from "@/shared/server";
import { AdminHeader } from "@/shared/ui";

const BACK_HREF = "/cert/manage";

interface CertGrantViewProps {
  options: GrantOptions;
  staffChannel: boolean;
}

// 인증 부여의 입구는 인증 관리 위쪽 [인증 부여] 하나다(D289).
export function CertGrantView({ options, staffChannel }: CertGrantViewProps) {
  return (
    <>
      <AdminHeader
        title="인증 부여"
        trail={[{ href: BACK_HREF, label: "룰북 인증" }]}
        contentWidth={1000}
      />
      <GrantCertForm options={options} staffChannel={staffChannel} backHref={BACK_HREF} />
    </>
  );
}
