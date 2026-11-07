import { CertTabs } from "@/entities/cert/server";
import { MobileEnforcementDateForm } from "@/features/set-cert-enforcement-date";
import { AdminHeader } from "@/shared/ui";

interface CertGraceMobileViewProps {
  enforcementDate: Date | null;
}

export function CertGraceMobileView({ enforcementDate }: CertGraceMobileViewProps) {
  return (
    <>
      <AdminHeader title="룰북 인증" />
      <CertTabs value="/cert/grace" />
      <MobileEnforcementDateForm enforcementDate={enforcementDate} />
    </>
  );
}
