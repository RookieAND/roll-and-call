import { Button, VStack } from "@roll-and-call/ui";

import { MobileIdCard, SETTING_FIELDS } from "@/features/edit-server-settings";
import { LoadingRegion, MobileActionBar } from "@/shared/ui";

import { MobileDiscordFrame } from "./mobile/mobile-discord-frame";

export function DiscordSettingsMobileLoading() {
  return (
    <MobileDiscordFrame active="/discord/link">
      <LoadingRegion label="디스코드 연동을 불러오는 중입니다">
        <VStack gap="150" className="px-150 pt-150 pb-200">
          {SETTING_FIELDS.map((field) => (
            <MobileIdCard
              key={field.key}
              id={`mobile-setting-loading-${field.key}`}
              label={field.label}
              purpose={"purpose" in field ? field.purpose : undefined}
              value=""
              check={undefined}
              serverName=""
              loading
            />
          ))}
        </VStack>
      </LoadingRegion>
      <MobileActionBar>
        <Button size="lg" disabled className="text-body2">
          변경 저장
        </Button>
      </MobileActionBar>
    </MobileDiscordFrame>
  );
}
