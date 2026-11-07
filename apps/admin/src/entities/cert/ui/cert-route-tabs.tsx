import { HStack } from "@roll-and-call/ui";

import { RouteTabs, TabCount } from "@/shared/ui";

import { CERT_TABS, type CertTabCountKey } from "../model/cert-tabs";

interface CertRouteTabsProps {
  value: string;
  // 앞 두 탭의 건수. 불러오는 중·오류면 없고 뱃지를 숨긴다.
  counts?: Record<CertTabCountKey, number>;
}

export function CertRouteTabs({ value, counts }: CertRouteTabsProps) {
  const items = CERT_TABS.map((tab) => {
    if (!counts || !("countKey" in tab)) return tab;
    const count = counts[tab.countKey];
    return {
      href: tab.href,
      label: (
        <HStack align="center" gap="075" render={<span />}>
          {tab.label}
          <TabCount count={count} selected={tab.href === value && count > 0} />
        </HStack>
      ),
    };
  });
  return <RouteTabs label="룰북 인증 화면" items={items} value={value} />;
}
