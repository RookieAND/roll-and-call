import { APPLY_BUTTON_PREFIX } from "@roll-and-call/game-notices";

import { applyFromDiscord } from "@/features/join-game/server";

import { APPLY_NOTE_FIELD_ID } from "./apply-note-modal-response";
import { ephemeralResponse } from "./ephemeral-response";
import { INTERACTION_MESSAGE } from "./interaction-message";
import type { DiscordInteraction, DiscordInteractionResponse } from "./interaction-types";

export async function handleApplyModalSubmit(
  interaction: DiscordInteraction,
): Promise<DiscordInteractionResponse> {
  const customId = interaction.data?.custom_id ?? "";
  const discordId = interaction.member?.user.id;
  const note = interaction.data?.components
    ?.map(({ component }) => component)
    .find((field) => field.custom_id === APPLY_NOTE_FIELD_ID)?.value;
  if (!customId.startsWith(APPLY_BUTTON_PREFIX)) {
    return ephemeralResponse(INTERACTION_MESSAGE.unsupported);
  }
  if (!interaction.guild_id || !discordId) {
    return ephemeralResponse(INTERACTION_MESSAGE.serverOnly);
  }
  if (typeof note !== "string") {
    return ephemeralResponse(INTERACTION_MESSAGE.applyNoteLost);
  }
  try {
    const result = await applyFromDiscord({
      guildId: interaction.guild_id,
      discordId,
      gameId: customId.slice(APPLY_BUTTON_PREFIX.length),
      applicationNote: note,
    });
    return ephemeralResponse(
      "message" in result ? result.message : INTERACTION_MESSAGE.applyNoteLost,
    );
  } catch (error) {
    console.error("디스코드 신청글 신청 실패", { customId, error });
    return ephemeralResponse(INTERACTION_MESSAGE.applyFailed);
  }
}
