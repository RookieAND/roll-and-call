import type { DiscordMessageInput } from "@roll-and-call/discord";
import { isUndefined } from "es-toolkit";

import { adminUrl } from "./admin-url";
import type { StaffNotice } from "./staff-notice-kind";
import { staffNoticeParts } from "./staff-notice-parts";

// 임베드 제목 + 항목 필드 + 접수 시각(디스코드가 보는 사람 시간대로 표시) + [어드민에서 열기]. 멘션(content·userMentions)과 사유는 넣지 않는다(D302).
export function staffNoticeMessage({
  notice,
  slug,
}: {
  notice: StaffNotice;
  slug: string;
}): DiscordMessageInput {
  const { title, thumbnail, description, fields, path, color } = staffNoticeParts(notice);
  const url = adminUrl({ slug, path });
  return {
    embeds: [{ title, thumbnail, description, fields, color, timestamp: new Date().toISOString() }],
    buttons: isUndefined(url) ? [] : [{ label: "어드민에서 열기", url }],
  };
}
