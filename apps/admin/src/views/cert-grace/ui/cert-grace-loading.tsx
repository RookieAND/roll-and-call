import { VStack } from "@roll-and-call/ui";

import { CERT_TABS } from "@/shared/lib";
import { AdminHeader, FactRows, LoadingRegion, Panel, RouteTabs, skeletonFact } from "@/shared/ui";

export function CertGraceLoading() {
  return (
    <>
      <AdminHeader title="룰북 인증" />
      <RouteTabs label="룰북 인증 화면" items={CERT_TABS} value="/cert/grace" />
      <LoadingRegion label="유예 기간을 불러오는 중입니다" className="p-200">
        <VStack gap="150">
          <Panel title="유예 기간" bodyClassName="px-225">
            <FactRows
              labelWidth={120}
              items={["현재 적용일", "적용일 변경", "영향 범위"].map(skeletonFact)}
            />
          </Panel>
        </VStack>
      </LoadingRegion>
    </>
  );
}
