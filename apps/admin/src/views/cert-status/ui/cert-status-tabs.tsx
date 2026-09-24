"use client";

import { HStack, Tabs } from "@roll-and-call/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import { CERT_STATUS_TAB, type CertStatusTab } from "../model/cert-status-tab";

interface CertStatusTabsProps {
  tab: CertStatusTab;
  toolbar: ReactNode;
  rulebookPanel: ReactNode;
  gmPanel: ReactNode;
}

// 탭은 주소의 tab으로 기억한다. 탭을 바꾸면 그 탭 전용 필터는 지운다.
export function CertStatusTabs({ tab, toolbar, rulebookPanel, gmPanel }: CertStatusTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (
    <Tabs.Root
      value={tab}
      onValueChange={(value) => {
        const next = new URLSearchParams(searchParams);
        next.delete("page");
        next.delete("scope");
        next.delete("unapplied");
        if (value === CERT_STATUS_TAB.gm) next.set("tab", value);
        else next.delete("tab");
        router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
      }}
    >
      <HStack align="center" className="border-b border-(--rc-color-border-subtle) px-150">
        <Tabs.List aria-label="인증 현황 보기" scrollable={false} className="border-b-0">
          <Tabs.Trigger value={CERT_STATUS_TAB.rulebook}>룰북별 인증 현황</Tabs.Trigger>
          <Tabs.Trigger value={CERT_STATUS_TAB.gm}>GM별 인증 현황</Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
        <HStack align="center" gap="075" className="ml-auto">
          {toolbar}
        </HStack>
      </HStack>
      <Tabs.Panel value={CERT_STATUS_TAB.rulebook} className="pt-0">
        {rulebookPanel}
      </Tabs.Panel>
      <Tabs.Panel value={CERT_STATUS_TAB.gm} className="pt-0">
        {gmPanel}
      </Tabs.Panel>
    </Tabs.Root>
  );
}
