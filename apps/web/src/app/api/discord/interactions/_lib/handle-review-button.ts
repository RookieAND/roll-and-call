import { REVIEW_BUTTON_PREFIX } from "@roll-and-call/game-notices";

import { checkReviewFromDiscord } from "@/features/write-review/server";

import { ephemeralResponse } from "./ephemeral-response";
import type { DiscordInteraction, DiscordInteractionResponse } from "./interaction-types";
import { reviewModalResponse } from "./review-modal-response";

export async function handleReviewButton(
  interaction: DiscordInteraction,
): Promise<DiscordInteractionResponse> {
  const customId = interaction.data?.custom_id ?? "";
  const discordId = interaction.member?.user.id;
  if (!interaction.guild_id || !discordId) return ephemeralResponse("지원하지 않는 요청입니다.");

  const blocked = await checkReviewFromDiscord({
    guildId: interaction.guild_id,
    discordId,
    gameId: customId.slice(REVIEW_BUTTON_PREFIX.length),
  });
  return blocked ? ephemeralResponse(blocked) : reviewModalResponse(customId);
}
