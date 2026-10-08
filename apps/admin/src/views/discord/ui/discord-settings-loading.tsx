import { Button } from "@roll-and-call/ui";

import { SETTING_FIELDS, type SettingIds } from "@/features/edit-server-settings";
import { LoadingRegion } from "@/shared/ui";

import { DiscordFrame } from "./discord-frame";
import { DiscordLinkPanel } from "./discord-link-panel";

const EMPTY_IDS = Object.fromEntries(SETTING_FIELDS.map((field) => [field.key, ""])) as SettingIds;

export function DiscordSettingsLoading() {
  return (
    <DiscordFrame
      title="디스코드 연동"
      active="/discord/link"
      actions={<Button disabled>변경 저장</Button>}
    >
      <LoadingRegion label="디스코드 연동을 불러오는 중입니다" className="max-w-[880px] gap-150">
        <DiscordLinkPanel ids={EMPTY_IDS} checks={{}} serverName="" loading />
      </LoadingRegion>
    </DiscordFrame>
  );
}
