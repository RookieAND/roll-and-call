import { Button, Skeleton, VStack } from "@roll-and-call/ui";

import { LoadingRegion, MobileActionBar, SkeletonListRows } from "@/shared/ui";

import type { SettingsHref } from "../model/settings-nav-items";
import { MobileSettingsFrame } from "./mobile/mobile-settings-frame";
import { MobileSettingsSection } from "./mobile/mobile-settings-section";

interface SettingsMobileLoadingProps {
  active: SettingsHref;
}

export function SettingsMobileLoading({ active }: SettingsMobileLoadingProps) {
  const staff = active === "/settings/staff";
  const options = active === "/settings/options";
  return (
    <MobileSettingsFrame active={active}>
      <LoadingRegion label="설정을 불러오는 중입니다">
        {staff ? (
          <SkeletonListRows rows={3} meta />
        ) : options ? (
          <VStack gap="150" className="px-150 pt-150 pb-200">
            <MobileSettingsSection title="서버 기능">
              <Skeleton width="100%" height={44} rounded={400} />
              <Skeleton width="100%" height={44} rounded={400} />
            </MobileSettingsSection>
          </VStack>
        ) : (
          <VStack gap="150" className="px-150 pt-150 pb-200">
            <MobileSettingsSection title="서버 기본 정보">
              <Skeleton width="100%" height={44} rounded={400} />
              <Skeleton width="100%" height={44} rounded={400} />
            </MobileSettingsSection>
            <MobileSettingsSection title="가입 링크">
              <Skeleton width="100%" height={44} rounded={400} />
            </MobileSettingsSection>
          </VStack>
        )}
      </LoadingRegion>
      <MobileActionBar>
        <Button size="lg" disabled className="text-body2">
          {staff ? "운영진 추가" : "변경 저장"}
        </Button>
      </MobileActionBar>
    </MobileSettingsFrame>
  );
}
