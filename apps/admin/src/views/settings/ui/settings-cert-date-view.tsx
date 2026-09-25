import { Callout, VStack } from "@roll-and-call/ui";
import { BookOpen, ShieldCheck, TriangleAlert } from "lucide-react";
import Link from "next/link";

import { EnforcementDateForm } from "@/features/set-cert-enforcement-date";
import type { getCertDateSettings } from "@/shared/server";
import { ActionCard, Panel } from "@/shared/ui";

import { SettingsFrame } from "./settings-frame";

interface SettingsCertDateViewProps {
  settings: Awaited<ReturnType<typeof getCertDateSettings>>;
}

export function SettingsCertDateView({ settings }: SettingsCertDateViewProps) {
  return (
    <SettingsFrame title="룰북 인증 적용일" active="/settings/cert-date">
      <Panel title="적용 일정" bodyClassName="p-175">
        <VStack gap="150">
          <EnforcementDateForm enforcementDate={settings.enforcementDate} />
          <Callout.Root colorPalette="warning" size="sm">
            <Callout.Icon>
              <TriangleAlert size={14} />
            </Callout.Icon>
            <Callout.Description>
              인증이 필요한 룰북은 적용일부터 인증 없이 구인을 열 수 없습니다. ‘인증 불필요’ 룰북과
              이미 열린 구인은 그대로 진행됩니다.
            </Callout.Description>
          </Callout.Root>
        </VStack>
      </Panel>
      <Panel title="관련 화면" bodyClassName="p-150">
        <VStack gap="100">
          <ActionCard
            icon={ShieldCheck}
            title="인증 현황"
            description={`최근 활동 GM ${settings.gmCount}명 중 ${settings.certifiedGmCount}명이 인증을 마쳤습니다. 미신청 GM에게는 룰북 인증 메뉴에서 안내합니다.`}
            link={<Link href="/cert/status" />}
          />
          <ActionCard
            icon={BookOpen}
            title="룰북별 인증 필요 여부"
            description={`등록된 룰북 ${settings.rulebookCount}개의 인증 정책은 룰북 메뉴에서 변경합니다.`}
            link={<Link href="/rules" />}
          />
        </VStack>
      </Panel>
    </SettingsFrame>
  );
}
