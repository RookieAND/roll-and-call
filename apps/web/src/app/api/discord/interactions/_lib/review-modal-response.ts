import {
  REVIEW_BODY_MAX_LENGTH,
  REVIEW_BODY_MIN_LENGTH,
  REVIEW_PHOTO_MAX_COUNT,
} from "@/entities/review";

import type { DiscordInteractionResponse } from "./interaction-types";

const MODAL_RESPONSE = 9;
const COMPONENT_TYPE = { label: 18, textInput: 4, fileUpload: 19, checkbox: 23 } as const;
const PARAGRAPH_STYLE = 2;

export const REVIEW_FIELD_ID = { body: "body", photos: "photos", spoiler: "spoiler" } as const;

export function reviewModalResponse(customId: string): DiscordInteractionResponse {
  return {
    type: MODAL_RESPONSE,
    data: {
      custom_id: customId,
      title: "세션 후기 작성",
      components: [
        {
          type: COMPONENT_TYPE.label,
          label: "후기",
          component: {
            type: COMPONENT_TYPE.textInput,
            custom_id: REVIEW_FIELD_ID.body,
            style: PARAGRAPH_STYLE,
            min_length: REVIEW_BODY_MIN_LENGTH,
            max_length: REVIEW_BODY_MAX_LENGTH,
            required: true,
          },
        },
        {
          type: COMPONENT_TYPE.label,
          label: "사진",
          description: `최대 ${REVIEW_PHOTO_MAX_COUNT}장 · JPG, PNG, WebP · 5MB 이하`,
          component: {
            type: COMPONENT_TYPE.fileUpload,
            custom_id: REVIEW_FIELD_ID.photos,
            min_values: 0,
            max_values: REVIEW_PHOTO_MAX_COUNT,
            required: false,
            file_types: [".jpg", ".jpeg", ".png", ".webp"],
          },
        },
        {
          type: COMPONENT_TYPE.label,
          label: "스포일러 포함",
          description: "체크하면 후기가 가려진 채로 보입니다.",
          component: { type: COMPONENT_TYPE.checkbox, custom_id: REVIEW_FIELD_ID.spoiler },
        },
      ],
    },
  };
}
