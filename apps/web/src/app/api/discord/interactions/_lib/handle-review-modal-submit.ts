import { REVIEW_BUTTON_PREFIX } from "@roll-and-call/game-notices";
import { after } from "next/server";

import { writeReviewFromDiscord } from "@/features/write-review/server";

import { deferredEphemeralResponse } from "./deferred-ephemeral-response";
import { editOriginalResponse } from "./edit-original-response";
import { ephemeralResponse } from "./ephemeral-response";
import type { DiscordInteraction, DiscordInteractionResponse } from "./interaction-types";
import { parseReviewModal } from "./parse-review-modal";

// 사진을 옮기느라 3초를 넘길 수 있어 먼저 받아 두고, 결과는 나중에 같은 응답에 채운다.
export function handleReviewModalSubmit(
  interaction: DiscordInteraction,
): DiscordInteractionResponse {
  const customId = interaction.data?.custom_id ?? "";
  const discordId = interaction.member?.user.id;
  const { body, spoiler, photos } = parseReviewModal(interaction);
  if (!customId.startsWith(REVIEW_BUTTON_PREFIX) || !interaction.guild_id || !discordId || !body) {
    return ephemeralResponse("지원하지 않는 요청입니다.");
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
      content = "후기를 등록하지 못했습니다. 잠시 뒤에 다시 시도해 주세요.";
    }
    await editOriginalResponse({ interaction, content });
  });
  return deferredEphemeralResponse();
}
