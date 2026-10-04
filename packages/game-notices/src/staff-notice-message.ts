import type { DiscordMessageInput } from "@roll-and-call/discord";
import { isUndefined } from "es-toolkit";

import { adminUrl } from "./admin-url";
import type { StaffNotice } from "./staff-notice-kind";
import { staffNoticeParts } from "./staff-notice-parts";

// 임베드 제목 한 줄 + 대상 한 줄 + [어드민에서 열기]. 멘션(content·userMentions)과 사유는 넣지 않는다(D302).
export function staffNoticeMessage({
  notice,
  slug,
}: {
  notice: StaffNotice;
  slug: string;
}): DiscordMessageInput {
  const { title, target, path, color } = staffNoticeParts(notice);
  const url = adminUrl({ slug, path });
  return {
    embeds: [{ title, description: target, color }],
    buttons: isUndefined(url) ? [] : [{ label: "어드민에서 열기", url }],
  };
}
