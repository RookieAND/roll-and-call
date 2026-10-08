import type { DiscordInteraction, DiscordInteractionResponse } from "./interaction-types";
import { reviewModalResponse } from "./review-modal-response";

export function handleReviewButton(interaction: DiscordInteraction): DiscordInteractionResponse {
  return reviewModalResponse(interaction.data?.custom_id ?? "");
}
