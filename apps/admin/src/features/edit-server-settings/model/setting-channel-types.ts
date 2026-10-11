import { DISCORD_CHANNEL_TYPE } from "@roll-and-call/discord";

import type { SettingFieldKey } from "./setting-field";

const POSTABLE = [DISCORD_CHANNEL_TYPE.text, DISCORD_CHANNEL_TYPE.announcement];

// 채널 항목이 받는 채널 종류. 모집 채널은 포럼만, 후기 채널은 포럼과 텍스트 채널 모두 받는다.
export const SETTING_CHANNEL_TYPES: Record<SettingFieldKey, readonly number[]> = {
  recruitChannelId: [DISCORD_CHANNEL_TYPE.forum],
  closedChannelId: POSTABLE,
  announceChannelId: POSTABLE,
  staffChannelId: POSTABLE,
  reviewForumChannelId: [...POSTABLE, DISCORD_CHANNEL_TYPE.forum],
};
