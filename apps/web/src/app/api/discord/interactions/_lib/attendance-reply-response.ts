import type { DiscordAttendanceReply } from "@/features/confirm-attendance";

import {
  INTERACTION_RESPONSE_TYPE,
  type InteractionResponseType,
} from "./interaction-response-type";
import type { DiscordInteractionResponse } from "./interaction-types";

const COMPONENT_TYPE = { actionRow: 1, button: 2 } as const;
const BUTTON_STYLE_LINK = 5;
const EPHEMERAL_FLAG = 64;
const MANAGE_LINK_LABEL = "운영 관리 열기";

// 본인에게만 보이는 답. 링크가 있으면 운영 관리로 가는 링크 버튼을 붙이고, 메시지를 고치는 응답이면 기존 컴포넌트를 걷어 낸다.
export function attendanceReplyResponse({
  reply,
  type = INTERACTION_RESPONSE_TYPE.message,
  linkLabel = MANAGE_LINK_LABEL,
}: {
  reply: DiscordAttendanceReply;
  type?: InteractionResponseType;
  linkLabel?: string;
}): DiscordInteractionResponse {
  const components = reply.webUrl
    ? [
        {
          type: COMPONENT_TYPE.actionRow,
          components: [
            {
              type: COMPONENT_TYPE.button,
              style: BUTTON_STYLE_LINK,
              label: linkLabel,
              url: reply.webUrl,
            },
          ],
        },
      ]
    : [];
  return {
    type,
    data: {
      content: reply.message,
      flags: type === INTERACTION_RESPONSE_TYPE.message ? EPHEMERAL_FLAG : undefined,
      components,
      allowed_mentions: { parse: [] },
    },
  };
}
