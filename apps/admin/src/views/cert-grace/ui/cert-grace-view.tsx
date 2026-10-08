import { VStack } from "@roll-and-call/ui";

import { EnforcementDateForm } from "@/features/set-cert-enforcement-date";
import { CERT_TABS } from "@/shared/lib";
import { AdminHeader, Panel, RouteTabs } from "@/shared/ui";

interface CertGraceViewProps {
  serverName: string;
  enforcementDate: Date | null;
}

export function CertGraceView({ serverName, enforcementDate }: CertGraceViewProps) {
  return (
    <>
      <AdminHeader title="룰북 인증" sub={serverName} />
      <RouteTabs label="룰북 인증 화면" items={CERT_TABS} value="/cert/grace" />
      <VStack gap="150" className="flex-1 p-200">
        <Panel title="유예 기간" bodyClassName="px-225">
          <EnforcementDateForm enforcementDate={enforcementDate} />
        </Panel>
      </VStack>
    </>
  );
}
