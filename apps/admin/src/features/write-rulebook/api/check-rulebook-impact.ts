"use server";

import { getRulebookImpact, requireStaff } from "@/shared/server";

import type { RulebookDraft } from "../model/rulebook-draft";

interface CheckRulebookImpactInput {
  id: string;
  draft: RulebookDraft;
}

export async function checkRulebookImpact({ id, draft }: CheckRulebookImpactInput) {
  await requireStaff();
  return getRulebookImpact({
    rulebookId: id,
    supersedesId: draft.kind === "core" ? draft.supersedesId : null,
    certRequired: draft.certRequired,
  });
}
