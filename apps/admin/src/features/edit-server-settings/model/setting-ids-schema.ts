import { z } from "zod";

import type { SettingIds } from "./setting-field";

const channelId = z.string().max(64);

export const settingIdsSchema = z.object({
  recruitChannelId: channelId,
  closedChannelId: channelId,
  announceChannelId: channelId,
  staffChannelId: channelId,
  reviewForumChannelId: channelId,
}) satisfies z.ZodType<SettingIds>;
