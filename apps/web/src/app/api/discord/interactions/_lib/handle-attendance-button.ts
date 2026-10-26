import { ATTENDANCE_BUTTON_PREFIX } from "@roll-and-call/game-notices";

import { openAttendanceFromDiscord } from "@/features/confirm-attendance/server";

import { attendanceReplyResponse } from "./attendance-reply-response";
import { attendanceSelectResponse } from "./attendance-select-response";
import { ephemeralResponse } from "./ephemeral-response";
import { INTERACTION_MESSAGE } from "./interaction-message";
import { INTERACTION_RESPONSE_TYPE } from "./interaction-response-type";
import type { DiscordInteraction, DiscordInteractionResponse } from "./interaction-types";

export async function handleAttendanceButton(
  interaction: DiscordInteraction,
): Promise<DiscordInteractionResponse> {
  const customId = interaction.data?.custom_id ?? "";
  const discordId = interaction.member?.user.id;
  if (!interaction.guild_id || !discordId) {
    return ephemeralResponse(INTERACTION_MESSAGE.serverOnly);
  }
  const gameId = customId.slice(ATTENDANCE_BUTTON_PREFIX.length);
  try {
    const opened = await openAttendanceFromDiscord({
      guildId: interaction.guild_id,
      discordId,
      gameId,
    });
    if (opened.kind === "reply") return attendanceReplyResponse({ reply: opened.reply });
    return attendanceSelectResponse({
      type: INTERACTION_RESPONSE_TYPE.message,
      gameId,
      options: opened.options.map((option) => ({ label: option.name, value: option.userId })),
      selectedUserIds: [],
    });
  } catch (error) {
    console.error("디스코드 출석 입력 열기 실패", { customId, error });
    return ephemeralResponse(INTERACTION_MESSAGE.attendanceFailed);
  }
}
