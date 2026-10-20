import { Button } from "@roll-and-call/ui";

import { LoadingRegion, MobileActionBar } from "@/shared/ui";

import type { SettingsHref } from "../model/settings-nav-items";
import { MobileSettingsFrame } from "./mobile/mobile-settings-frame";
import { SettingsLoadingBody } from "./settings-loading-body";

interface SettingsMobileLoadingProps {
  active: SettingsHref;
}

export function SettingsMobileLoading({ active }: SettingsMobileLoadingProps) {
  const staff = active === "/settings/staff";
  return (
    <MobileSettingsFrame active={active}>
      <LoadingRegion label="설정을 불러오는 중입니다">
        <SettingsLoadingBody active={active} />
      </LoadingRegion>
      <MobileActionBar>
        <Button size="lg" disabled className="text-body2">
          {staff ? "운영진 추가" : "변경 저장"}
        </Button>
      </MobileActionBar>
    </MobileSettingsFrame>
  );
}
