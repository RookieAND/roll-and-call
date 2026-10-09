import { APPLICATION_NOTE_MAX_LENGTH } from "@roll-and-call/database/games/model";

import type { DiscordInteractionResponse } from "./interaction-types";

const MODAL_RESPONSE = 9;
const COMPONENT_TYPE = { label: 18, textInput: 4 } as const;
const PARAGRAPH_STYLE = 2;

export const APPLY_NOTE_FIELD_ID = "note";

export function applyNoteModalResponse(customId: string): DiscordInteractionResponse {
  return {
    type: MODAL_RESPONSE,
    data: {
      custom_id: customId,
      title: "신청글 쓰기",
      components: [
        {
          type: COMPONENT_TYPE.label,
          label: "신청글",
          component: {
            type: COMPONENT_TYPE.textInput,
            custom_id: APPLY_NOTE_FIELD_ID,
            style: PARAGRAPH_STYLE,
            min_length: 1,
            max_length: APPLICATION_NOTE_MAX_LENGTH,
            required: true,
            placeholder: "GM에게 전할 내용을 적어 주세요.",
          },
        },
      ],
    },
  };
}
