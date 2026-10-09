"use server";

import {
  CONTENT_REASON,
  parseReason,
  type ChosenReason,
} from "@roll-and-call/database/moderation/model";
import { z } from "zod";

import { chosenReasonSchema, idSchema, parseActionInput } from "@/shared/lib";
import { requireStaff } from "@/shared/server";

import { REVIEW_ACTION, type ReviewAction } from "../model/review-action";
import { runReviewModeration } from "./run-review-moderation";

interface SubmitReviewModerationOptions {
  reviewId: string;
  moderation: { action: ReviewAction; reason: ChosenReason | null };
}

const submitReviewModerationSchema = z.object({
  reviewId: idSchema,
  moderation: z.object({
    action: z.enum(REVIEW_ACTION),
    reason: chosenReasonSchema.nullable(),
  }),
}) satisfies z.ZodType<SubmitReviewModerationOptions>;

export async function submitReviewModeration(args: SubmitReviewModerationOptions) {
  const staff = await requireStaff();
  const { reviewId, moderation } = parseActionInput(submitReviewModerationSchema, args);
  const { action } = moderation;
  const reason =
    action === REVIEW_ACTION.unhide
      ? null
      : parseReason({ reason: moderation.reason, reasons: CONTENT_REASON });
  return runReviewModeration({ staff, reviewId, action, reason });
}
