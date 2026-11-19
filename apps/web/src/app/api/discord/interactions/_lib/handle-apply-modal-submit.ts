import { APPLY_BUTTON_PREFIX } from "@roll-and-call/game-notices";

import { applyFromDiscord } from "@/features/join-game/server";

import { APPLY_NOTE_FIELD_ID } from "./apply-note-modal-response";
import { ephemeralResponse } from "./ephemeral-response";
import { INTERACTION_MESSAGE } from "./interaction-message";
import type { DiscordInteraction, DiscordInteractionResponse } from "./interaction-types";
import { modalFields } from "./modal-fields";
import { APPLY_COMMIT_FIELD_ID } from "./multi-round-apply-modal-response";

export async function handleApplyModalSubmit(
  interaction: DiscordInteraction,
): Promise<DiscordInteractionResponse> {
  const customId = interaction.data?.custom_id ?? "";
  const discordId = interaction.member?.user.id;
  const fields = modalFields(interaction);
  const note = fields.find((field) => field.custom_id === APPLY_NOTE_FIELD_ID)?.value;
  // 다회차 모달에만 체크박스가 있다. 없으면 단발 신청글 모달이다.
  const commitField = fields.find((field) => field.custom_id === APPLY_COMMIT_FIELD_ID);
  const commitment = commitField ? commitField.value === true : undefined;
  if (!customId.startsWith(APPLY_BUTTON_PREFIX)) {
    return ephemeralResponse(INTERACTION_MESSAGE.unsupported);
  }
  if (!interaction.guild_id || !discordId) {
    return ephemeralResponse(INTERACTION_MESSAGE.serverOnly);
  }
  if (commitment === false) return ephemeralResponse(INTERACTION_MESSAGE.commitmentRequired);
  if (typeof note !== "string" && commitment === undefined) {
    return ephemeralResponse(INTERACTION_MESSAGE.applyNoteLost);
  }
  try {
    const result = await applyFromDiscord({
      guildId: interaction.guild_id,
      discordId,
      gameId: customId.slice(APPLY_BUTTON_PREFIX.length),
      applicationNote: typeof note === "string" ? note : undefined,
      commitment,
    });
    return ephemeralResponse(
      "message" in result ? result.message : INTERACTION_MESSAGE.applyNoteLost,
    );
  } catch (error) {
    console.error("디스코드 신청글 신청 실패", { customId, error });
    return ephemeralResponse(INTERACTION_MESSAGE.applyFailed);
  }
}
