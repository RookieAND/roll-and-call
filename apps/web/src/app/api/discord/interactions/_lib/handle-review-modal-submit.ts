import { REVIEW_BUTTON_PREFIX } from "@roll-and-call/game-notices";

import { writeReviewFromDiscord } from "@/features/write-review";

import { ephemeralResponse } from "./ephemeral-response";
import type { DiscordInteraction, DiscordInteractionResponse } from "./interaction-types";
import { REVIEW_BODY_INPUT_ID } from "./review-modal-response";

export async function handleReviewModalSubmit(
  interaction: DiscordInteraction,
): Promise<DiscordInteractionResponse> {
  const customId = interaction.data?.custom_id ?? "";
  const discordId = interaction.member?.user.id;
  const body = interaction.data?.components
    ?.flatMap((row) => row.components)
    .find((input) => input.custom_id === REVIEW_BODY_INPUT_ID)?.value;
  if (!customId.startsWith(REVIEW_BUTTON_PREFIX) || !interaction.guild_id || !discordId || !body) {
    return ephemeralResponse("지원하지 않는 요청입니다.");
  }
  try {
    const message = await writeReviewFromDiscord({
      guildId: interaction.guild_id,
      discordId,
      gameId: customId.slice(REVIEW_BUTTON_PREFIX.length),
      body,
    });
    return ephemeralResponse(message);
  } catch (error) {
    console.error("디스코드 후기 작성 실패", { customId, error });
    return ephemeralResponse("후기를 등록하지 못했습니다. 잠시 뒤에 다시 시도해 주세요.");
  }
}
