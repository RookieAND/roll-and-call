import { APPLY_BUTTON_PREFIX } from "@roll-and-call/game-notices";

import { applyFromDiscord } from "@/features/join-game/server";

import { applyNoteModalResponse } from "./apply-note-modal-response";
import { ephemeralResponse } from "./ephemeral-response";
import { INTERACTION_MESSAGE } from "./interaction-message";
import type { DiscordInteraction, DiscordInteractionResponse } from "./interaction-types";

export async function handleApplyButton(
  interaction: DiscordInteraction,
): Promise<DiscordInteractionResponse> {
  const customId = interaction.data?.custom_id ?? "";
  const discordId = interaction.member?.user.id;
  if (!customId.startsWith(APPLY_BUTTON_PREFIX)) {
    return ephemeralResponse(INTERACTION_MESSAGE.unsupported);
  }
  if (!interaction.guild_id || !discordId) {
    return ephemeralResponse(INTERACTION_MESSAGE.serverOnly);
  }
  try {
    const result = await applyFromDiscord({
      guildId: interaction.guild_id,
      discordId,
      gameId: customId.slice(APPLY_BUTTON_PREFIX.length),
    });
    return "askNote" in result
      ? applyNoteModalResponse(customId)
      : ephemeralResponse(result.message);
  } catch (error) {
    console.error("디스코드 버튼 신청 실패", { customId, error });
    return ephemeralResponse(INTERACTION_MESSAGE.applyFailed);
  }
}
