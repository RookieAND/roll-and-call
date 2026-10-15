import { CERT_TABS } from "@/entities/cert";
import { MobileEnforcementDateForm } from "@/features/set-cert-enforcement-date";
import { AdminHeader, RouteTabs } from "@/shared/ui";

interface CertGraceMobileViewProps {
  enforcementDate: Date | null;
}

export function CertGraceMobileView({ enforcementDate }: CertGraceMobileViewProps) {
  return (
    <>
      <AdminHeader title="룰북 인증" />
      <RouteTabs label="룰북 인증 화면" items={CERT_TABS} value="/cert/grace" />
      <MobileEnforcementDateForm enforcementDate={enforcementDate} />
    </>
  );
}
