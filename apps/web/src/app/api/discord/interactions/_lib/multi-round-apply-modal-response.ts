import { APPLICATION_NOTE_MAX_LENGTH } from "@roll-and-call/database/games/model";

import { APPLY_NOTE_FIELD_ID } from "./apply-note-modal-response";
import type { DiscordInteractionResponse } from "./interaction-types";

const MODAL_RESPONSE = 9;
const COMPONENT_TYPE = { textDisplay: 10, label: 18, textInput: 4, checkbox: 23 } as const;
const PARAGRAPH_STYLE = 2;
const NOTE_GUIDE = "GM에게 전할 말을 500자 안으로 적어 주세요.";

export const APPLY_COMMIT_FIELD_ID = "commit";

// 다회차 [신청하기] 모달: 일정 한 줄과 안내, 신청글(받는 구인만), 「마지막 회차까지 함께하겠습니다」 체크박스.
// 디스코드 체크박스는 필수로 지정할 수 없어 제출을 받은 쪽에서 체크했는지 확인한다.
export function multiRoundApplyModalResponse({
  customId,
  scheduleLine,
  note,
}: {
  customId: string;
  scheduleLine: string;
  // 신청글을 받는 구인이면 GM의 질문(없으면 null). 받지 않으면 undefined다.
  note?: { question: string | null };
}): DiscordInteractionResponse {
  const noteField = note && {
    type: COMPONENT_TYPE.label,
    label: "신청글",
    description: note.question ?? NOTE_GUIDE,
    component: {
      type: COMPONENT_TYPE.textInput,
      custom_id: APPLY_NOTE_FIELD_ID,
      style: PARAGRAPH_STYLE,
      min_length: 1,
      max_length: APPLICATION_NOTE_MAX_LENGTH,
      required: true,
    },
  };
  return {
    type: MODAL_RESPONSE,
    data: {
      custom_id: customId,
      title: "신청하기",
      components: [
        {
          type: COMPONENT_TYPE.textDisplay,
          content: `${scheduleLine}\n마지막 회차까지 함께해 주세요.`,
        },
        ...(noteField ? [noteField] : []),
        {
          type: COMPONENT_TYPE.label,
          label: "마지막 회차까지 함께하겠습니다",
          component: { type: COMPONENT_TYPE.checkbox, custom_id: APPLY_COMMIT_FIELD_ID },
        },
      ],
    },
  };
}
