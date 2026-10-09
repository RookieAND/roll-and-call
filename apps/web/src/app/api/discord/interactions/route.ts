import { APPLY_BUTTON_PREFIX, REVIEW_BUTTON_PREFIX } from "@roll-and-call/game-notices";
import { isNull } from "es-toolkit";
import { NextResponse } from "next/server";

import { buildInteractionResponse } from "./_lib/build-interaction-response";
import { handleApplyButton } from "./_lib/handle-apply-button";
import { handleApplyModalSubmit } from "./_lib/handle-apply-modal-submit";
import { handleOnboardingCommand } from "./_lib/handle-onboarding-command";
import { handleReviewButton } from "./_lib/handle-review-button";
import { handleReviewModalSubmit } from "./_lib/handle-review-modal-submit";
import type { DiscordInteraction } from "./_lib/interaction-types";
import { verifyDiscordRequest } from "./_lib/verify-discord-request";

const ONBOARDING_COMMAND_NAME = "온보딩";
const INTERACTION_APPLICATION_COMMAND = 2;
const INTERACTION_MESSAGE_COMPONENT = 3;
const INTERACTION_MODAL_SUBMIT = 5;

export async function POST(request: Request) {
  const body = await verifyDiscordRequest(request);
  if (isNull(body)) {
    return NextResponse.json({ error: "invalid request signature" }, { status: 401 });
  }

  const interaction = JSON.parse(body) as DiscordInteraction;
  if (interaction.type === INTERACTION_MODAL_SUBMIT) {
    if (interaction.data?.custom_id?.startsWith(APPLY_BUTTON_PREFIX)) {
      return NextResponse.json(await handleApplyModalSubmit(interaction));
    }
    return NextResponse.json(handleReviewModalSubmit(interaction));
  }
  if (interaction.type === INTERACTION_MESSAGE_COMPONENT) {
    if (interaction.data?.custom_id?.startsWith(REVIEW_BUTTON_PREFIX)) {
      return NextResponse.json(handleReviewButton(interaction));
    }
    return NextResponse.json(await handleApplyButton(interaction));
  }
  if (
    interaction.type === INTERACTION_APPLICATION_COMMAND &&
    interaction.data?.name === ONBOARDING_COMMAND_NAME
  ) {
    return NextResponse.json(await handleOnboardingCommand(interaction));
  }
  return NextResponse.json(buildInteractionResponse(interaction));
}
