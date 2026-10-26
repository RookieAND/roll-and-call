import { ATTENDANCE_DONE_PREFIX } from "@roll-and-call/game-notices";

import { completeAttendanceFromDiscord } from "@/features/confirm-attendance/server";

import { attendanceReplyResponse } from "./attendance-reply-response";
import { attendanceSelectOptions } from "./attendance-select-options";
import { ephemeralResponse } from "./ephemeral-response";
import { INTERACTION_MESSAGE } from "./interaction-message";
import { INTERACTION_RESPONSE_TYPE } from "./interaction-response-type";
import type { DiscordInteraction, DiscordInteractionResponse } from "./interaction-types";

export async function handleAttendanceDone(
  interaction: DiscordInteraction,
): Promise<DiscordInteractionResponse> {
  const customId = interaction.data?.custom_id ?? "";
  const discordId = interaction.member?.user.id;
  if (!interaction.guild_id || !discordId) {
    return ephemeralResponse(INTERACTION_MESSAGE.serverOnly);
  }
  const absentUserIds = attendanceSelectOptions(interaction)
    .filter((option) => option.default)
    .map((option) => option.value);
  try {
    const reply = await completeAttendanceFromDiscord({
      guildId: interaction.guild_id,
      discordId,
      gameId: customId.slice(ATTENDANCE_DONE_PREFIX.length),
      absentUserIds,
    });
    return attendanceReplyResponse({ reply, type: INTERACTION_RESPONSE_TYPE.updateMessage });
  } catch (error) {
    console.error("디스코드 출석 확정 실패", { customId, error });
    return ephemeralResponse(INTERACTION_MESSAGE.attendanceFailed);
  }
}
