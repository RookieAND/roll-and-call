import { eq } from "drizzle-orm";

import { db } from "#db/client";
import { serverMessageTexts } from "#db/schema";

import {
  defaultReviewTemplate,
  REVIEW_TEMPLATE_KEYS,
  type ReviewTemplatePart,
} from "../model/review-template";

export interface ReviewTemplate {
  title: string;
  body: string;
  // 저장된 두 양식 중 가장 늦은 저장 시각. 한 번도 저장하지 않았으면 null.
  updatedAt: Date | null;
}

const PARTS = Object.keys(REVIEW_TEMPLATE_KEYS) as ReviewTemplatePart[];

// 저장된 행이 없는 쪽은 기본 양식으로 채워 돌려준다.
export async function getReviewTemplate({
  serverId,
}: {
  serverId: string;
}): Promise<ReviewTemplate> {
  const rows = await db
    .select()
    .from(serverMessageTexts)
    .where(eq(serverMessageTexts.serverId, serverId));
  const row = (part: ReviewTemplatePart) =>
    rows.find((candidate) => candidate.textKey === REVIEW_TEMPLATE_KEYS[part]);
  const times = PARTS.flatMap((part) => row(part)?.updatedAt.getTime() ?? []);
  return {
    title: row("title")?.body ?? defaultReviewTemplate("title"),
    body: row("body")?.body ?? defaultReviewTemplate("body"),
    updatedAt: times.length > 0 ? new Date(Math.max(...times)) : null,
  };
}
