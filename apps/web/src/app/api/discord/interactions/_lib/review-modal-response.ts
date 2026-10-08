import { REVIEW_BODY_MAX_LENGTH, REVIEW_BODY_MIN_LENGTH } from "@/entities/review";

import type { DiscordInteractionResponse } from "./interaction-types";

const MODAL_RESPONSE = 9;
const ACTION_ROW = 1;
const TEXT_INPUT = 4;
const PARAGRAPH_STYLE = 2;

export const REVIEW_BODY_INPUT_ID = "body";

export function reviewModalResponse(customId: string): DiscordInteractionResponse {
  return {
    type: MODAL_RESPONSE,
    data: {
      custom_id: customId,
      title: "세션 후기 작성",
      components: [
        {
          type: ACTION_ROW,
          components: [
            {
              type: TEXT_INPUT,
              custom_id: REVIEW_BODY_INPUT_ID,
              label: "후기",
              style: PARAGRAPH_STYLE,
              min_length: REVIEW_BODY_MIN_LENGTH,
              max_length: REVIEW_BODY_MAX_LENGTH,
              required: true,
              placeholder: "사진과 스포일러 표시는 웹에서 고칠 수 있습니다.",
            },
          ],
        },
      ],
    },
  };
}
