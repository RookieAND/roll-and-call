import { ATTENDANCE_SELECT_PREFIX } from "@roll-and-call/game-notices";

import { attendanceSelectOptions } from "./attendance-select-options";
import { attendanceSelectResponse } from "./attendance-select-response";
import { INTERACTION_RESPONSE_TYPE } from "./interaction-response-type";
import type { DiscordInteraction, DiscordInteractionResponse } from "./interaction-types";

// 고른 사람을 메시지의 기본 선택값으로 다시 그린다. 서버는 아무것도 저장하지 않는다.
export function handleAttendanceSelect(
  interaction: DiscordInteraction,
): DiscordInteractionResponse {
  const customId = interaction.data?.custom_id ?? "";
  return attendanceSelectResponse({
    type: INTERACTION_RESPONSE_TYPE.updateMessage,
    gameId: customId.slice(ATTENDANCE_SELECT_PREFIX.length),
    options: attendanceSelectOptions(interaction),
    selectedUserIds: interaction.data?.values ?? [],
  });
}
