import type { Server } from "@roll-and-call/database";
import { sendDiscordMessage } from "@roll-and-call/discord";

import type { StaffNotice } from "./staff-notice-kind";
import { staffNoticeMessage } from "./staff-notice-message";

// 운영진 채널이 비면 올리지 않는다. 발송 실패는 sendDiscordMessage가 삼키고 다시 보내지 않는다(조치는 그대로 성공).
export async function postStaffNotice({
  server,
  notice,
}: {
  server: Pick<Server, "slug" | "staffChannelId">;
  notice: StaffNotice;
}) {
  if (!server.staffChannelId) return;
  await sendDiscordMessage({
    channelId: server.staffChannelId,
    input: staffNoticeMessage({ notice, slug: server.slug }),
  });
}
