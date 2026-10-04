import { DISCORD_CHANNEL_TYPE } from "@roll-and-call/discord";

import type { SettingFieldKey } from "./setting-field";

const POSTABLE = [DISCORD_CHANNEL_TYPE.text, DISCORD_CHANNEL_TYPE.announcement];

// 채널 항목이 받는 채널 종류.
// ponytail: 모집 채널은 사용자 앱이 지금 메시지 + 스레드로 올리므로 텍스트 채널도 받는다.
export const SETTING_CHANNEL_TYPES: Record<SettingFieldKey, readonly number[]> = {
  recruitChannelId: [...POSTABLE, DISCORD_CHANNEL_TYPE.forum],
  closedChannelId: POSTABLE,
  announceChannelId: POSTABLE,
  staffChannelId: POSTABLE,
  reviewForumChannelId: [DISCORD_CHANNEL_TYPE.forum],
};
