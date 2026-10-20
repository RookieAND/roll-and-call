import { Button } from "@roll-and-call/ui";

import { LoadingRegion } from "@/shared/ui";

import { ServerFeaturePanel } from "./server-feature-panel";
import { SettingsFrame } from "./settings-frame";

export function ServerOptionsLoading() {
  return (
    <SettingsFrame
      title="서버 설정"
      active="/settings/options"
      actions={<Button disabled>변경 저장</Button>}
    >
      <LoadingRegion label="서버 설정을 불러오는 중입니다" className="max-w-[880px] gap-150">
        <ServerFeaturePanel
          rankingMode="count"
          savedRankingMode="count"
          adultOnlyEnabled={false}
          savedAdultOnlyEnabled={false}
          disabled
          onRankingModeChange={() => {}}
          onAdultOnlyEnabledChange={() => {}}
        />
      </LoadingRegion>
    </SettingsFrame>
  );
}
