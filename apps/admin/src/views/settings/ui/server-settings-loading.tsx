import { Button } from "@roll-and-call/ui";

import { SETTING_FIELDS, type SettingIds } from "@/features/edit-server-settings";
import { LoadingRegion } from "@/shared/ui";

import { DiscordLinkPanel } from "./discord-link-panel";
import { JoinLinkPanel } from "./join-link-panel";
import { ServerBasicPanel } from "./server-basic-panel";
import { SettingsFrame } from "./settings-frame";

const EMPTY_IDS = Object.fromEntries(SETTING_FIELDS.map((field) => [field.key, ""])) as SettingIds;

export function ServerSettingsLoading() {
  return (
    <SettingsFrame
      title="서버 설정"
      active="/settings/server"
      actions={<Button disabled>변경 저장</Button>}
    >
      <LoadingRegion label="서버 설정을 불러오는 중입니다" className="max-w-[880px] gap-150">
        <ServerBasicPanel loading />
        <DiscordLinkPanel ids={EMPTY_IDS} checks={{}} serverName="" loading />
        <JoinLinkPanel joinUrl="" disabled />
      </LoadingRegion>
    </SettingsFrame>
  );
}
