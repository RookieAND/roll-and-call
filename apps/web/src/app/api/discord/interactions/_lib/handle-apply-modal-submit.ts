import { APPLY_BUTTON_PREFIX } from "@roll-and-call/game-notices";

import { applyFromDiscord } from "@/features/join-game/server";

import { APPLY_NOTE_FIELD_ID } from "./apply-note-modal-response";
import { ephemeralResponse } from "./ephemeral-response";
import type { DiscordInteraction, DiscordInteractionResponse } from "./interaction-types";

export async function handleApplyModalSubmit(
  interaction: DiscordInteraction,
): Promise<DiscordInteractionResponse> {
  const customId = interaction.data?.custom_id ?? "";
  const discordId = interaction.member?.user.id;
  const note = interaction.data?.components
    ?.map(({ component }) => component)
    .find((field) => field.custom_id === APPLY_NOTE_FIELD_ID)?.value;
  if (
    !customId.startsWith(APPLY_BUTTON_PREFIX) ||
    !interaction.guild_id ||
    !discordId ||
    typeof note !== "string"
  ) {
    return ephemeralResponse("지원하지 않는 요청입니다.");
  }
  try {
    const result = await applyFromDiscord({
      guildId: interaction.guild_id,
      discordId,
      gameId: customId.slice(APPLY_BUTTON_PREFIX.length),
      applicationNote: note,
    });
    return ephemeralResponse("message" in result ? result.message : "신청하지 못했습니다.");
  } catch (error) {
    console.error("디스코드 신청글 신청 실패", { customId, error });
    return ephemeralResponse("신청하지 못했습니다. 잠시 뒤에 다시 시도해 주세요.");
  }
}
