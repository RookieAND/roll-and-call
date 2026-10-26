import { ATTENDANCE_DONE_PREFIX, ATTENDANCE_SELECT_PREFIX } from "@roll-and-call/game-notices";

import { INTERACTION_MESSAGE } from "./interaction-message";
import {
  INTERACTION_RESPONSE_TYPE,
  type InteractionResponseType,
} from "./interaction-response-type";
import type { DiscordInteractionResponse, DiscordSelectOption } from "./interaction-types";

const COMPONENT_TYPE = { actionRow: 1, button: 2, stringSelect: 3 } as const;
const BUTTON_STYLE_PRIMARY = 1;
const EPHEMERAL_FLAG = 64;
const OPTION_LABEL_MAX = 100;

// 선택 상태는 서버에 두지 않고 메시지의 셀렉트 기본 선택값(default)으로 들고 다닌다.
export function attendanceSelectResponse({
  type,
  gameId,
  options,
  selectedUserIds,
}: {
  type: InteractionResponseType;
  gameId: string;
  options: DiscordSelectOption[];
  selectedUserIds: readonly string[];
}): DiscordInteractionResponse {
  return {
    type,
    data: {
      content: INTERACTION_MESSAGE.attendancePrompt,
      flags: type === INTERACTION_RESPONSE_TYPE.message ? EPHEMERAL_FLAG : undefined,
      allowed_mentions: { parse: [] },
      components: [
        {
          type: COMPONENT_TYPE.actionRow,
          components: [
            {
              type: COMPONENT_TYPE.stringSelect,
              custom_id: `${ATTENDANCE_SELECT_PREFIX}${gameId}`,
              placeholder: "불참한 참여자 선택",
              min_values: 0,
              max_values: options.length,
              options: options.map((option) => ({
                label: option.label.slice(0, OPTION_LABEL_MAX),
                value: option.value,
                default: selectedUserIds.includes(option.value),
              })),
            },
          ],
        },
        {
          type: COMPONENT_TYPE.actionRow,
          components: [
            {
              type: COMPONENT_TYPE.button,
              style: BUTTON_STYLE_PRIMARY,
              label: "완료",
              custom_id: `${ATTENDANCE_DONE_PREFIX}${gameId}`,
            },
          ],
        },
      ],
    },
  };
}
