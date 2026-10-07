import { Callout, VStack } from "@roll-and-call/ui";
import { TriangleAlert } from "lucide-react";

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
        <Panel title="유예 기간" bodyClassName="p-175">
          <VStack gap="150">
            <EnforcementDateForm enforcementDate={enforcementDate} />
            <Callout.Root colorPalette="warning" size="sm">
              <Callout.Icon>
                <TriangleAlert size={14} />
              </Callout.Icon>
              <Callout.Description>
                적용일 전까지는 인증이 필요한 룰북도 인증 없이 구인을 열 수 있습니다. 적용일이 비어
                있으면 바로 적용됩니다. ‘인증 불필요’ 룰북과 이미 열린 구인은 그대로 진행됩니다.
              </Callout.Description>
            </Callout.Root>
          </VStack>
        </Panel>
      </VStack>
    </>
  );
}
