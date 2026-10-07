import { Button } from "@roll-and-call/ui";

import { LoadingRegion } from "@/shared/ui";

import { JoinLinkPanel } from "./join-link-panel";
import { ServerBasicPanel } from "./server-basic-panel";
import { SettingsFrame } from "./settings-frame";

export function ServerSettingsLoading() {
  return (
    <SettingsFrame
      title="서버 설정"
      active="/settings/server"
      actions={<Button disabled>변경 저장</Button>}
    >
      <LoadingRegion label="서버 설정을 불러오는 중입니다" className="max-w-[880px] gap-150">
        <ServerBasicPanel loading />
        <JoinLinkPanel joinUrl="" disabled />
      </LoadingRegion>
    </SettingsFrame>
  );
}
