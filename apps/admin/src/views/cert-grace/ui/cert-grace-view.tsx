import { VStack } from "@roll-and-call/ui";

import { CertTabs } from "@/entities/cert/server";
import { EnforcementDateForm } from "@/features/set-cert-enforcement-date";
import { AdminHeader, Panel } from "@/shared/ui";

interface CertGraceViewProps {
  enforcementDate: Date | null;
}

export function CertGraceView({ enforcementDate }: CertGraceViewProps) {
  return (
    <>
      <AdminHeader title="룰북 인증" />
      <CertTabs value="/cert/grace" />
      <VStack gap="150" className="flex-1 p-200">
        <Panel title="유예 기간" bodyClassName="px-225">
          <EnforcementDateForm enforcementDate={enforcementDate} />
        </Panel>
      </VStack>
    </>
  );
}
