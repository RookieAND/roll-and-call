import { REVIEW_BUTTON_PREFIX } from "@roll-and-call/game-notices";
import { isNull } from "es-toolkit";
import { NextResponse } from "next/server";

import { buildInteractionResponse } from "./_lib/build-interaction-response";
import { handleApplyButton } from "./_lib/handle-apply-button";
import { handleReviewButton } from "./_lib/handle-review-button";
import { handleReviewModalSubmit } from "./_lib/handle-review-modal-submit";
import type { DiscordInteraction } from "./_lib/interaction-types";
import { verifyDiscordRequest } from "./_lib/verify-discord-request";

const INTERACTION_MESSAGE_COMPONENT = 3;
const INTERACTION_MODAL_SUBMIT = 5;

export async function POST(request: Request) {
  const body = await verifyDiscordRequest(request);
  if (isNull(body)) {
    return NextResponse.json({ error: "invalid request signature" }, { status: 401 });
  }

  const interaction = JSON.parse(body) as DiscordInteraction;
  if (interaction.type === INTERACTION_MODAL_SUBMIT) {
    return NextResponse.json(await handleReviewModalSubmit(interaction));
  }
  if (interaction.type === INTERACTION_MESSAGE_COMPONENT) {
    if (interaction.data?.custom_id?.startsWith(REVIEW_BUTTON_PREFIX)) {
      return NextResponse.json(handleReviewButton(interaction));
    }
    return NextResponse.json(await handleApplyButton(interaction));
  }
  return NextResponse.json(buildInteractionResponse(interaction));
}
