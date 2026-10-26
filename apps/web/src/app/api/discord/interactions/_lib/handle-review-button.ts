import { REVIEW_BUTTON_PREFIX } from "@roll-and-call/game-notices";

import { checkReviewFromDiscord } from "@/features/write-review/server";

import { attendanceReplyResponse } from "./attendance-reply-response";
import { ephemeralResponse } from "./ephemeral-response";
import { INTERACTION_MESSAGE } from "./interaction-message";
import type { DiscordInteraction, DiscordInteractionResponse } from "./interaction-types";
import { reviewModalResponse } from "./review-modal-response";

const REVIEW_LINK_LABEL = "웹에서 작성하기";

export async function handleReviewButton(
  interaction: DiscordInteraction,
): Promise<DiscordInteractionResponse> {
  const customId = interaction.data?.custom_id ?? "";
  const discordId = interaction.member?.user.id;
  if (!interaction.guild_id || !discordId) {
    return ephemeralResponse(INTERACTION_MESSAGE.serverOnly);
  }

  const blocked = await checkReviewFromDiscord({
    guildId: interaction.guild_id,
    discordId,
    gameId: customId.slice(REVIEW_BUTTON_PREFIX.length),
  });
  return blocked
    ? attendanceReplyResponse({ reply: blocked, linkLabel: REVIEW_LINK_LABEL })
    : reviewModalResponse(customId);
}
