import type { GrantOptions } from "@/entities/cert/server";
import { MobileGrantCertForm } from "@/features/grant-certification";
import { AdminHeader } from "@/shared/ui";

const BACK_HREF = "/cert/manage";

interface CertGrantMobileViewProps {
  options: GrantOptions;
  staffChannel: boolean;
}

export function CertGrantMobileView({ options, staffChannel }: CertGrantMobileViewProps) {
  return (
    <>
      <AdminHeader title="인증 부여" trail={[{ href: BACK_HREF, label: "룰북 인증" }]} />
      <MobileGrantCertForm options={options} staffChannel={staffChannel} backHref={BACK_HREF} />
    </>
  );
}
