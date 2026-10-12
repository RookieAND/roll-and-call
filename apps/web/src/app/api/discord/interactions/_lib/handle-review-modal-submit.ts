import { REVIEW_BUTTON_PREFIX } from "@roll-and-call/game-notices";
import { after } from "next/server";

import { writeReviewFromDiscord } from "@/features/write-review/server";

import { deferredEphemeralResponse } from "./deferred-ephemeral-response";
import { editOriginalResponse } from "./edit-original-response";
import { ephemeralResponse } from "./ephemeral-response";
import { INTERACTION_MESSAGE } from "./interaction-message";
import type { DiscordInteraction, DiscordInteractionResponse } from "./interaction-types";
import { parseReviewModal } from "./parse-review-modal";

// 사진을 옮기느라 3초를 넘길 수 있어 먼저 받아 두고, 결과는 나중에 같은 응답에 채운다.
export function handleReviewModalSubmit(
  interaction: DiscordInteraction,
): DiscordInteractionResponse {
  const customId = interaction.data?.custom_id ?? "";
  const discordId = interaction.member?.user.id;
  const { body, spoiler, photos } = parseReviewModal(interaction);
  if (!customId.startsWith(REVIEW_BUTTON_PREFIX)) {
    return ephemeralResponse(INTERACTION_MESSAGE.unsupported);
  }
  if (!interaction.guild_id || !discordId) {
    return ephemeralResponse(INTERACTION_MESSAGE.serverOnly);
  }

  const guildId = interaction.guild_id;
  after(async () => {
    let content: string;
    try {
      content = await writeReviewFromDiscord({
        guildId,
        discordId,
        gameId: customId.slice(REVIEW_BUTTON_PREFIX.length),
        body,
        spoiler,
        photos,
      });
    } catch (error) {
      console.error("디스코드 후기 작성 실패", { customId, error });
      content = INTERACTION_MESSAGE.reviewFailed;
    }
    await editOriginalResponse({ interaction, content });
  });
  return deferredEphemeralResponse();
}
