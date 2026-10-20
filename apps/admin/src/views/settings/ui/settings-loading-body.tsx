import { Skeleton, VStack } from "@roll-and-call/ui";

import { SkeletonListRows } from "@/shared/ui";

import type { SettingsHref } from "../model/settings-nav-items";
import { MobileSettingsSection } from "./mobile/mobile-settings-section";

interface SettingsLoadingBodyProps {
  active: SettingsHref;
}

export function SettingsLoadingBody({ active }: SettingsLoadingBodyProps) {
  if (active === "/settings/staff") return <SkeletonListRows rows={3} meta />;
  if (active === "/settings/options") {
    return (
      <VStack gap="150" className="px-150 pt-150 pb-200">
        <MobileSettingsSection title="서버 기능">
          <Skeleton width="100%" height={44} rounded={400} />
          <Skeleton width="100%" height={44} rounded={400} />
        </MobileSettingsSection>
      </VStack>
    );
  }
  return (
    <VStack gap="150" className="px-150 pt-150 pb-200">
      <MobileSettingsSection title="서버 기본 정보">
        <Skeleton width="100%" height={44} rounded={400} />
        <Skeleton width="100%" height={44} rounded={400} />
      </MobileSettingsSection>
      <MobileSettingsSection title="가입 링크">
        <Skeleton width="100%" height={44} rounded={400} />
      </MobileSettingsSection>
    </VStack>
  );
}
