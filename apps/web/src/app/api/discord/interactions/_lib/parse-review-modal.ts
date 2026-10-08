import type { DiscordInteraction } from "./interaction-types";
import { REVIEW_FIELD_ID } from "./review-modal-response";

export function parseReviewModal(interaction: DiscordInteraction) {
  const fields = interaction.data?.components?.map(({ component }) => component) ?? [];
  const fieldOf = (customId: string) => fields.find((field) => field.custom_id === customId);
  const attachments = interaction.data?.resolved?.attachments ?? {};
  const body = fieldOf(REVIEW_FIELD_ID.body)?.value;

  return {
    body: typeof body === "string" ? body : "",
    spoiler: fieldOf(REVIEW_FIELD_ID.spoiler)?.value === true,
    photos: (fieldOf(REVIEW_FIELD_ID.photos)?.values ?? []).flatMap((id) => attachments[id] ?? []),
  };
}
